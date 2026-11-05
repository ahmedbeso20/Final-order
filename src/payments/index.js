'use strict';
// طبقة الدفع الموحّدة: تحمّل مزوّد الدفع المضبوط وتدير دورة حياة العملية بأمان.
//   pending → paid | failed | cancelled | review
// تفعيل الباقة يحدث في مكان واحد فقط (settle) وبشروط: عملية معلّقة + مبلغ مطابق + حدث غير مكرّر.
const crypto = require('node:crypto');
const { HttpError, bad } = require('../util');
const { GATEWAY_METHODS } = require('../domain');

const DAY_MS = 86400_000;
const SAFE_NAME = /^[a-z0-9_-]+$/;
const PENDING_TTL_MS = 24 * 3600_000;

function loadProvider(cfg) {
  const name = cfg.payments.provider;
  if (!name) return null;
  if (!SAFE_NAME.test(name) || name.startsWith('_')) { console.error(`[payments] اسم المزوّد غير صالح: ${name}`); return null; }
  let factory;
  try { factory = require(`./providers/${name}`); }
  catch (e) { console.error(`[payments] تعذّر تحميل المزوّد "${name}": ${e.message}`); return null; }
  const p = factory(cfg);
  if (p.mode === 'sandbox' && cfg.production && !cfg.payments.allowSandboxInProduction) {
    console.error('[payments] البيئة التجريبية معطّلة في الإنتاج. اضبط PAYMENT_PROVIDER على بوابة حقيقية.');
    return null;
  }
  p.id = name;
  return p;
}

function createPayments(app) {
  const { cfg, q, tx } = app;
  const provider = loadProvider(cfg);

  const methods = () => (provider ? provider.methods.filter((m) => GATEWAY_METHODS[m]).map((m) => GATEWAY_METHODS[m]) : []);

  /** ما يحتاجه المتصفح لرسم شباك الدفع (لا أسرار هنا) */
  const publicConfig = () => ({
    enabled: Boolean(provider),
    provider: provider ? provider.id : null,
    mode: provider ? provider.mode : null,
    sandbox: provider ? provider.mode === 'sandbox' : false,
    collectsCardData: provider ? provider.collectsCardData : false,
    currency: cfg.payments.currency,
    methods: methods(),
    testCards: provider && provider.testCards ? provider.testCards : undefined
  });

  const find = (txRef) => q('SELECT * FROM plan_payments WHERE tx_ref = ?').get(txRef);

  /** نقطة التفعيل الوحيدة — آمنة للتكرار (idempotent) */
  function settle(txRef, ev) {
    return tx(() => {
      const row = find(txRef);
      if (!row) throw new HttpError(404, 'العملية غير موجودة');
      const iso = new Date().toISOString();

      if (ev.eventId) {
        const ins = q('INSERT OR IGNORE INTO payment_events (provider, event_id, tx_ref, created_at) VALUES (?,?,?,?)').run(row.provider, ev.eventId, txRef, iso);
        if (ins.changes === 0) return { row, changed: false, duplicate: true };
      }
      if (row.status !== 'pending') return { row, changed: false };

      if (ev.status === 'paid') {
        const amountOk = Number.isFinite(ev.amount) && Math.abs(ev.amount - row.amount) < 0.01;
        const currencyOk = !ev.currency || ev.currency === row.currency;
        if (!amountOk || !currencyOk) {
          // لا نفعّل الباقة عند أي تعارض — تُراجَع يدويًا
          q("UPDATE plan_payments SET status = 'review', provider_ref = COALESCE(NULLIF(?, ''), provider_ref), updated_at = ? WHERE id = ?").run(ev.providerRef || '', iso, row.id);
          console.error(`[payments] تعارض مبلغ/عملة للعملية ${txRef}: المتوقع ${row.amount} ${row.currency} والمستلم ${ev.amount} ${ev.currency}`);
          return { row: q('SELECT * FROM plan_payments WHERE id = ?').get(row.id), changed: true, mismatch: true };
        }
        const user = q('SELECT * FROM users WHERE id = ?').get(row.user_id);
        const days = row.cycle === 'yearly' ? 365 : 30;
        // التجديد المبكر يضيف على المدة المتبقية بدلًا من إهدارها
        const current = user.plan === row.plan && user.plan_expires_at ? Date.parse(user.plan_expires_at) : 0;
        const start = Math.max(Date.now(), current || 0);
        const startIso = new Date(start).toISOString();
        const endIso = new Date(start + days * DAY_MS).toISOString();
        q("UPDATE plan_payments SET status = 'paid', provider_ref = COALESCE(NULLIF(?, ''), provider_ref), period_start = ?, period_end = ?, updated_at = ? WHERE id = ?")
          .run(ev.providerRef || '', startIso, endIso, iso, row.id);
        q('UPDATE users SET plan = ?, plan_cycle = ?, plan_expires_at = ?, default_pay_method = ?, auto_renew = 1 WHERE id = ?')
          .run(row.plan, row.cycle, endIso, row.method, row.user_id);
      } else {
        const next = ev.status === 'cancelled' ? 'cancelled' : 'failed';
        q('UPDATE plan_payments SET status = ?, updated_at = ? WHERE id = ?').run(next, iso, row.id);
      }
      return { row: q('SELECT * FROM plan_payments WHERE id = ?').get(row.id), changed: true };
    });
  }

  /** يبدأ عملية دفع: تحقق → سجل معلّق → استدعاء المزوّد → تسوية فورية أو تحويل لصفحة الدفع */
  async function checkout({ user, target, cycle, quote, method, body, baseUrl }) {
    if (!provider) throw new HttpError(503, 'الدفع الإلكتروني غير مُفعّل حاليًا. تواصل مع الدعم.');
    if (!provider.methods.includes(method)) throw bad('طريقة الدفع غير متاحة');

    const idem = body.idempotencyKey == null ? null : String(body.idempotencyKey);
    if (idem !== null && !/^[\w-]{8,64}$/.test(idem)) throw bad('مفتاح منع التكرار غير صالح');
    if (idem) {
      const existing = q('SELECT * FROM plan_payments WHERE user_id = ? AND idem_key = ?').get(user.id, idem);
      if (existing && (existing.status === 'pending' || existing.status === 'paid')) return { row: existing, reused: true };
      // محاولة فاشلة/ملغاة: تُفرَج عن المفتاح ليعاد استخدامه بمحاولة جديدة
      if (existing) q('UPDATE plan_payments SET idem_key = NULL WHERE id = ?').run(existing.id);
    }

    const checked = provider.validate({ method, input: body });
    const now = Date.now();
    const iso = new Date(now).toISOString();
    q("UPDATE plan_payments SET status = 'cancelled', updated_at = ? WHERE user_id = ? AND status = 'pending' AND created_at < ?")
      .run(iso, user.id, new Date(now - PENDING_TTL_MS).toISOString());

    const txRef = `OF-PAY-${new Date(now).getUTCFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const days = cycle === 'yearly' ? 365 : 30;
    let rowId;
    try {
      rowId = q(`INSERT INTO plan_payments (user_id, tx_ref, plan, cycle, method, amount, vat, discount, coupon, payer_info, status, period_start, period_end, created_at, provider, currency, idem_key, updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,'pending',?,?,?,?,?,?,?)`).run(
        user.id, txRef, target.id, cycle, method, quote.total, quote.vat, quote.discount, quote.coupon, checked.payerInfo || '',
        iso, new Date(now + days * DAY_MS).toISOString(), iso, provider.id, cfg.payments.currency, idem, iso
      ).lastInsertRowid;
    } catch (e) {
      if (idem && /UNIQUE/i.test(String(e.message))) return { row: q('SELECT * FROM plan_payments WHERE user_id = ? AND idem_key = ?').get(user.id, idem), reused: true };
      throw e;
    }

    const payment = q('SELECT * FROM plan_payments WHERE id = ?').get(rowId);
    let result;
    try {
      result = await provider.createCharge({
        payment, user, method, checked,
        returnUrl: `${baseUrl}/?pay_ref=${encodeURIComponent(txRef)}#/pay`,
        webhookUrl: `${baseUrl}/api/billing/webhook/${provider.id}`
      });
    } catch (e) {
      q("UPDATE plan_payments SET status = 'failed', updated_at = ? WHERE id = ?").run(new Date().toISOString(), rowId);
      throw e;
    }
    if (result.providerRef) q('UPDATE plan_payments SET provider_ref = ? WHERE id = ?').run(String(result.providerRef).slice(0, 120), rowId);

    if (result.status === 'paid') {
      settle(txRef, { status: 'paid', amount: payment.amount, currency: payment.currency, providerRef: result.providerRef });
    } else if (result.status === 'failed') {
      settle(txRef, { status: 'failed' });
      throw new HttpError(402, result.message || 'فشلت عملية الدفع، جرّب وسيلة أخرى.');
    }
    return { row: q('SELECT * FROM plan_payments WHERE id = ?').get(rowId), redirectUrl: result.redirectUrl };
  }

  /** استقبال خطاف من البوابة: توقيع صحيح ← تسوية آمنة */
  function handleWebhook(name, rawBody, headers) {
    if (!provider || name !== provider.id) throw new HttpError(404, 'مزوّد غير معروف');
    const ev = provider.parseWebhook({ rawBody, headers });
    if (ev.status === 'ignore' || !ev.txRef) return { ok: true, ignored: true };
    const out = settle(ev.txRef, ev);
    return { ok: true, status: out.row.status, duplicate: Boolean(out.duplicate) };
  }

  return { provider, active: () => provider, publicConfig, checkout, settle, handleWebhook, find };
}

module.exports = { createPayments };
