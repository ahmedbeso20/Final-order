'use strict';
// مزوّد "صفحة دفع مستضافة" عام: يصلح لمعظم البوابات (Paymob, Fawry, Stripe Checkout, Kashier ...)
// الفكرة: ننشئ طلب دفع لدى البوابة فتعيد رابط صفحة دفع نحوّل العميل إليها، ثم تُخطرنا البوابة بالنتيجة عبر خطاف موقَّع.
// بيانات البطاقة لا تمر بخادمنا إطلاقًا (تخفيض نطاق PCI-DSS إلى أدنى مستوى).
// لبوابة بصيغة مختلفة انسخ _template.js وعدّل mapRequest / mapEvent فقط.
const crypto = require('node:crypto');
const { HttpError } = require('../../util');

const PAID = new Set(['paid', 'succeeded', 'success', 'successful', 'captured', 'completed', 'approved']);
const FAILED = new Set(['failed', 'declined', 'error', 'rejected']);
const CANCELLED = new Set(['cancelled', 'canceled', 'expired', 'voided']);

/** مقارنة توقيع HMAC بزمن ثابت */
function verifySignature(secret, rawBody, given, encoding) {
  if (!secret || !given) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest(encoding);
  const g = String(given).trim().replace(/^sha256=/i, '');
  const a = Buffer.from(g), b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = function createHosted(cfg) {
  const c = cfg.payments;
  const secureUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' || (!cfg.production && x.protocol === 'http:'); } catch { return false; } };

  return {
    id: 'hosted',
    name: 'بوابة دفع مستضافة',
    mode: 'live',
    collectsCardData: false,
    methods: c.methods,

    validate() { return { payerInfo: '' }; },

    /** يحوّل بياناتنا إلى جسم طلب البوابة — عدّله حسب توثيق بوابتك */
    mapRequest({ payment, user, method, returnUrl, webhookUrl }) {
      return {
        reference: payment.tx_ref,
        amount: c.amountUnit === 'minor' ? Math.round(payment.amount * 100) : payment.amount,
        currency: payment.currency,
        method,
        description: `OrderFlow — ${payment.plan} (${payment.cycle})`,
        customer: { id: String(user.id), name: user.store_name || '', phone: user.phone || '', email: user.email || '' },
        return_url: returnUrl,
        webhook_url: webhookUrl
      };
    },

    /** يستخرج رابط الدفع ومرجع البوابة من ردّها */
    mapResponse(data) {
      return { redirectUrl: data.checkout_url || data.redirect_url || data.payment_url || data.url, providerRef: String(data.id || data.reference || data.order_id || '') };
    },

    async createCharge(ctx) {
      if (!c.apiUrl || !c.apiKey) throw new HttpError(503, 'بوابة الدفع غير مُهيّأة (PAYMENT_API_URL / PAYMENT_API_KEY).');
      let res;
      try {
        res = await cfg.fetch(c.apiUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${c.apiKey}`, 'idempotency-key': ctx.payment.tx_ref },
          body: JSON.stringify(this.mapRequest(ctx)),
          signal: AbortSignal.timeout(15_000)
        });
      } catch (e) {
        console.error('[payments:hosted] network error:', e.message);
        throw new HttpError(502, 'تعذّر الاتصال ببوابة الدفع، حاول بعد قليل.');
      }
      if (!res.ok) {
        console.error('[payments:hosted] gateway HTTP', res.status);
        throw new HttpError(502, 'رفضت بوابة الدفع إنشاء العملية، حاول لاحقًا.');
      }
      const { redirectUrl, providerRef } = this.mapResponse(await res.json().catch(() => ({})));
      if (!redirectUrl || !secureUrl(redirectUrl)) throw new HttpError(502, 'ردّ بوابة الدفع لا يحتوي رابط دفع آمنًا.');
      return { status: 'pending', providerRef, redirectUrl };
    },

    /** يتحقق من التوقيع ويحوّل حدث الخطاف إلى الصيغة الداخلية الموحّدة */
    mapEvent(json) {
      const raw = String(json.status ?? json.state ?? json.event ?? '').toLowerCase();
      const status = PAID.has(raw) ? 'paid' : FAILED.has(raw) ? 'failed' : CANCELLED.has(raw) ? 'cancelled' : 'ignore';
      const amount = Number(json.amount ?? json.amount_paid);
      return {
        eventId: String(json.event_id ?? json.id ?? ''),
        txRef: String(json.reference ?? json.merchant_reference ?? ''),
        providerRef: String(json.id ?? json.order_id ?? ''),
        status,
        amount: Number.isFinite(amount) ? (c.amountUnit === 'minor' ? amount / 100 : amount) : NaN,
        currency: String(json.currency ?? '').toUpperCase()
      };
    },

    parseWebhook({ rawBody, headers }) {
      if (!verifySignature(c.webhookSecret, rawBody, headers[c.signatureHeader], c.signatureEncoding)) {
        throw new HttpError(401, 'توقيع الخطاف غير صالح');
      }
      let json;
      try { json = JSON.parse(rawBody.toString('utf8')); } catch { throw new HttpError(400, 'صيغة الخطاف غير صالحة'); }
      return this.mapEvent(json);
    }
  };
};
module.exports.verifySignature = verifySignature;
