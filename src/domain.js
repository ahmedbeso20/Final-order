'use strict';
// ثوابت المجال التجاري المشتركة بين المسارات

const VAT = 0.14;

const MARKETS = {
  a: { name: 'أمازون مصر', fee: 12 },
  n: { name: 'نون مصر', fee: 10 },
  j: { name: 'جوميا', fee: 11 }
};

// رسوم الشحن التقديرية للطلب (عدّلها لتطابق عقدك مع شركة الشحن)
const COURIERS = {
  'بوسطة': { key: 'bosta', fee: 38, cycle: 'تحويل يومي متاح' },
  'أرامكس': { key: 'aramex', fee: 45, cycle: 'تحويل مرتين أسبوعيًا' },
  'مايلرز': { key: 'mylerz', fee: 35, cycle: 'تحويل كل خميس' }
};
const COURIER_BY_KEY = Object.fromEntries(Object.entries(COURIERS).map(([label, c]) => [c.key, label]));

const COD = 'عند الاستلام';
const PAYMENTS = [COD, 'فودافون كاش', 'إنستاباي', 'بطاقة بنكية', 'فوري'];
const PAY_BUCKET = { [COD]: 'cod', 'فودافون كاش': 'wallet', 'إنستاباي': 'wallet', 'بطاقة بنكية': 'card', 'فوري': 'card' };

const PLANS = {
  free: { id: 'free', name: 'باقة البداية', products: 50, markets: 2, ai: 15, priceMonthly: 0, priceYearly: 0 },
  pro: { id: 'pro', name: 'باقة التاجر المحترف', products: 1500, markets: 3, ai: 200, priceMonthly: 1000, priceYearly: 10000 },
  business: { id: 'business', name: 'باقة الشركات والمخازن الكبرى', products: null, markets: 3, ai: 1000, priceMonthly: 3000, priceYearly: 30000 }
};

const GATEWAY_METHODS = {
  card: { id: 'card', name: 'بطاقة بنكية (Visa / Mastercard / ميزة)', short: 'بطاقة بنكية', badge: 'تفعيل فوري 3DS' },
  instapay: { id: 'instapay', name: 'إنستاباي (InstaPay Egypt)', short: 'إنستاباي', badge: 'تحويل لحظي ٠٪ رسوم' },
  wallet: { id: 'wallet', name: 'محفظة إلكترونية (فودافون / اتصالات / أورنج)', short: 'محفظة ذكية', badge: 'تأكيد برمز OTP' },
  fawry: { id: 'fawry', name: 'فوري باي (Fawry Pay)', short: 'فوري باي', badge: 'كود مرجعي فوري' }
};

const COUPONS = {
  WELCOME20: { code: 'WELCOME20', type: 'pct', value: 20, desc: 'خصم ترحيبي ٢٠٪ على اشتراكك', oncePerUser: true },
  EGYPT10: { code: 'EGYPT10', type: 'pct', value: 10, desc: 'خصم خاص لتجار مصر ١٠٪' },
  OMNI50: { code: 'OMNI50', type: 'fixed', value: 50, desc: 'خصم نقدي فوري ٥٠ ج.م' }
};

/** حساب تكلفة الاشتراك والخصم وضريبة القيمة المضافة ١٤٪ */
function calcSubscriptionQuote(planId, cycle = 'monthly', couponCode = '') {
  const plan = PLANS[planId] || PLANS.pro;
  const isYearly = cycle === 'yearly';
  const basePrice = isYearly ? plan.priceYearly : plan.priceMonthly;
  const normCode = String(couponCode || '').trim().toUpperCase();
  const coupon = normCode && COUPONS[normCode] ? COUPONS[normCode] : null;

  let discount = 0;
  if (coupon && basePrice > 0) {
    discount = coupon.type === 'pct'
      ? Math.round((basePrice * coupon.value) / 100 * 100) / 100
      : Math.min(basePrice, coupon.value);
  }
  const total = Math.max(0, Math.round((basePrice - discount) * 100) / 100);
  const preTax = Math.round((total / (1 + VAT)) * 100) / 100;
  const vat = Math.round((total - preTax) * 100) / 100;

  return {
    planId: plan.id,
    planName: plan.name,
    cycle: isYearly ? 'yearly' : 'monthly',
    basePrice,
    discount,
    coupon: coupon ? coupon.code : '',
    couponDesc: coupon ? coupon.desc : '',
    preTax,
    vat,
    total
  };
}

// حالات الطلب: 0 قيد التجهيز، 1 تم الشحن، 2 تم التسليم، 3 مرتجع
const STATUS_NEXT = { 0: [1], 1: [2, 3] };

const INTEGRATION_KEYS = ['a', 'n', 'j', 'bs', 'ar', 'my', 'eta', 'fw', 'vc'];
const NOTIFICATION_KEYS = ['s', 'o', 'f', 'w'];

// عمولة السوق + ضريبة القيمة المضافة عليها كنسبة من إجمالي الطلب (جزء SQL)
const FEE_RATE_SQL = `(CASE market WHEN 'a' THEN ${MARKETS.a.fee} WHEN 'n' THEN ${MARKETS.n.fee} ELSE ${MARKETS.j.fee} END) / 100.0 * ${1 + VAT}`;

module.exports = {
  VAT, MARKETS, COURIERS, COURIER_BY_KEY, COD, PAYMENTS, PAY_BUCKET,
  PLANS, GATEWAY_METHODS, COUPONS, calcSubscriptionQuote,
  STATUS_NEXT, INTEGRATION_KEYS, NOTIFICATION_KEYS, FEE_RATE_SQL
};
