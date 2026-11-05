'use strict';
// مزوّد تجريبي (Sandbox): يحاكي بوابة دفع بدون أي تحصيل حقيقي. للتطوير والعرض فقط.
// لا يُفعَّل في الإنتاج إلا بضبط PAYMENT_ALLOW_SANDBOX=1 صراحةً.
const crypto = require('node:crypto');
const { HttpError, bad, text, phone, oneOf, latin } = require('../../util');

const TEST_CARDS = Object.freeze({
  approve: '4242424242424242',   // Visa — ينجح
  decline: '4000000000000002'    // يُرفض (card_declined)
});

/** خوارزمية Luhn للتحقق من رقم البطاقة */
function luhn(digits) {
  let sum = 0, dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (dbl) { n *= 2; if (n > 9) n -= 9; }
    sum += n; dbl = !dbl;
  }
  return sum % 10 === 0;
}

function cardBrand(d) {
  if (/^507803|^9\d{15}$/.test(d)) return 'Meeza';   // يُفحص قبل Mastercard (كان غير قابل للوصول سابقًا)
  if (d.startsWith('4')) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard';
  return 'Card';
}

module.exports = function createSandbox() {
  return {
    id: 'sandbox',
    name: 'بيئة تجريبية',
    mode: 'sandbox',
    collectsCardData: true,
    methods: ['card', 'instapay', 'wallet', 'fawry'],
    testCards: TEST_CARDS,

    /** يتحقق من المدخلات ويعيد بيانات آمنة للعرض فقط — لا يُخزَّن رقم البطاقة ولا CVV أبدًا */
    validate({ method, input }) {
      if (method === 'card') {
        const holder = text(input.cardHolder, 'اسم حامل البطاقة', { min: 3, max: 70 });
        const digits = latin(String(input.cardNumber ?? '')).replace(/[\s\-]/g, '');
        if (!/^\d{16}$/.test(digits) || !luhn(digits)) throw bad('رقم البطاقة غير صالح');
        const exp = latin(String(input.cardExpiry ?? '')).trim();
        const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(exp);
        if (!m) throw bad('تاريخ انتهاء البطاقة غير صالح (استخدم الصيغة MM/YY)');
        const now = new Date();
        const yy = now.getUTCFullYear() % 100, mm = now.getUTCMonth() + 1;
        if (+m[2] < yy || (+m[2] === yy && +m[1] < mm)) throw bad('البطاقة منتهية الصلاحية');
        const cvv = latin(String(input.cardCvv ?? '')).trim();
        if (!/^\d{3,4}$/.test(cvv)) throw bad('رمز الحماية CVV يجب أن يتكون من ٣ أو ٤ أرقام');
        return { payerInfo: `${cardBrand(digits)} •••• ${digits.slice(-4)} (${holder})`, decline: digits === TEST_CARDS.decline };
      }
      if (method === 'instapay') {
        const ipa = text(input.instaPayAddress, 'عنوان InstaPay أو رقم الموبايل', { min: 4, max: 65 });
        const ref = latin(text(input.transferRef || '', 'رقم مرجع التحويل', { max: 40, optional: true }));
        return { payerInfo: ref ? `${ipa} · مرجع #${ref}` : ipa };
      }
      if (method === 'wallet') {
        const wPhone = phone(input.walletPhone);
        const provider = oneOf(input.walletProvider || 'فودافون كاش', ['فودافون كاش', 'اتصالات كاش', 'أورنج كاش', 'WE Pay'], 'شركة المحفظة');
        const otp = latin(String(input.walletOtp ?? '')).trim();
        if (!/^\d{4,6}$/.test(otp)) throw bad('كود التأكيد OTP مطلوب ويتكوّن من ٤ إلى ٦ أرقام');
        return { payerInfo: `${provider} (${wPhone})` };
      }
      if (method === 'fawry') {
        const fPhone = phone(input.fawryPhone);
        // المرجع يُولَّد على الخادم (كان يُقبل من العميل بقيمة افتراضية ثابتة)
        const ref = String(crypto.randomInt(100_000_000, 999_999_999));
        return { payerInfo: `فوري #${ref} (${fPhone})` };
      }
      throw bad('طريقة الدفع غير مدعومة');
    },

    async createCharge({ payment, checked }) {
      if (checked && checked.decline) return { status: 'failed', message: 'رفضت البطاقة العملية (بطاقة اختبار الرفض).' };
      return { status: 'paid', providerRef: `SBX-${payment.tx_ref}` };
    },

    parseWebhook() { throw new HttpError(404, 'البيئة التجريبية لا تستقبل خطافات'); }
  };
};
module.exports.luhn = luhn;
