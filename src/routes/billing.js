'use strict';
// الفوترة والدفع: شباك الدفع، الكوبونات، الخطافات (Webhooks)، حالة العملية، والإيصالات.
// المنطق الحساس (التفعيل/منع التكرار/مطابقة المبلغ) في src/payments/index.js — هنا فقط طبقة HTTP.
const crypto = require('node:crypto');
const { HttpError, bad, oneOf, latin } = require('../util');
const { PLANS, GATEWAY_METHODS, COUPONS, calcSubscriptionQuote } = require('../domain');
const { subscriptionReceiptPage } = require('../pages');
const { sendText } = require('../http');

module.exports = (r, app) => {
  const { q, cfg, limiter, model, payments } = app;
  const reload = (id) => q('SELECT * FROM users WHERE id = ?').get(id);
  const cycleOf = (body) => (body.cycle === 'yearly' ? 'yearly' : 'monthly');
  const codeOf = (v) => latin(String(v ?? '')).trim().toUpperCase();

  /** عنوان الموقع العام (لروابط العودة والخطافات) — من APP_URL أو من الطلب مع تحقق صارم */
  function baseUrl(req) {
    if (cfg.appUrl) return cfg.appUrl;
    const fwd = (h) => String(req.headers[h] || '').split(',')[0].trim();
    const host = (cfg.trustProxy && fwd('x-forwarded-host')) || req.headers.host || 'localhost';
    const proto = (cfg.trustProxy && fwd('x-forwarded-proto')) || 'http';
    if (!/^[a-z0-9.\-:\[\]]+$/i.test(host) || !/^https?$/.test(proto)) throw new HttpError(400, 'ترويسة مضيف غير صالحة');
    return `${proto}://${host}`;
  }

  /** كوبون «مرة واحدة لكل حساب» لا يُستخدم ثانيةً */
  function assertCouponUsable(user, code) {
    const c = COUPONS[code];
    if (!c) throw bad('كود الخصم غير صالح');
    if (c.oncePerUser && user && q("SELECT 1 FROM plan_payments WHERE user_id = ? AND coupon = ? AND status IN ('paid','pending')").get(user.id, code)) {
      throw new HttpError(409, 'تم استخدام هذا الكود من قبل على حسابك');
    }
  }

  // إعدادات الشباك للواجهة (بدون أسرار): المزوّد، الوضع، وسائل الدفع المتاحة
  r.get('/api/billing/config', () => payments.publicConfig(), { auth: false });

  r.get('/api/billing', ({ user }) => {
    const gateway = payments.publicConfig();
    return {
      plan: model.planOf(user),
      payments: model.paymentsOf(user.id),
      gateway,
      methods: gateway.methods,
      coupons: gateway.sandbox ? Object.values(COUPONS) : [] // أكواد التجربة تظهر في البيئة التجريبية فقط
    };
  });

  r.post('/api/billing/coupon', ({ body, user, ip }) => {
    if (!limiter.hit(`cpn:${ip}`, 20, 60_000)) throw new HttpError(429, 'محاولات كثيرة، حاول بعد قليل');
    const planId = oneOf(body.plan || 'pro', Object.keys(PLANS), 'الباقة');
    const code = codeOf(body.code);
    if (!code) throw bad('أدخل كود الخصم أولًا');
    if (!COUPONS[code]) throw new HttpError(404, 'كود الخصم غير صالح أو منتهي الصلاحية');
    assertCouponUsable(user, code);
    return { ok: true, quote: calcSubscriptionQuote(planId, cycleOf(body), code) };
  }, { auth: false });

  r.post('/api/billing/checkout', async ({ req, user, body }) => {
    const target = PLANS[oneOf(body.plan, Object.keys(PLANS), 'الباقة')];
    const cycle = cycleOf(body);
    app.checkPlanDowngradeLimits(user, target);

    if (target.id === 'free') { // الباقة المجانية: لا تحصيل
      q('UPDATE users SET plan = ?, plan_cycle = ?, plan_expires_at = NULL WHERE id = ?').run('free', 'monthly', user.id);
      const fresh = reload(user.id);
      return { ok: true, status: 'paid', payment: null, plan: model.planOf(fresh), me: model.meOf(fresh) };
    }

    const provider = payments.active();
    if (!provider) throw new HttpError(503, 'الدفع الإلكتروني غير مُفعّل حاليًا. تواصل مع الدعم لتفعيل باقتك.', { code: 'PAYMENT_UNAVAILABLE' });
    if (user.is_demo && provider.mode === 'live') throw new HttpError(403, 'أنشئ حسابًا حقيقيًا لإتمام الدفع', { code: 'DEMO_NO_PAY' });
    if (!limiter.hit(`pay:${user.id}`, 8, 600_000)) throw new HttpError(429, 'محاولات دفع كثيرة، حاول بعد عدة دقائق');

    const method = oneOf(body.method || 'card', Object.keys(GATEWAY_METHODS), 'طريقة الدفع');
    // نطاق PCI: مع البوابات المستضافة يُرفض أي طلب يحمل بيانات بطاقة
    if (!provider.collectsCardData && ('cardNumber' in body || 'cardCvv' in body || 'cardExpiry' in body)) {
      throw bad('لا تُرسل بيانات البطاقة إلى الخادم؛ ستُدخلها في صفحة البوابة الآمنة.');
    }
    const code = codeOf(body.coupon);
    // إعادة إرسال نفس الطلب (نفس مفتاح منع التكرار) تعيد النتيجة الأصلية ولا تُعامَل كاستخدام ثانٍ للكوبون
    const retry = body.idempotencyKey != null && q("SELECT 1 FROM plan_payments WHERE user_id = ? AND idem_key = ? AND status IN ('pending','paid')").get(user.id, String(body.idempotencyKey));
    if (code && !retry) assertCouponUsable(user, code);
    const quote = calcSubscriptionQuote(target.id, cycle, code); // المبلغ يُحسب على الخادم دائمًا

    const out = await payments.checkout({ user, target, cycle, quote, method, body, baseUrl: baseUrl(req) });
    const fresh = reload(user.id);
    return {
      ok: true,
      status: out.row.status,
      redirectUrl: out.redirectUrl || null,
      payment: model.paymentOf(out.row),
      plan: model.planOf(fresh),
      me: model.meOf(fresh),
      payments: model.paymentsOf(user.id)
    };
  });

  // استعلام حالة عملية (تستخدمه الواجهة بعد العودة من صفحة البوابة)
  r.get('/api/billing/status/:ref', ({ user, params }) => {
    const row = payments.find(params.ref);
    if (!row || row.user_id !== user.id) throw new HttpError(404, 'العملية غير موجودة');
    const fresh = reload(user.id);
    return { ok: true, status: row.status, payment: model.paymentOf(row), plan: model.planOf(fresh), me: model.meOf(fresh), payments: model.paymentsOf(user.id) };
  });

  // خطاف البوابة: بلا كوكي ولا CSRF — الأمان بتوقيع HMAC على الجسم الخام + منع التكرار + مطابقة المبلغ
  r.post('/api/billing/webhook/:provider', ({ params, rawBody, req, ip }) => {
    if (!limiter.hit(`wh:${ip}`, 240, 60_000)) throw new HttpError(429, 'طلبات كثيرة');
    return payments.handleWebhook(params.provider, rawBody, req.headers);
  }, { auth: false, webhook: true });

  r.post('/api/billing/auto-renew', ({ user, body }) => {
    q('UPDATE users SET auto_renew = ? WHERE id = ?').run(body.autoRenew ? 1 : 0, user.id);
    return { plan: model.planOf(reload(user.id)) };
  });

  // ---- الإيصالات: رابط موقَّع قصير العمر بدل تمرير توكن الجلسة في العنوان ----
  const sign = (id, exp) => crypto.createHmac('sha256', cfg.secret).update(`receipt:${id}:${exp}`).digest('base64url');
  const validSig = (id, exp, sig) => {
    if (!sig || !(Number(exp) > Date.now() / 1000)) return false;
    const a = Buffer.from(String(sig)), b = Buffer.from(sign(id, Number(exp)));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  };

  r.post('/api/billing/payments/:id/receipt-link', ({ user, params }) => {
    const id = Number(params.id) || 0;
    const pay = q('SELECT id, status FROM plan_payments WHERE id = ? AND user_id = ?').get(id, user.id);
    if (!pay) throw new HttpError(404, 'إيصال الدفع غير موجود');
    const exp = Math.floor(Date.now() / 1000) + 600;
    return { url: `/api/billing/payments/${id}/receipt?exp=${exp}&sig=${sign(id, exp)}` };
  });

  r.get('/api/billing/payments/:id/receipt', ({ user, params, query, res }) => {
    const id = Number(params.id) || 0;
    let pay = user ? q('SELECT * FROM plan_payments WHERE id = ? AND user_id = ?').get(id, user.id) : null;
    if (!pay && validSig(id, query.exp, query.sig)) pay = q('SELECT * FROM plan_payments WHERE id = ?').get(id);
    if (!pay) throw new HttpError(404, 'إيصال الدفع غير موجود');
    if (pay.status !== 'paid') throw new HttpError(409, 'الإيصال متاح بعد تأكيد الدفع فقط');
    const owner = reload(pay.user_id);
    sendText(res, 200, subscriptionReceiptPage(pay, owner), { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store' });
  }, { auth: false });
};
