'use strict';
/**
 * قالب لتوصيل بوابة دفع جديدة (مثل paymob / kashier / stripe):
 *   1) انسخ هذا الملف إلى  src/payments/providers/<الاسم>.js   (حروف صغيرة وأرقام وشرطة فقط)
 *   2) عدّل mapRequest و mapResponse و mapEvent (أو أعد كتابة createCharge/parseWebhook كاملتين)
 *   3) فعّله:  PAYMENT_PROVIDER=<الاسم>  في ملف .env — لا حاجة لتعديل أي شيء آخر
 *
 * أبسط طريقة: ورِّث سلوك المزوّد المستضاف وغيّر الفروق فقط.
 * العقد المطلوب من أي مزوّد (Provider Interface):
 *   id, name, mode ('live'|'sandbox'), collectsCardData (false للبوابات المستضافة), methods: string[]
 *   validate({ method, input })        → { payerInfo }            // يرمي HttpError 400 عند خطأ المدخلات
 *   createCharge({ payment, user, method, checked, returnUrl, webhookUrl })
 *        → { status: 'paid'|'pending'|'failed', providerRef?, redirectUrl?, message? }
 *   parseWebhook({ rawBody, headers }) → { eventId, txRef, providerRef, status: 'paid'|'failed'|'cancelled'|'ignore', amount, currency }
 *        // يجب أن يتحقق من التوقيع ويرمي HttpError 401 إن لم يصح
 * ما تبقّى (تفعيل الباقة، منع التكرار، مطابقة المبلغ، الإيصالات) تتكفّل به src/payments/index.js.
 */
const createHosted = require('./hosted');

module.exports = function createMyGateway(cfg) {
  const base = createHosted(cfg);
  return {
    ...base,
    id: 'my-gateway',
    name: 'بوابتي',

    // مثال: بوابة تطلب المبلغ بالقروش وحقولًا بأسماء مختلفة
    mapRequest(ctx) {
      return {
        merchant_order_id: ctx.payment.tx_ref,
        amount_cents: Math.round(ctx.payment.amount * 100),
        currency: ctx.payment.currency,
        redirection_url: ctx.returnUrl,
        notification_url: ctx.webhookUrl
      };
    },
    mapResponse(data) {
      return { redirectUrl: data.iframe_url, providerRef: String(data.id) };
    },
    mapEvent(json) {
      const ev = base.mapEvent({ ...json, reference: json.merchant_order_id, status: json.success ? 'paid' : 'failed', amount: json.amount_cents / 100 });
      return ev;
    }
  };
};
