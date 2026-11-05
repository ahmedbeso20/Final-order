/* ==========================================================================
   1. الأدوات المساعدة ودوال التنسيق (Helpers & Utilities)
   ========================================================================== */
const $ = (sel) => document.querySelector(sel);
const fmtNum = (val) => (+val || 0).toLocaleString('ar-EG', { maximumFractionDigits: 1 });
const fmtEGP = (val) => fmtNum(val) + ' ج.م';
const esc = (str) => String(str ?? '').replace(/[<>&"']/g, (c) => '&#' + c.charCodeAt(0) + ';');

const ORDERFLOW_LOGO_SVG = `<svg class="logo-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="of-box-top" x1="18" y1="58" x2="88" y2="16" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6CD8EC"/>
      <stop offset="50%" stop-color="#1CB4D0"/>
      <stop offset="100%" stop-color="#0C5CA4"/>
    </linearGradient>
    <linearGradient id="of-arrow-main" x1="8" y1="108" x2="114" y2="20" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0C5CA4"/>
      <stop offset="50%" stop-color="#1CB4D0"/>
      <stop offset="100%" stop-color="#6CD8EC"/>
    </linearGradient>
    <linearGradient id="of-arrow-depth" x1="12" y1="112" x2="112" y2="30" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#073B6B"/>
      <stop offset="55%" stop-color="#094A86"/>
      <stop offset="100%" stop-color="#0C5CA4"/>
    </linearGradient>
    <linearGradient id="of-chart-sub" x1="36" y1="112" x2="104" y2="54" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#094A86"/>
      <stop offset="55%" stop-color="#0C5CA4"/>
      <stop offset="100%" stop-color="#1CB4D0"/>
    </linearGradient>
    <linearGradient id="of-circuit" x1="20" y1="98" x2="106" y2="28" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#D4F6FA"/>
      <stop offset="55%" stop-color="#ECFAFD"/>
      <stop offset="100%" stop-color="#FFFFFF"/>
    </linearGradient>
  </defs>

  <!-- 1. Isometric Shipping Box (Top Flaps & Left/Center Walls) -->
  <path d="M56 14L90 34L84 38L56 21.5L46 27.5L74 44L68 48L40 31.5L30 37.5L58 54L74 44.5L79 48.5L58 61.5L18 38L56 14Z" fill="url(#of-box-top)"/>
  <path d="M18 38L25 42V73L18 80V38Z" fill="url(#of-box-top)"/>
  <path d="M54.5 59.5L61.5 59.5V72L58 75.5L54.5 72V59.5Z" fill="url(#of-arrow-depth)"/>

  <!-- 2. Bottom-Right Cube Base & Mini Analytics Bars -->
  <path d="M35 95L41 89L56 99V95L60 95V99L89 80V59L96 52V84L58 109L35 95Z" fill="url(#of-chart-sub)"/>
  <path d="M62 88V93L66 90.5V84L62 88ZM69 81V88.5L73 86V76.5L69 81ZM76 76V84L80 81.5V72L76 76ZM83 68V79.5L87 77V64L83 68Z" fill="url(#of-box-top)"/>

  <!-- 3. Secondary Rising Trend Line & Nodes (Bottom-Right) -->
  <path d="M58 93L75 73L79 77L89 64L94 66L103 52" stroke="#1CB4D0" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M97 51L105 49L104 57Z" fill="#6CD8EC"/>
  <circle cx="89" cy="64" r="3.4" fill="#6CD8EC"/>
  <circle cx="94" cy="66" r="3.2" fill="#1CB4D0"/>

  <!-- 4. Main Rising 3D Trend Arrow (3D Depth Underside + Main Face) -->
  <path d="M8 106L42 64L58 79L92 38L84 33L115 21L109 53L101 47L58 95L42 80L21 106H8Z" fill="url(#of-arrow-depth)" transform="translate(2, 3.5)"/>
  <path d="M8 106L42 64L58 79L92 38L84 33L115 21L109 53L101 47L58 95L42 80L21 106H8Z" fill="url(#of-arrow-main)"/>

  <!-- 5. Tech Circuit Line, Nodes & Data Bars Inside Main Arrow -->
  <path d="M68 74V64M75 66V54M82 58V46M89 50V39" stroke="#ECFAFD" stroke-width="2.4" stroke-linecap="round" opacity="0.45"/>
  <path d="M18 101L42 72L58 87L103 33" stroke="url(#of-circuit)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="29" cy="88" r="3.3" fill="#D4F6FA"/>
  <circle cx="42" cy="72" r="4.2" fill="#FFFFFF"/>
  <circle cx="58" cy="87" r="4" fill="#D4F6FA"/>
  <circle cx="78" cy="63" r="3.2" fill="#FFFFFF"/>
  <circle cx="106" cy="37" r="2.8" fill="#FFFFFF"/>
  <path d="M106 37V45" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
</svg>`;
const LOGO_HTML = `<a class="logo" href="#/"><i>${ORDERFLOW_LOGO_SVG}</i><span>Order<span class="logo-sub">Flow</span></span></a>`;

const MARKETPLACES = {
  a: { name: 'أمازون مصر', domain: 'Amazon.eg', short: 'أ', bg: '#232f3e', color: '#ffffff', fee: 12, syncNote: 'مخزون وأسعار FBA / FBM متزامنة ١٠٠٪' },
  n: { name: 'نون مصر', domain: 'Noon.com', short: 'ن', bg: '#f5c400', color: '#201400', fee: 10, syncNote: 'تحديث تلقائي للكتالوج والطلبات السريعة' },
  j: { name: 'جوميا مصر', domain: 'Jumia.com.eg', short: 'ج', bg: '#f68b1e', color: '#ffffff', fee: 11, syncNote: 'ربط مباشر للمنتجات وبوالص الشحن' }
};

const ORDER_STATUS = [
  { label: 'قيد التجهيز', cls: 'wn' },
  { label: 'تم الشحن', cls: 'pr' },
  { label: 'تم التسليم', cls: 'ok' },
  { label: 'مرتجع', cls: 'er' }
];

const renderMarketChip = (key) => {
  const m = MARKETPLACES[key];
  if (!m) return '';
  return `<b class="mk-badge" title="${m.name}" style="background:${m.bg};color:${m.color}">${m.short}</b>`;
};

const renderBadge = (text, cls = '') => `<span class="badge ${cls}">${text}</span>`;

const getStockBadge = (qty) => {
  if (qty <= 5) return { text: 'منخفض جدًا', cls: 'er' };
  if (qty <= 15) return { text: 'قارب النفاد', cls: 'wn' };
  return { text: 'متوفر', cls: 'ok' };
};

const renderProgressRow = (label, pct, color, sub = '') => `
  <div style="margin: 12px 0">
    <div class="row" style="margin-bottom:5px;font-size:13.5px">
      <b>${label}</b>
      <span class="sp mu" style="font-size:12px">${sub}</span>
      <b>${fmtNum(pct)}٪</b>
    </div>
    <div class="progress"><i style="width:${Math.min(100, Math.max(0, pct))}%;background:${color}"></i></div>
  </div>
`;

const renderTable = (headers, rows) => `
  <div class="table-wrap">
    <table>
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>
        ${rows.length
          ? rows.map((r) => `<tr>${r.map((c, idx) => `<td data-label="${esc(headers[idx] || '')}">${c}</td>`).join('')}</tr>`).join('')
          : `<tr><td colspan="${headers.length}" class="ctr mu" style="padding:28px">لا توجد نتائج مطابقة للبحث</td></tr>`}
      </tbody>
    </table>
  </div>
`;

/* ==========================================================================
   2. البيانات الافتراضية وإدارة الحالة (State & API Client)
   ========================================================================== */
const DEFAULT_UI = {
  range: 30,
  marketFilter: 'all',
  heroMarket: 'all',
  mobileNavOpen: false,
  dashMenuOpen: false,
  yearlyPricing: false,
  prodQuery: '',
  prodStockFilter: 'all',
  orderQuery: '',
  orderStatusFilter: -1,
  orderPage: 1,
  authMode: 0
};

let me = null;                    // المستخدم الحالي (null = زائر)
let products = [];
let payments = [];                // سجل مدفوعات وفواتير الاشتراكات
let counts = { lowStock: 0, pendingOrders: 0 };
let planInfo = null;
let aiCache = {};                 // آخر تحليل للمستشار وآخر بحث أسعار (محفوظان على الخادم)
let aiListing = null;
let state = { ...DEFAULT_UI };    // تفضيلات الواجهة + بيانات المتجر القادمة من الخادم
const ordersById = new Map();     // طلبات الصفحة الحالية (للنوافذ المنبثقة)

// حالة شباك الدفع الإلكتروني التفاعلي (OrderFlow Payment Gateway Counter)
const pgState = {
  plan: 'pro',
  cycle: 'monthly',
  method: 'card',
  couponInput: '',
  appliedCoupon: '',
  couponDesc: '',
  cardHolder: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  instaPayAddress: '',
  transferRef: '',
  walletProvider: 'فودافون كاش',
  walletPhone: '',
  walletOtp: '',
  fawryPhone: '',
  lastReceipt: null,
  idemKey: '',          // مفتاح منع التكرار: يمنع الخصم المزدوج عند الضغط مرتين أو إعادة الإرسال
  gateway: { loaded: false, enabled: true, sandbox: true, collectsCardData: true, methods: [{ id: 'card' }, { id: 'instapay' }, { id: 'wallet' }, { id: 'fawry' }] }
};

// بيانات المعاينة التفاعلية الحية في الهيرو
const heroLiveState = {
  a: { orders: 128, revenue: 74200, profit: 1680, cod: 18400 },
  n: { orders: 86, revenue: 49500, profit: 1240, cod: 12900 },
  j: { orders: 41, revenue: 23800, profit: 760, cod: 6800 },
  lastEvent: 'تم خصم ١ قطعة من «سماعة أنكر Soundcore R50i» تلقائيًا من نون وجوميا بعد طلب جديد على أمازون مصر — منذ لحظات'
};

const HERO_SAMPLE_EVENTS = [
  { m: 'a', item: 'سماعة أنكر Soundcore R50i', gov: 'القاهرة', price: 780, net: 145 },
  { m: 'n', item: 'ماكينة قهوة إسبريسو ديلونجي', gov: 'الإسكندرية', price: 4200, net: 640 },
  { m: 'j', item: 'باور بانك شاومي ٢٠٠٠٠ مللي أمبير', gov: 'الجيزة', price: 950, net: 185 },
  { m: 'a', item: 'ساعة ذكية ألترا ضد الماء', gov: 'المنصورة', price: 620, net: 130 },
  { m: 'n', item: 'خلاط محمول قابل للشحن USB', gov: 'طنطا', price: 410, net: 95 }
];
let heroEventIdx = 0;

function loadAppState() {
  try {
    const s = JSON.parse(localStorage.getItem('omni_ui_v3') || '{}');
    if ([7, 30, 90].includes(+s.range)) state.range = +s.range;
    if (['all', 'a', 'n', 'j'].includes(s.marketFilter)) state.marketFilter = s.marketFilter;
  } catch (_) {}
}

function saveAppState() {
  try { localStorage.setItem('omni_ui_v3', JSON.stringify({ range: state.range, marketFilter: state.marketFilter })); } catch (_) {}
}

loadAppState();

let toastTimeout;
const dlg = $('#dlg');
const showToast = (msg, ms = 2800) => {
  const box = $('#toast');
  if (!box) return;
  const span = document.createElement('span');
  span.textContent = msg;
  box.replaceChildren(span);
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => box.replaceChildren(), ms);
};

/* ==========================================================================
   2.1 عميل الواجهة البرمجية والجلسة (API Client & Session)
   ========================================================================== */
class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data || {};
  }
}

const getStoredToken = () => {
  try { return localStorage.getItem('omni_token') || ''; } catch (_) { return ''; }
};

const authedUrl = (url) => {
  const t = getStoredToken();
  if (!t) return url;
  return url + (url.includes('?') ? '&' : '?') + 'token=' + encodeURIComponent(t);
};

async function api(method, url, body) {
  const token = getStoredToken();
  const headers = { 'X-Requested-With': 'omniarab' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const opts = { method, credentials: 'include', headers };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(url, opts);
  } catch (_) {
    throw new ApiError(0, 'تعذّر الاتصال بالخادم، تأكد من الإنترنت وحاول مجددًا');
  }
  const data = await res.json().catch(() => ({}));
  if (data && data.token) {
    try { localStorage.setItem('omni_token', data.token); } catch (_) {}
  }
  if (!res.ok) {
    if (res.status === 401 && me) sessionExpired();
    throw new ApiError(res.status, data.error || 'حدث خطأ غير متوقع', data);
  }
  return data;
}

async function downloadFile(url, filename, label) {
  try {
    const token = getStoredToken();
    const headers = { 'X-Requested-With': 'omniarab' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch(url, { credentials: 'include', headers });
    if (!res.ok) throw new Error('تعذر تحميل الملف');
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objUrl), 5000);
    showToast(`📥 تم تنزيل ${label} بنجاح ✓`);
  } catch (e) {
    showToast('⚠️ ' + (e.message || 'تعذر تنزيل الملف'));
  }
}

const go = (hash) => {
  state.mobileNavOpen = false;
  state.dashMenuOpen = false;
  if (location.hash === hash) renderApp();
  else location.hash = hash;
};

function applySession(d) {
  me = d.me;
  products = d.products;
  payments = d.payments || [];
  counts = d.counts;
  planInfo = d.plan;
  aiCache = d.ai || {};
  Object.assign(state, d.settings);
  if (state.instaPayHandle) pgState.instaPayAddress = state.instaPayHandle;
  if (state.storePhone) {
    pgState.walletPhone = state.storePhone;
    pgState.fawryPhone = state.storePhone;
  }
}

function clearSession() {
  me = null;
  products = [];
  payments = [];
  counts = { lowStock: 0, pendingOrders: 0 };
  planInfo = null;
  aiCache = {};
  aiListing = null;
  pgState.lastReceipt = null;
  ordersById.clear();
  try { localStorage.removeItem('omni_token'); } catch (_) {}
  Object.assign(state, { prodQuery: '', prodStockFilter: 'all', orderQuery: '', orderStatusFilter: -1, orderPage: 1 });
}

function sessionExpired() {
  clearSession();
  showToast('انتهت جلستك، سجّل الدخول من جديد', 4200);
  go('#/');
}

async function loadSession() {
  try {
    applySession(await api('GET', '/api/bootstrap'));
  } catch (e) {
    clearSession();
    if (e.status !== 401) showToast('⚠️ ' + e.message, 5000);
  }
}

const applyMeta = (r) => {
  if (r.counts) counts = r.counts;
  if (r.plan) planInfo = r.plan;
};

const upsertProducts = (list) => {
  for (const p of list || []) {
    const i = products.findIndex((x) => x.id === p.id);
    if (i > -1) products[i] = p;
    else products.unshift(p);
  }
};

/* ==========================================================================
   2.2 دوال تنسيق وعرض مشتركة
   ========================================================================== */
const arDigits = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
const num = (s) => +String(s).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const fmtDate = (iso) => new Date(iso).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
const monthName = (ym) => new Date(ym + '-01T00:00:00Z').toLocaleDateString('ar-EG', { month: 'long', timeZone: 'UTC' });

const SHORT_AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const shortMonthLabel = (ym) => {
  const mIdx = (+String(ym).slice(5, 7) || 1) - 1;
  return SHORT_AR_MONTHS[mIdx] || monthName(ym);
};

const timeAgo = (iso) => {
  if (!iso) return 'لم تتم بعد';
  const sec = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 45) return 'الآن';
  const rtf = new Intl.RelativeTimeFormat('ar-EG', { numeric: 'always' });
  if (sec < 3600) return rtf.format(-Math.round(sec / 60), 'minute');
  if (sec < 86400) return rtf.format(-Math.round(sec / 3600), 'hour');
  return rtf.format(-Math.round(sec / 86400), 'day');
};
const lastSyncLabel = () => timeAgo(state.lastSyncAt);

const GOVERNORATES = ['القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الدقهلية', 'الشرقية', 'الغربية', 'المنوفية', 'البحيرة', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد', 'مطروح', 'شمال سيناء', 'جنوب سيناء'];
const PAY_METHODS = ['عند الاستلام', 'فودافون كاش', 'إنستاباي', 'بطاقة بنكية', 'فوري'];
const COURIER_NAMES = ['بوسطة', 'أرامكس', 'مايلرز'];

const emptyState = (icon, title, text, actionHtml = '') => `
  <div class="card empty">
    <div class="empty-icon" aria-hidden="true">${icon}</div>
    <h3>${title}</h3>
    <p class="mu">${text}</p>
    ${actionHtml}
  </div>
`;
const errorState = (msg) => emptyState('⚠️', 'تعذّر تحميل البيانات', esc(msg), '<button class="btn" data-a="retry">إعادة المحاولة</button>');

async function copyText(txt) {
  try {
    await navigator.clipboard.writeText(txt);
    return true;
  } catch (_) {
    const t = document.createElement('textarea');
    t.value = txt;
    t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t);
    t.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    t.remove();
    return ok;
  }
}

function enhanceA11y(root = document) {
  root.querySelectorAll('[data-a]').forEach((el) => {
    if (el.matches('button, input, select, textarea, a[href]')) return;
    const isSwitch = el.classList.contains('switch');
    el.tabIndex = 0;
    el.setAttribute('role', isSwitch ? 'switch' : 'button');
    if (isSwitch) el.setAttribute('aria-checked', el.classList.contains('on'));
  });
}

const renderAdvisor = (a) => `
  <div class="card ai-glow">
    <div class="row-wrap" style="margin-bottom:12px">
      <span class="ai-badge" style="${a.thinking ? 'background:linear-gradient(135deg,#0C5CA4,#1CB4D0);color:#fff;border-color:transparent' : ''}">${a.thinking ? '🧠 تقرير التفكير العميق الفائق (Gemini 4 Argon)' : (a.source === 'gemini' ? '✨ تقرير المستشار الذكي Gemini' : '📊 تحليل آلي لبيانات متجرك')}</span>
      <b>${esc(a.data.headline)}</b>
      <span class="sp"></span>
      <button class="btn btn-gh btn-sm" data-a="close-advisor">إخفاء ✕</button>
    </div>
    <div class="grid-cards">
      <div class="card" style="padding:14px">
        <b class="er-tx" style="font-size:13.5px;display:block;margin-bottom:4px">أولوية تزويد المخزون</b>
        <p style="font-size:13px">${esc(a.data.urgentRestockTip)}</p>
      </div>
      <div class="card" style="padding:14px">
        <b class="ok-tx" style="font-size:13.5px;display:block;margin-bottom:4px">تعظيم صافي الأرباح</b>
        <p style="font-size:13px">${esc(a.data.profitOptimizationTip)}</p>
      </div>
      <div class="card" style="padding:14px">
        <b class="pr-tx" style="font-size:13.5px;display:block;margin-bottom:4px">السيولة وتحصيلات COD</b>
        <p style="font-size:13px">${esc(a.data.cashflowAndCodTip)}</p>
      </div>
      ${a.data.strategicPlan ? `
      <div class="card" style="padding:16px;grid-column:1/-1;background:var(--bg-sub);border:1px solid var(--bd-strong)">
        <b style="color:var(--pr);font-size:14px;display:flex;align-items:center;gap:6px;margin-bottom:6px">
          <span>الخطة الاستراتيجية التنفيذية المقترحة لمتجرك</span>
        </b>
        <div style="font-size:13.5px;line-height:1.8;white-space:pre-line">${esc(a.data.strategicPlan)}</div>
      </div>` : ''}
    </div>
  </div>
`;

const renderMarketResearch = (m) => `
  <div class="card ai-glow">
    <div class="row-wrap" style="margin-bottom:8px">
      <b>تحليل أسعار السوق المصري لـ "${esc(m.name)}"</b>
      <span class="sp"></span>
      <span class="ai-badge">Google Search + Gemini</span>
    </div>
    <div style="font-size:13.5px;line-height:1.8">${esc(m.text).replace(/\n+/g, '<br>')}</div>
    ${m.sources && m.sources.length ? `
      <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--bd);font-size:12px">
        <b class="mu">المصادر المرجعية من بحث جوجل:</b>
        <div class="row-wrap" style="margin-top:4px;gap:6px">
          ${m.sources.slice(0, 3).map((s) => `<a href="${esc(s.uri)}" target="_blank" rel="noopener noreferrer" class="badge pr" style="text-decoration:underline">${esc(s.title)} ↗</a>`).join('')}
        </div>
      </div>` : ''}
  </div>
`;

/* ==========================================================================
   3. بيانات الصفحات التسويقية والتنقل (Static Content & Navigation)
   ========================================================================== */
const NAV_LINKS = [
  { id: 'dash', icon: '📊', title: 'لوحة التحكم' },
  { id: 'prod', icon: '📦', title: 'المنتجات والمخزون', badge: () => counts.lowStock || '' },
  { id: 'ord', icon: '🧾', title: 'الطلبات والفواتير', badge: () => counts.pendingOrders || '' },
  { id: 'cod', icon: '💵', title: 'تحصيلات الشحن COD' },
  { id: 'pay', icon: '💳', title: 'شباك الدفع والاشتراك', badge: () => (planInfo && planInfo.id === 'free' ? 'ترقية' : '') },
  { id: 'ai', icon: '✨', title: 'الذكاء الاصطناعي' },
  { id: 'calc', icon: '🧮', title: 'حاسبة الأرباح' },
  { id: 'int', icon: '🔗', title: 'التكاملات والربط' },
  { id: 'set', icon: '⚙️', title: 'الإعدادات' }
];

const COUPONS_MAP = {
  WELCOME20: { code: 'WELCOME20', type: 'pct', value: 20, desc: 'خصم ترحيبي ٢٠٪ على اشتراكك' },
  EGYPT10: { code: 'EGYPT10', type: 'pct', value: 10, desc: 'خصم خاص لتجار مصر ١٠٪' },
  OMNI50: { code: 'OMNI50', type: 'fixed', value: 50, desc: 'خصم نقدي فوري ٥٠ ج.م' }
};

function getPgQuote(planId = pgState.plan, cycle = pgState.cycle, couponCode = pgState.appliedCoupon) {
  const p = PLANS.find((x) => x.id === planId) || PLANS[1];
  const isYearly = cycle === 'yearly';
  const basePrice = isYearly ? p.price * 10 : p.price;
  const c = couponCode && COUPONS_MAP[couponCode] ? COUPONS_MAP[couponCode] : null;
  let discount = 0;
  if (c && basePrice > 0) {
    discount = c.type === 'pct' ? Math.round((basePrice * c.value) / 100 * 100) / 100 : Math.min(basePrice, c.value);
  }
  const total = Math.max(0, Math.round((basePrice - discount) * 100) / 100);
  const preTax = Math.round((total / 1.14) * 100) / 100;
  const vat = Math.round((total - preTax) * 100) / 100;
  return { plan: p, isYearly, basePrice, discount, total, preTax, vat, coupon: c };
}

const FEATURES_LIST = [
  ['01. المزامنة الفورية للمخزون', 'أي قطعة تُباع على نون تُخصم تلقائيًا من أمازون وجوميا خلال ثوانٍ لمنع غرامات إلغاء الطلبات وتجميد حساب البائع.'],
  ['02. لوحة أرباح حقيقية بالجنيه', 'اعرف صافي ربحك الفعلي في جيبك بعد خصم عمولة كل منصة (١٠٪–١٢٪) وضريبة القيمة المضافة ١٤٪ وتكلفة الشحن.'],
  ['03. مطابقة تحصيلات الدفع عند الاستلام', 'كشف حساب مركزي يراقب شحناتك لدى بوسطة وأرامكس ومايلرز ويحسب المبالغ الجاهزة للتحويل على إنستاباي.'],
  ['04. الفاتورة الإلكترونية وبوالص الشحن', 'أصدر فواتير ضريبية مبسطة متوافقة مع منظومة الضرائب المصرية (ETA) برمز QR واطبع بوالص الشحن المجمّعة بضغطة زر.'],
  ['05. استوديو محتوى وتسعير بذكاء Gemini', 'ولّد عناوين متوافقة مع خوارزمية أمازون A9 ونون وجوميا، وافحص أسعار المنافسين الحية في السوق المصري عبر بحث جوجل.'],
  ['06. تقليل خسائر رفض الاستلام (RTO)', 'أرسل رسائل تأكيد طلبات احترافية عبر واتساب للعميل قبل الشحن لتقليل نسبة المرتجعات وحماية هامش ربحك.']
];

const MERCHANT_STORIES = [
  {
    quote: 'قبل OrderFlow كنا نخسر حوالي ٤٬٥٠٠ ج.م شهريًا في غرامات إلغاء طلبات على أمازون ونون بسبب بيع منتجات نفدت في المخزن. بعد الربط أصبحت المزامنة لحظية وانخفضت الإلغاءات إلى صفر.',
    name: 'م. أحمد عبد الرحمن',
    role: 'مؤسس متجر النور للإلكترونيات · القاهرة',
    metric: '−٩٦٪ غرامات نفاد المخزون خلال أول شهر'
  },
  {
    quote: 'أكبر صداع للتاجر المصري هو مطابقة شيتات بوسطة وأرامكس لمعرفة صافي تحصيلات الدفع عند الاستلام. الآن نعرف الرصيد الجاهز للسحب على إنستاباي وصافي الربح لكل قطعة بدقة.',
    name: 'أ. سارة الشناوي',
    role: 'مديرة تشغيل علامة كازا هوم للأجهزة المنزلية · الإسكندرية',
    metric: 'توفير ١٦ ساعة أسبوعيًا من الحسابات اليدوية'
  },
  {
    quote: 'حاسبة الأرباح ومستشار الذكاء الاصطناعي في OrderFlow كشفوا لنا ٣ منتجات كنا نبيعها بخسارة بعد خصم ضريبة ١٤٪ على العمولة ونسبة المرتجع. عدّلنا الأسعار وارتفع صافي ربحنا فورًا.',
    name: 'أ. كريم الجندي',
    role: 'شريك مؤسس متجر تك زون للإكسسوارات · المنصورة',
    metric: '+٢٧٪ زيادة في صافي الربح الشهري'
  }
];

const PLANS = [
  { id: 'free', name: 'باقة البداية للتجار الجدد', price: 0, desc: 'للتجار المبتدئين لتجربة المنصة مجانًا', feats: ['حتى ٥٠ منتجًا متزامنًا', 'ربط سوقين (أمازون مصر + نون)', 'لوحة التحكم وحاسبة الأرباح الدقيقة', 'تتبّع الطلبات والفواتير الأساسية'] },
  { id: 'pro', name: 'باقة التاجر المحترف', price: 1000, popular: true, desc: 'الأفضل للمتاجر النشطة متعددة القنوات في مصر', feats: ['حتى ١٬٥٠٠ منتج متزامن لحظيًا', 'ربط الأسواق الثلاثة + بوسطة وأرامكس ومايلرز', 'استوديو الذكاء الاصطناعي وفحص أسعار السوق', 'الفاتورة الإلكترونية QR وتقارير تسوية COD'] },
  { id: 'business', name: 'باقة الشركات والمخازن الكبرى', price: 3000, desc: 'للعلامات التجارية والمؤسسات عالية الطلبات', feats: ['منتجات وطلبات ومخازن غير محدودة', 'الوضع الاستراتيجي الفائق (High Thinking AI)', 'تصدير تقارير مالية وضريبية كاملة CSV', 'مدير حساب ودعم فني مباشر عبر واتساب'] }
];

const FAQS = [
  ['هل أحتاج إلى بطاقة ائتمان دولية للاشتراك في OrderFlow؟', 'إطلاقًا! باقة البداية مجانية تمامًا بدون أي بطاقة. وعند الترقية يمكنك الدفع بالجنيه المصري عبر إنستاباي، فودافون كاش، فوري، أو أي بطاقة بنكية محلية.'],
  ['كيف تمنع المنصة بيع منتج نفد مخزونه على أكثر من سوق؟', 'بمجرد تسجيل طلب جديد على أي سوق (مثل أمازون مصر)، يقوم نظام OrderFlow بخصم الكمية المتاحة فورًا من نون وجوميا في ثوانٍ، وعند تسجيل مرتجع يعيد الكمية للمخزون تلقائيًا.'],
  ['هل تدعمون حساب عمولات المنصات وضريبة ١٤٪ وخسائر رفض الاستلام؟', 'نعم، حاسبة الأرباح وتقارير لوحة التحكم تحسب تلقائيًا عمولة كل منصة (أمازون ١٢٪، نون ١٠٪، جوميا ١١٪) + ١٤٪ ضريبة القيمة المضافة على العمولة + مصاريف الشحن ومخصص المرتجعات (RTO).'],
  ['هل يمكنني تجربة لوحة التحكم الحية قبل إنشاء حساب؟', 'بكل تأكيد! اضغط على زر «استعرض لوحة التحكم الحية» في أعلى الصفحة لتفتح حسابًا تجريبيًا كاملًا يحتوي على منتجات وطلبات وتحصيلات حقيقية لتختبر كل ميزة بنفسك.']
];

/* ==========================================================================
   4. بناء الواجهة التسويقية والهيرو التفاعلي (Landing View & Hero)
   ========================================================================== */
const getHeroStats = () => {
  const mk = state.heroMarket;
  if (mk !== 'all' && heroLiveState[mk]) {
    const s = heroLiveState[mk];
    return { orders: s.orders, revenue: s.revenue, profit: s.profit, cod: s.cod, label: MARKETPLACES[mk].name };
  }
  const keys = ['a', 'n', 'j'];
  return {
    orders: keys.reduce((acc, k) => acc + heroLiveState[k].orders, 0),
    revenue: keys.reduce((acc, k) => acc + heroLiveState[k].revenue, 0),
    profit: keys.reduce((acc, k) => acc + heroLiveState[k].profit, 0),
    cod: keys.reduce((acc, k) => acc + heroLiveState[k].cod, 0),
    label: 'جميع الأسواق الثلاثة'
  };
};

const renderHeroPreviewCard = () => {
  const st = getHeroStats();
  const activeMkt = state.heroMarket;
  return `
    <div class="hero-preview-top">
      <div class="row" style="gap:10px">
        <span class="hero-brand-logo" aria-hidden="true">${ORDERFLOW_LOGO_SVG}</span>
        <div>
          <b style="font-size:15px;display:block">مركز تدفق الطلبات المباشر — OrderFlow</b>
          <small style="color:#94a3b8;font-size:12px">عرض: ${st.label} · الجنيه المصري (EGP)</small>
        </div>
      </div>
      <div class="hero-mkt-tabs" role="tablist" aria-label="تصفية معاينة الأسواق">
        ${[['all', 'الكل'], ['a', 'أمازون'], ['n', 'نون'], ['j', 'جوميا']].map(([k, lbl]) => `
          <button type="button" class="hero-mkt-tab ${activeMkt === k ? 'active' : ''}" data-a="hero-mkt" data-v="${k}">${lbl}</button>
        `).join('')}
      </div>
    </div>

    <div class="hero-mini-kpis">
      <div class="hero-mini-kpi">
        <small>صافي ربح اليوم (بعد العمولات)</small>
        <b class="profit" id="hero-profit">+${fmtEGP(st.profit)}</b>
      </div>
      <div class="hero-mini-kpi">
        <small>طلبات اليوم المتزامنة</small>
        <b id="hero-total-orders">${fmtNum(st.orders)} طلب</b>
      </div>
      <div class="hero-mini-kpi">
        <small>رصيد COD جاهز (InstaPay)</small>
        <b id="hero-cod-ready" style="color:#6CD8EC">${fmtEGP(st.cod)}</b>
      </div>
    </div>

    <div class="hero-channels-list">
      ${['a', 'n', 'j'].map((k) => {
        const m = MARKETPLACES[k];
        const ch = heroLiveState[k];
        const isHighlighted = activeMkt === k;
        return `
          <div class="hero-channel-row ${isHighlighted ? 'highlight' : ''}" data-a="hero-mkt" data-v="${activeMkt === k ? 'all' : k}" style="cursor:pointer" title="اضغط للتركيز على ${m.name}">
            ${renderMarketChip(k)}
            <div class="sp" style="min-width:0">
              <div class="row" style="gap:6px">
                <b style="font-size:14px">${m.name}</b>
                <small style="color:#94a3b8;font-size:11.5px">(${m.domain})</small>
              </div>
              <small style="color:#94a3b8;font-size:11.5px;display:block">${m.syncNote}</small>
            </div>
            <div style="text-align:end;flex-shrink:0">
              <b id="hero-ord-${k}" style="color:#6CD8EC;font-size:13.5px;display:block">${fmtNum(ch.orders)} طلب اليوم</b>
              <small style="color:#78DCC4;font-size:11.5px">صافي +${fmtEGP(ch.profit)}</small>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="hero-live-feed">
      <div class="sp" style="min-width:200px">
        <b style="display:block;font-size:12px;color:#78DCC4;margin-bottom:2px">آخر عملية مزامنة تلقائية في OrderFlow:</b>
        <span id="hero-feed-text">${esc(heroLiveState.lastEvent)}</span>
      </div>
      <button type="button" class="btn btn-sm btn-ac" data-a="hero-sim-order" title="جرب محاكاة وصول طلب جديد وخصم المخزون">⚡ محاكاة طلب جديد</button>
    </div>
  `;
};

const renderLanding = () => `
  <header class="navbar">
    <div class="container">
      ${LOGO_HTML}

      <nav class="nav-links" aria-label="التنقل الرئيسي">
        <a data-a="scroll" data-t="sec-features">المزايا</a>
        <a data-a="scroll" data-t="sec-calc-preview">حاسبة الأرباح</a>
        <a data-a="scroll" data-t="sec-stories">قصص التجار</a>
        <a data-a="scroll" data-t="sec-pricing">الباقات</a>
        <a data-a="open-pay-window" data-p="pro">شباك الدفع</a>
      </nav>

      <div class="nav-actions">
        <button class="btn btn-gh btn-sm" data-a="theme" title="تبديل المظهر النهاري والليلي" aria-label="تبديل المظهر">🌓</button>
        ${me ? `
          <a class="btn btn-gh btn-sm hide-xs" href="#/pay">💳 شباك الدفع</a>
          <a class="btn btn-ac btn-sm" href="#/dash">لوحة التحكم ◂</a>
        ` : `
          <button class="btn btn-gh btn-sm hide-xs" data-a="auth" data-m="0">تسجيل الدخول</button>
          <button class="btn btn-ac btn-sm" data-a="open-pay-window" data-p="pro">اشترك الآن</button>
        `}
        <button class="mobile-menu-btn" data-a="toggle-mobile-nav" aria-label="فتح القائمة" aria-expanded="${state.mobileNavOpen}">
          ${state.mobileNavOpen ? '✕' : '☰'}
        </button>
      </div>
    </div>

    <div class="mobile-nav-drawer ${state.mobileNavOpen ? 'open' : ''}" id="mobile-nav-drawer">
      <div class="mobile-nav-links">
        <a data-a="scroll" data-t="sec-features">المزايا والأدوات</a>
        <a data-a="scroll" data-t="sec-calc-preview">حاسبة أرباح التاجر الفورية</a>
        <a data-a="scroll" data-t="sec-compare">مقارنة الإدارة اليدوية بـ OrderFlow</a>
        <a data-a="scroll" data-t="sec-stories">قصص نجاح التجار في مصر</a>
        <a data-a="scroll" data-t="sec-pricing">الباقات والأسعار بالجنيه</a>
        <a data-a="open-pay-window" data-p="pro">💳 شباك الدفع الفوري للاشتراك</a>
        <a data-a="scroll" data-t="sec-faq">الأسئلة الشائعة</a>
      </div>
      <div class="row-wrap" style="padding-top:10px;border-top:1px solid var(--bd)">
        ${me ? `
          <a class="btn btn-ac sp" href="#/dash">الدخول للوحة التحكم</a>
          <button class="btn btn-gh" data-a="logout">تسجيل الخروج</button>
        ` : `
          <button class="btn btn-ac sp" data-a="auth" data-m="1">إنشاء حساب تاجر مجاني</button>
          <button class="btn btn-gh sp" data-a="auth" data-m="0">تسجيل الدخول</button>
          <button class="btn btn-gh" style="width:100%" data-a="demo">تجربة لوحة التحكم الحية بدون تسجيل</button>
        `}
      </div>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-copy">
          <div class="hero-kicker">
            <span>OrderFlow · نظام التشغيل المالي واللوجستي للتاجر المصري</span>
            <span>·</span>
            <span>أمازون مصر · نون · جوميا</span>
          </div>
          <h1>
            أدِر تدفّق طلباتك ومخزونك على أمازون ونون وجوميا من شاشة واحدة، واضبط <span class="hl">صافي ربحك بالجنيه</span>
          </h1>
          <p class="lead">
            تخلّص من جحيم تعديل شيتات الإكسل وغرامات نفاد المخزون. يربط <b>OrderFlow</b> متاجرك الثلاثة وشركات الشحن (بوسطة وأرامكس ومايلرز) ليخصم المخزون لحظيًا، ويحسب صافي ربحك الفعلي بعد العمولات وضريبة ١٤٪ والمرتجعات، ويتابع تحصيلات COD حتى وصولها لحسابك على إنستاباي.
          </p>
          <div class="hero-cta-group">
            <button class="btn btn-ac btn-lg" data-a="auth" data-m="1">ابدأ تجربتك المجانية الآن</button>
            <button class="btn btn-hero-sec btn-lg" data-a="demo">استعرض لوحة التحكم الحية (بدون تسجيل)</button>
          </div>
          <div class="hero-trust-meta">
            <span><b>مجانًا للتجربة</b> بدون بطاقة بنكية</span>
            <span class="sep" aria-hidden="true">·</span>
            <span><b>ربط فوري</b> خلال ٣ دقائق</span>
            <span class="sep" aria-hidden="true">·</span>
            <span><b>فواتير ضريبية QR</b> متوافقة مع ETA</span>
            <span class="sep" aria-hidden="true">·</span>
            <span><b>دعم مصري</b> عبر واتساب</span>
          </div>
        </div>

        <div class="hero-preview-card" id="hero-preview-box">
          ${renderHeroPreviewCard()}
        </div>
      </div>

      <div class="hero-metrics-strip">
        <div class="hero-metric-item">
          <b>+١٬٢٤٠ تاجر ومخزن</b>
          <span>يديرون مبيعاتهم اليومية عبر OrderFlow في ٢٧ محافظة مصرية</span>
        </div>
        <div class="hero-metric-item">
          <b>&lt; ١٥ ثانية</b>
          <span>زمن مزامنة المخزون التلقائي بين الأسواق لمنع غرامات إلغاء الطلبات</span>
        </div>
        <div class="hero-metric-item">
          <b>٩٩.٤٪ دقة تسوية COD</b>
          <span>مطابقة آلية لتحصيلات بوسطة وأرامكس ومايلرز مع حساباتك على InstaPay</span>
        </div>
        <div class="hero-metric-item">
          <b>+٢٤٪ نمو صافي الربح</b>
          <span>بفضل اكتشاف المنتجات منخفضة الهامش وضبط التسعير وحساب ضريبة ١٤٪</span>
        </div>
      </div>
    </div>
  </section>

  <div class="container" style="padding-block:22px;border-bottom:1px solid var(--bd)">
    <div class="row-wrap" style="justify-content:center;gap:10px 18px;font-size:13px;color:var(--mu)">
      <b style="color:var(--tx)">منظومة OrderFlow متكاملة مع:</b>
      <span>أمازون مصر Amazon.eg</span>
      <span>·</span>
      <span>نون مصر Noon</span>
      <span>·</span>
      <span>جوميا Jumia</span>
      <span>·</span>
      <span>بوسطة Bosta</span>
      <span>·</span>
      <span>أرامكس Aramex</span>
      <span>·</span>
      <span>مايلرز Mylerz</span>
      <span>·</span>
      <span>إنستاباي InstaPay</span>
      <span>·</span>
      <span>فودافون كاش</span>
      <span>·</span>
      <span>مصلحة الضرائب المصرية ETA</span>
    </div>
  </div>

  <section class="sec" id="sec-features">
    <div class="container">
      <div class="sec-header">
        <span class="sec-kicker">أدوات مصممة لواقع السوق المصري</span>
        <h2>كل ما يحتاجه التاجر المصري للنمو في شاشة واحدة</h2>
        <p class="mu">استغنِ عن فتح ٦ لوحات تحكم مختلفة وشيتات الحسابات المعقدة. بنينا لك كل أداة في OrderFlow لحل مشكلة يومية حقيقية تواجه التجار في مصر.</p>
      </div>
      <div class="grid-cards">
        ${FEATURES_LIST.map(f => `
          <div class="card card-hover">
            <span class="step-num">${f[0].split('.')[0]}</span>
            <h3>${f[0].split('. ')[1]}</h3>
            <p class="mu" style="font-size:14px">${f[1]}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="sec alt" id="sec-calc-preview">
    <div class="container">
      <div class="sec-header">
        <span class="sec-kicker">جرّب بنفسك الآن قبل التسجيل</span>
        <h2>حاسبة صافي ربح التاجر المصري الفورية</h2>
        <p class="mu">أدخل سعر بيع منتجك وتكلفته لترى فورًا كم يتبقى في جيبك بعد خصم عمولة المنصة وضريبة القيمة المضافة ١٤٪ والشحن ومخصص رفض الاستلام (RTO).</p>
      </div>
      <div class="grid-2" style="align-items:stretch">
        <div class="card">
          <h3>أدخل بيانات أي منتج تبيعه حاليًا</h3>
          <label for="lp-calc-mkt">السوق الإلكتروني</label>
          <select id="lp-calc-mkt" data-i="lp-calc-mkt">
            <option value="12">أمازون مصر (متوسط عمولة ١٢٪)</option>
            <option value="10">نون مصر (متوسط عمولة ١٠٪)</option>
            <option value="11">جوميا مصر (متوسط عمولة ١١٪)</option>
          </select>
          <div class="grid-equal" style="gap:12px">
            <div>
              <label for="lp-comm">عمولة الفئة (٪)</label>
              <input id="lp-comm" type="number" value="12" data-i="lp-calc-run">
            </div>
            <div>
              <label for="lp-price">سعر البيع للعميل (ج.م)</label>
              <input id="lp-price" type="number" value="650" data-i="lp-calc-run">
            </div>
          </div>
          <div class="grid-equal" style="gap:12px">
            <div>
              <label for="lp-cost">تكلفة شراء المنتج (ج.م)</label>
              <input id="lp-cost" type="number" value="360" data-i="lp-calc-run">
            </div>
            <div>
              <label for="lp-ship">الشحن والتغليف (ج.م)</label>
              <input id="lp-ship" type="number" value="40" data-i="lp-calc-run">
            </div>
          </div>
          <label for="lp-rto">نسبة رفض الاستلام المتوقعة (٪ RTO)</label>
          <input id="lp-rto" type="number" value="6" data-i="lp-calc-run">
        </div>
        <div class="card" id="lp-calc-res-box" style="display:flex;flex-direction:column;justify-content:space-between">
          ${renderProfitCalcResult([12, 650, 360, 40, 6])}
        </div>
      </div>
    </div>
  </section>

  <section class="sec" id="sec-compare">
    <div class="container">
      <div class="sec-header">
        <span class="sec-kicker">لماذا ينتقل التجار إلى OrderFlow؟</span>
        <h2>الفرق بين الإدارة اليدوية والأتمتة الكاملة</h2>
        <p class="mu">وفّر أكثر من ١٥ ساعة أسبوعيًا واحمِ حساباتك على أمازون ونون من الإيقاف بسبب أخطاء المخزون.</p>
      </div>
      <div class="grid-equal">
        <div class="card">
          <div style="margin-bottom:12px">${renderBadge('الطريقة التقليدية (شيتات إكسل و٣ لوحات منفصلة)', 'er')}</div>
          <ul style="padding-inline-start:20px;line-height:2.15;color:var(--mu)">
            <li>تعديل المخزون والأسعار يدويًا على ٣ منصات بعد كل طلب.</li>
            <li>بيع منتج نفد مخزونه بالخطأ وتعرض حسابك للغرامة أو الإيقاف.</li>
            <li>عدم معرفة الربح الحقيقي بعد خصم ١٤٪ ضريبة على العمولة والمرتجعات.</li>
            <li>تشتت مستحقات الدفع عند الاستلام بين حسابات بوسطة وأرامكس ومايلرز.</li>
          </ul>
        </div>
        <div class="card" style="border-color:var(--ok)">
          <div style="margin-bottom:12px">${renderBadge('مع OrderFlow (إدارة مركزية مؤتمتة)', 'ok')}</div>
          <ul style="padding-inline-start:20px;line-height:2.15">
            <li><b>مزامنة تلقائية فورية:</b> بيع قطعة على أمازون يخصمها فورًا من نون وجوميا.</li>
            <li><b>حاسبة وتقارير أرباح دقيقة:</b> حساب الضريبة والعمولة ورفض الاستلام تلقائيًا.</li>
            <li><b>مركز تحصيلات COD موحد:</b> متابعة مستحقات الشحن وسحبها على إنستاباي.</li>
            <li><b>ذكاء اصطناعي متخصص:</b> كتابة عناوين SEO وفحص أسعار السوق المصري بضغطة زر.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="sec alt" id="sec-stories">
    <div class="container">
      <div class="sec-header">
        <span class="sec-kicker">نتائج موثّقة من السوق المصري</span>
        <h2>تجار مصريون ضاعفوا كفاءة متاجرهم مع OrderFlow</h2>
        <p class="mu">قصص حقيقية لمتاجر ومخازن مصرية نجحت في القضاء على غرامات المنصات وضبط تدفقاتها النقدية.</p>
      </div>
      <div class="grid-3">
        ${MERCHANT_STORIES.map(s => `
          <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;gap:14px">
            <div>
              <div style="margin-bottom:12px">${renderBadge(s.metric, 'ok')}</div>
              <p style="font-size:14.5px;line-height:1.8">"${esc(s.quote)}"</p>
            </div>
            <div style="padding-top:12px;border-top:1px solid var(--bd)">
              <b style="display:block;font-size:14px">${esc(s.name)}</b>
              <small class="mu">${esc(s.role)}</small>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="sec" id="sec-pricing">
    <div class="container">
      <div class="row-wrap" style="margin-bottom:32px">
        <div>
          <span class="sec-kicker">أسعار شفافة بالجنيه المصري</span>
          <h2>اختر الباقة المناسبة لحجم مبيعات متجرك</h2>
          <p class="mu">ابدأ مجانًا بدون بطاقة بنكية، ورقِّ باقتك في أي وقت عبر إنستاباي أو فودافون كاش أو فوري.</p>
        </div>
        <span class="sp"></span>
        <div class="row" style="background:var(--bg-elev);padding:5px;border-radius:10px;border:1px solid var(--bd)">
          <button type="button" class="pill ${state.yearlyPricing ? '' : 'on'}" style="border:none" data-a="pricing-toggle" data-v="0">دفع شهري</button>
          <button type="button" class="pill ${state.yearlyPricing ? 'on' : ''}" style="border:none" data-a="pricing-toggle" data-v="1">سنوي (وفّر شهرين)</button>
        </div>
      </div>
      <div class="grid-3">
        ${PLANS.map(p => {
          const isCurrent = me && planInfo && planInfo.id === p.id;
          const displayPrice = state.yearlyPricing ? p.price * 10 : p.price;
          return `
          <div class="card" style="${p.popular ? 'border:2px solid var(--pr);position:relative' : ''};display:flex;flex-direction:column;justify-content:space-between">
            <div>
              ${p.popular ? `<div style="margin-bottom:10px">${renderBadge('الأكثر اختيارًا للمتاجر النشطة في مصر', 'pr')}</div>` : ''}
              <h3>${p.name}</h3>
              <p class="mu" style="font-size:13px;margin-bottom:12px">${p.desc}</p>
              <div style="font-size:32px;font-weight:900;margin:10px 0">
                ${fmtEGP(displayPrice)}
                <small class="mu" style="font-size:13px;font-weight:600">/ ${p.price ? (state.yearlyPricing ? 'سنويًا' : 'شهريًا') : 'مجانًا للأبد'}</small>
              </div>
              <hr style="border:0;border-top:1px solid var(--bd);margin:14px 0">
              <div style="margin-bottom:20px;line-height:2.1;font-size:14px">
                ${p.feats.map(f => `<div>✓ ${f}</div>`).join('')}
              </div>
            </div>
            <button class="btn ${p.popular ? '' : 'btn-gh'}" style="width:100%" data-a="choose-plan" data-p="${p.id}" ${isCurrent && p.price === 0 ? 'disabled' : ''}>
              ${p.price === 0
                ? (isCurrent ? 'باقتك الحالية ✓' : 'ابدأ مجانًا الآن')
                : (isCurrent ? `💳 تجديد عبر شباك الدفع (${fmtEGP(displayPrice)})` : `💳 ادفع واشترك الآن (${fmtEGP(displayPrice)})`)}
            </button>
          </div>
        `;}).join('')}
      </div>

      <div class="card ai-glow" style="margin-top:24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
        <div>
          <div class="row-wrap" style="gap:8px;margin-bottom:4px">
            <span class="ai-badge">🔒 شباك الدفع الإلكتروني الموحّد — OrderFlow Pay</span>
            <span class="mu" style="font-size:12.5px">تفعيل فوري للباقة + إيصال ضريبي إلكتروني QR</span>
          </div>
          <p class="mu" style="font-size:13.5px;margin:0">
            ادفع اشتراكك بالجنيه المصري عبر: <b>البطاقات البنكية (Visa / Mastercard / ميزة)</b> · <b>إنستاباي (InstaPay)</b> · <b>فودافون واتصالات وأورنج كاش</b> · <b>فوري باي (Fawry)</b> — استخدم الكود <code>WELCOME20</code> لخصم ٢٠٪ فوري!
          </p>
        </div>
        <button type="button" class="btn btn-ac" data-a="open-pay-window" data-p="pro">💳 فتح شباك الدفع الفوري (${fmtEGP(state.yearlyPricing ? 10000 : 1000)})</button>
      </div>
    </div>
  </section>

  <section class="sec alt" id="sec-faq">
    <div class="container" style="max-width:820px">
      <div class="sec-header">
        <span class="sec-kicker">إجابات واضحة</span>
        <h2>الأسئلة الشائعة لتجار التجارة الإلكترونية</h2>
      </div>
      ${FAQS.map(q => `
        <details>
          <summary>${q[0]}</summary>
          <p class="mu" style="margin-top:10px">${q[1]}</p>
        </details>
      `).join('')}
    </div>
  </section>

  <section class="hero" style="padding:60px 0;text-align:center">
    <div class="container" style="max-width:720px">
      <h2 style="color:#fff;font-size:clamp(1.6rem,3vw,2.4rem)">جاهز لتوحيد متاجرك وضبط أرباحك مع OrderFlow؟</h2>
      <p class="lead" style="margin:12px auto 26px">انضم لأكثر من ١٬٢٤٠ تاجرًا مصريًا أو افتح لوحة التحكم التجريبية الحية الآن بضغطة واحدة وبدون تسجيل.</p>
      <div class="hero-cta-group" style="justify-content:center">
        <button class="btn btn-ac btn-lg" data-a="auth" data-m="1">أنشئ حسابك المجاني الآن</button>
        <button class="btn btn-hero-sec btn-lg" data-a="demo">فتح لوحة التحكم التجريبية الحية</button>
      </div>
    </div>
  </section>

  <footer class="container row-wrap" style="padding-block:28px">
    ${LOGO_HTML}
    <span class="sp"></span>
    <div class="row-wrap" style="gap:16px;font-size:13.5px;color:var(--mu)">
      <a href="/omniarab.zip" download="orderflow.zip" style="text-decoration:underline">تنزيل نسخة المشروع (ZIP)</a>
      <span>·</span>
      <span>© ٢٠٢٦ OrderFlow لتقنيات التجارة الإلكترونية · صُنع لتجار مصر</span>
    </div>
  </footer>
`;

/* ==========================================================================
   5. بناء شاشات لوحة التحكم الداخليّة (Dashboard Views)
   ========================================================================== */
const views = {};

// 5.1 لوحة التحكم الرئيسية (#/dash)
const MARKET_BAR = { a: '#0C5CA4', n: '#1CB4D0', j: '#087F72' };

const renderSalesChart = (months) => {
  const rev = months.map((m) => m.revenue / 1000);
  const prof = months.map((m) => m.profit / 1000);
  const max = Math.max(1, ...rev, ...prof);

  return `
    <div class="row-wrap" style="margin-bottom:10px;font-size:12.5px">
      <span class="row"><i style="width:12px;height:12px;border-radius:4px;background:var(--pr);display:inline-block"></i> إجمالي المبيعات (ألف ج.م)</span>
      <span class="row"><i style="width:12px;height:12px;border-radius:4px;background:var(--ac);display:inline-block"></i> صافي الربح (ألف ج.م)</span>
    </div>
    <svg viewBox="0 0 640 235" width="100%" style="overflow:visible" role="img" aria-label="رسم بياني لنمو المبيعات وصافي الأرباح خلال ١٢ شهرًا">
      ${[0, 1, 2, 3, 4].map((idx) => {
        const y = 195 - idx * 42;
        return `<line x1="25" y1="${y}" x2="625" y2="${y}" stroke="var(--bd)" stroke-dasharray="4 4"/>`;
      }).join('')}
      <text x="25" y="17" fill="var(--mu)" font-size="11">${fmtNum(Math.ceil(max))} ألف</text>
      ${months.map((m, i) => {
        const hRev = (Math.max(0, rev[i]) / max) * 168;
        const hProf = (Math.max(0, prof[i]) / max) * 168;
        const x = 578 - i * 49;
        return `
          <g>
            <rect x="${x}" y="${195 - hRev}" width="18" height="${hRev}" rx="5" fill="var(--pr)" opacity="${i === 11 ? '1' : '0.82'}">
              <title>${monthName(m.ym)} — المبيعات: ${fmtNum(rev[i])} ألف ج.م</title>
            </rect>
            <rect x="${x + 20}" y="${195 - hProf}" width="14" height="${hProf}" rx="4" fill="var(--ac)">
              <title>${monthName(m.ym)} — صافي الربح: ${fmtNum(prof[i])} ألف ج.م</title>
            </rect>
            <text x="${x + 17}" y="218" text-anchor="middle" fill="var(--mu)" font-size="10.5" font-weight="700">${shortMonthLabel(m.ym)}</text>
          </g>
        `;
      }).join('')}
    </svg>
  `;
};

const renderOnboarding = () => `
  <div class="card ai-glow" style="margin-bottom:18px">
    <h3>ابدأ تجهيز متجرك على OrderFlow في ٣ خطوات</h3>
    <ol class="steps">
      <li><b>أضف منتجك الأول</b> بسعره وتكلفته وكميته ليُحسب هامش ربحك الصافي. <button class="btn btn-ac btn-sm" data-a="add-prod">+ إضافة منتج</button></li>
      <li><b>فعّل الربط مع الأسواق</b> التي تبيع عليها (أمازون، نون، جوميا). <a class="pr-tx" href="#/int">صفحة التكاملات ◂</a></li>
      <li><b>سجّل أول طلب</b> ليُخصم المخزون تلقائيًا وتظهر أرباحك هنا. <a class="pr-tx" href="#/ord">صفحة الطلبات ◂</a></li>
    </ol>
  </div>
`;

views.dash = (d) => {
  const k = d.kpis;
  const lowStockItems = products.filter((p) => p.stock <= 15);
  const delta = (v) => (v == null ? 'فترة جديدة' : `${v >= 0 ? '+' : '−'}${fmtNum(Math.abs(v))}٪ عن الفترة السابقة`);
  const cards = [
    { title: 'إجمالي المبيعات', value: fmtEGP(k.gross), badge: delta(k.grossDelta), cls: k.grossDelta == null || k.grossDelta >= 0 ? 'ok' : 'er' },
    { title: 'صافي الربح الحقيقي', value: fmtEGP(k.net), badge: `هامش ربح ${fmtNum(k.margin)}٪`, cls: k.net >= 0 ? 'ok' : 'er' },
    { title: 'عمولات وضرائب المنصات', value: fmtEGP(k.fees), badge: 'شامل ١٤٪ ق.م', cls: 'wn' },
    { title: 'إجمالي الطلبات', value: fmtNum(k.orders) + ' طلب', badge: `${fmtNum(k.deliveryRate)}٪ نسبة تسليم`, cls: 'pr' },
    { title: 'تحصيلات COD جاهزة للتحويل', value: fmtEGP(k.codReady), badge: 'بوسطة · أرامكس · مايلرز', cls: 'ok' }
  ];

  return `
    <div class="row-wrap" style="margin-bottom:16px">
      <span class="mu" style="font-weight:700;font-size:13.5px">تصفية حسب السوق:</span>
      ${[['all', 'كل الأسواق'], ['a', 'أمازون مصر'], ['n', 'نون مصر'], ['j', 'جوميا']].map((m) => `
        <span class="pill ${state.marketFilter === m[0] ? 'on' : ''}" data-a="mkt-filter" data-v="${m[0]}">${m[1]}</span>
      `).join('')}
      <span class="sp"></span>
      <label class="row" style="cursor:pointer;font-size:13px;font-weight:700;gap:6px;background:var(--bg-elev);padding:6px 14px;border-radius:8px;border:1px solid var(--bd);white-space:nowrap;align-items:center" title="تفعيل نموذج gemini-4-argon عالي التفكير لتحليل متجرك واستخراج خطة استراتيجية دقيقة">
        <input type="checkbox" id="chk-high-thinking" ${state.highThinking ? 'checked' : ''} style="cursor:pointer;width:auto;min-height:auto;margin:0" data-a="toggle-thinking">
        <span style="white-space:nowrap">🧠 وضع التفكير العميق</span>
      </label>
      <button class="btn btn-sm" style="background:linear-gradient(135deg,#0C5CA4,#1CB4D0);white-space:nowrap" data-a="ai-store-advisor" id="btn-ai-advisor">
        ${state.highThinking ? '🧠 تحليل استراتيجي فائق (High Thinking)' : '✨ تحليل المتجر بالذكاء الاصطناعي'}
      </button>
    </div>

    <div id="ai-advisor-panel" style="margin-bottom:${aiCache.advisor ? '18px' : '0'}">
      ${aiCache.advisor ? renderAdvisor(aiCache.advisor) : ''}
    </div>

    ${!products.length ? renderOnboarding() : ''}

    <div class="grid-kpi">
      ${cards.map((c) => `
        <div class="card kpi-card">
          <span class="mu" style="font-size:13px;font-weight:700">${c.title}</span>
          <b>${c.value}</b>
          <div>${renderBadge(c.badge, c.cls)}</div>
        </div>
      `).join('')}
    </div>

    <div class="grid-2" style="margin-top:18px">
      <div class="card">
        <div class="row-wrap" style="margin-bottom:6px">
          <h3>نمو المبيعات وصافي الأرباح (١٢ شهرًا)</h3>
          <span class="sp"></span>
          <span class="mu" style="font-size:12px">مرّر الماوس على الأعمدة للتفاصيل</span>
        </div>
        ${renderSalesChart(d.months)}
      </div>

      <div class="card">
        <h3>توزيع المبيعات حسب السوق</h3>
        ${['a', 'n', 'j'].map((m) => renderProgressRow(MARKETPLACES[m].name, d.marketShare[m].pct, MARKET_BAR[m], fmtEGP(d.marketShare[m].amount))).join('')}

        <h3 style="margin-top:20px">طرق الدفع المفضلة للعملاء</h3>
        ${renderProgressRow('الدفع عند الاستلام (COD)', d.payShare.cod, 'var(--ac)')}
        ${renderProgressRow('فودافون كاش وإنستاباي', d.payShare.wallet, 'var(--pr)')}
        ${renderProgressRow('البطاقات البنكية وفوري', d.payShare.card, 'var(--wn)')}
      </div>
    </div>

    <div class="grid-2" style="margin-top:18px">
      <div class="card">
        <div class="row" style="margin-bottom:12px">
          <h3>أحدث الطلبات الواردة</h3>
          <span class="sp"></span>
          <a class="pr-tx" style="font-size:13px;font-weight:700" href="#/ord">عرض الكل ◂</a>
        </div>
        ${d.recent.length ? renderTable(
          ['رقم الطلب', 'السوق', 'العميل', 'المحافظة', 'الإجمالي', 'الحالة'],
          d.recent.map((o) => [
            `<b>#${arDigits(o.no)}</b>`,
            renderMarketChip(o.market),
            esc(o.customer),
            esc(o.gov),
            `<b>${fmtEGP(o.total)}</b>`,
            renderBadge(ORDER_STATUS[o.status].label, ORDER_STATUS[o.status].cls)
          ])
        ) : '<p class="mu ctr" style="padding:24px">لا توجد طلبات بعد. ستظهر هنا فور تسجيل أول طلب.</p>'}
      </div>

      <div class="card">
        <div class="row" style="margin-bottom:10px">
          <h3>تنبيهات مخزون أوشك على النفاد</h3>
          <span class="sp"></span>
          <a class="pr-tx" style="font-size:13px;font-weight:700" href="#/prod">إدارة المخزون ◂</a>
        </div>
        ${lowStockItems.length ? lowStockItems.map((p) => {
          const sb = getStockBadge(p.stock);
          return `
            <div class="row-wrap" style="padding:9px 0;border-bottom:1px solid var(--bd)">
              <div class="sp" style="min-width:160px">
                <b style="font-size:14px;display:block">${esc(p.name)}</b>
                <small class="mu">SKU: ${esc(p.sku)} · متبقي <b>${fmtNum(p.stock)}</b> قطع</small>
              </div>
              ${renderBadge(sb.text, sb.cls)}
              <button class="btn btn-gh btn-sm" data-a="quick-restock" data-id="${p.id}" title="تزويد ١٠ قطع فورًا">+١٠ قطع</button>
            </div>
          `;
        }).join('') : `<p class="mu ctr" style="padding:20px">${products.length ? 'جميع منتجاتك متوفرة بكميات آمنة!' : 'أضف منتجاتك لتظهر هنا تنبيهات المخزون.'}</p>`}
      </div>
    </div>
  `;
};

// 5.2 صفحة المنتجات والمخزون (#/prod)
const renderProductsTable = () => {
  if (!products.length) {
    return emptyState('📦', 'لا توجد منتجات بعد', 'أضف أول منتج بسعره وتكلفته وكميته لنحسب لك هامش الربح ونتابع مخزونك.', '<button class="btn btn-ac" data-a="add-prod">+ إضافة أول منتج</button>');
  }
  const q = state.prodQuery.trim().toLowerCase();
  const filtered = products.filter(p => {
    const matchesQuery = (p.name + ' ' + p.sku + ' ' + (p.cat || '')).toLowerCase().includes(q);
    const matchesStock =
      state.prodStockFilter === 'all' ||
      (state.prodStockFilter === 'low' && p.stock <= 5) ||
      (state.prodStockFilter === 'warn' && p.stock > 5 && p.stock <= 15) ||
      (state.prodStockFilter === 'ok' && p.stock > 15);
    return matchesQuery && matchesStock;
  });

  return renderTable(
    ['المنتج', 'SKU', 'الأسواق النشطة', 'التكلفة', 'سعر البيع', 'هامش الربح', 'المخزون', 'الحالة', 'إجراءات'],
    filtered.map(p => {
      const margin = p.price ? ((p.price - p.cost) / p.price) * 100 : 0;
      const sb = getStockBadge(p.stock);
      return [
        `<div><b>${esc(p.name)}</b><br><small class="mu">${esc(p.cat || 'عام')}</small></div>`,
        `<code dir="ltr" style="background:var(--bg-sub);padding:2px 7px;border-radius:6px">${esc(p.sku)}</code>`,
        `<div class="row" style="gap:5px;justify-content:flex-end">${['a', 'n', 'j'].map(k => `
          <span style="cursor:pointer;opacity:${p.markets.includes(k) ? '1' : '0.25'}" data-a="toggle-prod-mkt" data-id="${p.id}" data-m="${k}" title="اضغط لتفعيل/إيقاف السوق">
            ${renderMarketChip(k)}
          </span>
        `).join('')}</div>`,
        fmtEGP(p.cost),
        `<b>${fmtEGP(p.price)}</b>`,
        renderBadge(fmtNum(margin) + '٪', margin >= 25 ? 'ok' : margin >= 12 ? 'wn' : 'er'),
        `<b>${fmtNum(p.stock)}</b>`,
        renderBadge(sb.text, sb.cls),
        `<div class="row" style="gap:6px;justify-content:flex-end">
          <button class="btn btn-gh btn-sm" data-a="edit-prod" data-id="${p.id}">✎ تعديل</button>
          <button class="btn btn-gh btn-sm" data-a="quick-restock" data-id="${p.id}">+١٠</button>
        </div>`
      ];
    })
  );
};

views.prod = () => `
  <div class="card">
    <div class="row-wrap" style="margin-bottom:14px">
      <span class="pill ${state.prodStockFilter === 'all' ? 'on' : ''}" data-a="prod-flt" data-v="all">الكل (${fmtNum(products.length)})</span>
      <span class="pill ${state.prodStockFilter === 'ok' ? 'on' : ''}" data-a="prod-flt" data-v="ok">متوفر</span>
      <span class="pill ${state.prodStockFilter === 'warn' ? 'on' : ''}" data-a="prod-flt" data-v="warn">قارب النفاد</span>
      <span class="pill ${state.prodStockFilter === 'low' ? 'on' : ''}" data-a="prod-flt" data-v="low">منخفض جدًا</span>
      <span class="sp"></span>
      <button class="btn btn-gh btn-sm" data-a="export-prod-csv">📥 تصدير الكتالوج CSV</button>
      <button class="btn btn-ac btn-sm" data-a="add-prod">+ إضافة منتج جديد</button>
    </div>
    <input data-i="prod-search" placeholder="🔍 ابحث باسم المنتج أو كود SKU أو الفئة..." value="${esc(state.prodQuery)}">
    <p class="mu" style="font-size:12.5px;margin-bottom:10px">نصيحة: اضغط على أيقونة السوق (أ / ن / ج) بجانب أي منتج لتشغيل أو إيقاف عرضه على تلك المنصة فورًا.</p>
    <div id="prod-table-box">${renderProductsTable()}</div>
  </div>
`;

// 5.3 صفحة الطلبات والفواتير (#/ord)
const renderPager = (d) => (d.pages > 1 ? `
  <div class="pager">
    <button class="btn btn-gh btn-sm" data-a="ord-page" data-v="${d.page - 1}" ${d.page <= 1 ? 'disabled' : ''}>▸ السابق</button>
    <span class="mu">صفحة ${fmtNum(d.page)} من ${fmtNum(d.pages)} · ${fmtNum(d.total)} طلب</span>
    <button class="btn btn-gh btn-sm" data-a="ord-page" data-v="${d.page + 1}" ${d.page >= d.pages ? 'disabled' : ''}>التالي ◂</button>
  </div>
` : `<p class="mu pager-note">${fmtNum(d.total)} طلب</p>`);

const renderOrdersTable = (d) => {
  d.items.forEach((o) => ordersById.set(o.id, o));
  if (!d.total && !state.orderQuery && state.orderStatusFilter < 0) {
    return emptyState('🧾', 'لا توجد طلبات بعد', 'سجّل أول طلب ليُخصم المخزون تلقائيًا وتُحسب أرباحك.', '<button class="btn btn-ac" data-a="new-order">+ طلب جديد</button>');
  }
  return renderTable(
    ['رقم الطلب', 'السوق', 'العميل / المنتجات', 'المحافظة', 'الدفع', 'الشحن', 'الإجمالي', 'الحالة', 'إجراءات'],
    d.items.map((o) => [
      `<b>#${arDigits(o.no)}</b><br><small class="mu">${fmtDate(o.createdAt)}</small>`,
      renderMarketChip(o.market),
      `<div><b>${esc(o.customer)}</b><br><small class="mu">${esc(o.items || 'منتجات متنوعة')}</small></div>`,
      esc(o.gov),
      esc(o.pay),
      esc(o.courier),
      `<b>${fmtEGP(o.total)}</b>`,
      renderBadge(ORDER_STATUS[o.status].label, ORDER_STATUS[o.status].cls),
      `<div class="row" style="gap:6px;flex-wrap:wrap;justify-content:flex-end">
        ${o.status === 0 ? `<button class="btn btn-gh btn-sm" data-a="set-status" data-id="${o.id}" data-s="1">تم الشحن ◂</button>` : ''}
        ${o.status === 1 ? `
          <button class="btn btn-gh btn-sm" data-a="set-status" data-id="${o.id}" data-s="2">تم التسليم ✓</button>
          <button class="btn btn-gh btn-sm" data-a="set-status" data-id="${o.id}" data-s="3" title="رفض العميل الاستلام">↩ مرتجع</button>` : ''}
        <button class="btn btn-gh btn-sm" style="color:var(--pr)" data-a="ai-order-msg" data-id="${o.id}">💬 رسالة ذكية</button>
        <button class="btn btn-gh btn-sm" data-a="view-invoice" data-id="${o.id}">🧾 فاتورة</button>
      </div>`
    ])
  ) + renderPager(d);
};

views.ord = (d) => `
  <div class="card">
    <div class="row-wrap" style="margin-bottom:16px">
      ${[[-1, 'كل الطلبات'], [0, 'قيد التجهيز'], [1, 'تم الشحن'], [2, 'تم التسليم'], [3, 'مرتجع']].map((s) => `
        <span class="pill ${state.orderStatusFilter === s[0] ? 'on' : ''}" data-a="ord-flt" data-v="${s[0]}">${s[1]}</span>
      `).join('')}
      <span class="sp"></span>
      <button class="btn btn-ac btn-sm" data-a="new-order">+ طلب جديد</button>
      <button class="btn btn-gh btn-sm" data-a="bulk-awb">🚚 بوالص الشحن (${fmtNum(counts.pendingOrders)})</button>
      <button class="btn btn-gh btn-sm" data-a="export-ord-csv">📥 تصدير CSV</button>
      <input class="ord-search-input" style="width:230px;margin:0" placeholder="🔍 ابحث برقم الطلب أو العميل..." aria-label="بحث في الطلبات" value="${esc(state.orderQuery)}" data-i="ord-search">
    </div>
    <div id="ord-table-box">${renderOrdersTable(d)}</div>
  </div>
`;

// 5.4 صفحة تحصيلات الشحن COD (#/cod)
const COURIER_TITLES = { bosta: 'بوسطة (Bosta)', aramex: 'أرامكس (Aramex)', mylerz: 'مايلرز (Mylerz)' };

views.cod = (d) => {
  const t = d.totals;
  const ipa = d.instaPayHandle || state.instaPayHandle;
  const kpi = (title, value, badge) => `
    <div class="card kpi-card">
      <span class="mu" style="font-size:13px;font-weight:700">${title}</span>
      <b>${value}</b>
      <div>${badge}</div>
    </div>`;
  return `
    <div class="grid-kpi">
      ${kpi('رصيد جاهز للتحويل (بعد الرسوم)', fmtEGP(t.net), renderBadge('جاهز للسحب الفوري', 'ok'))}
      ${kpi('شحنات قيد التوصيل', fmtEGP(t.pending), renderBadge('لم تُحصَّل بعد', 'pr'))}
      ${kpi('رسوم الشحن المخصومة', fmtEGP(t.fees), renderBadge('على الرصيد الحالي', 'wn'))}
      ${kpi('حساب الاستلام (InstaPay)', `<span dir="ltr" style="font-size:17px">${ipa ? esc(ipa) : 'غير مُضاف'}</span>`,
        ipa ? renderBadge('InstaPay جاهز', 'ok') : '<a class="pr-tx" href="#/set" style="font-size:12.5px;font-weight:700">أضف حساب InstaPay ◂</a>')}
    </div>

    <div class="grid-cards" style="margin-top:18px">
      ${d.couriers.map((c) => `
        <div class="card">
          <div class="row" style="margin-bottom:10px">
            <h3>${COURIER_TITLES[c.key]}</h3>
            <span class="sp"></span>
            ${renderBadge(c.cycle, 'pr')}
          </div>
          <div class="row" style="padding:6px 0"><span class="mu">محصّل لم يُسوَّ بعد</span><span class="sp"></span><b>${fmtEGP(c.collected)}</b></div>
          <div class="row" style="padding:6px 0"><span class="mu">قيد التوصيل</span><span class="sp"></span><b>${fmtEGP(c.pending)}</b></div>
          <div class="row" style="padding:6px 0"><span class="mu">رسوم مخصومة</span><span class="sp"></span><b class="er-tx">− ${fmtEGP(c.fees)}</b></div>
          <div class="row" style="padding:10px 0 0;border-top:1px solid var(--bd);margin-top:6px">
            <b>صافي القابل للسحب</b><span class="sp"></span><b class="ok-tx" style="font-size:18px">${fmtEGP(c.net)}</b>
          </div>
          <button class="btn ${c.net > 0 ? 'btn-ac' : 'btn-gh'}" style="width:100%;margin-top:12px" data-a="payout-cod" data-k="${c.key}" ${c.net > 0 ? '' : 'disabled'}>
            ${c.net > 0 ? '💸 طلب تحويل فوري (InstaPay)' : 'لا يوجد رصيد للسحب حاليًا'}
          </button>
        </div>
      `).join('')}
    </div>
    <p class="mu" style="font-size:12.5px;margin-top:14px">الأرصدة تُحسب آليًا من طلباتك: يدخل الطلب في «المحصّل» عند تسجيل تسليمه وتُخصم رسوم الشحن التقديرية، ثم يُسوَّى عند تسجيل التحويل إلى حسابك على إنستاباي.</p>
  `;
};

// 5.5 صفحة الذكاء الاصطناعي (#/ai)
const renderAIListingCards = (data) => {
  const suggestions = [
    { m: 'a', name: 'عنوان متوافق مع خوارزمية أمازون مصر (A9)', text: data.amazonTitle },
    { m: 'n', name: 'عنوان جذاب لمنصة نون مصر (Noon SEO)', text: data.noonTitle },
    { m: 'j', name: 'عنوان ترويجي لمنصة جوميا (Jumia)', text: data.jumiaTitle }
  ];

  return `
    <div class="row-wrap" style="margin-bottom:10px">
      <span class="ai-badge">${data.source === 'gemini' ? '✨ تم التوليد بواسطة Gemini' : '📝 قالب جاهز — فعّل مفتاح Gemini للتوليد الذكي'}</span>
      <span class="sp"></span>
      ${data.pricingTip ? renderBadge(esc(data.pricingTip), 'ok') : ''}
    </div>
    ${suggestions.map((s, idx) => `
      <div class="card" style="margin-bottom:12px">
        <div class="row" style="margin-bottom:6px">
          ${renderMarketChip(s.m)}
          <b style="font-size:14px">${s.name}</b>
          <span class="sp"></span>
          <button class="btn btn-gh btn-sm" data-a="copy-tx" data-target="ai-t-${idx}">📋 نسخ</button>
        </div>
        <p id="ai-t-${idx}" style="background:var(--bg);padding:10px;border-radius:8px;font-weight:600">${esc(s.text)}</p>
      </div>
    `).join('')}
    <div class="card">
      <div class="row" style="margin-bottom:8px">
        <b>الوصف التسويقي والنقاط البيعية (Bullet Points)</b>
        <span class="sp"></span>
        <button class="btn btn-gh btn-sm" data-a="copy-tx" data-target="ai-desc-box">📋 نسخ الوصف</button>
      </div>
      <div id="ai-desc-box" style="background:var(--bg);padding:12px;border-radius:10px;font-size:14px">
        <p>${esc(data.descriptionIntro)}</p>
        <ul style="padding-inline-start:20px;margin:8px 0">
          ${(data.bulletPoints || []).map(bp => `<li>${esc(bp)}</li>`).join('')}
        </ul>
        <p class="mu" style="font-size:12.5px;margin-top:8px"><b>الكلمات المفتاحية المقترحة (SEO Keywords):</b> ${esc(data.keywords)}</p>
      </div>
    </div>
  `;
};

views.ai = () => `
  <div class="grid-2">
    <div>
      <div class="card ai-glow" style="margin-bottom:18px">
        <div class="row" style="margin-bottom:8px">
          <h3>استوديو المحتوى والـ SEO بذكاء Gemini</h3>
          <span class="sp"></span>
          <span class="ai-badge">Gemini AI</span>
        </div>
        <p class="mu" style="font-size:13.5px;margin-bottom:14px">اختر منتجًا من كتالوجك أو اكتب مواصفاته، وسيقوم نموذج <b>Gemini</b> بصياغة عناوين متوافقة مع خوارزميات أمازون ونون وجوميا في مصر مع نقاط بيعية مقنعة.</p>

        <label for="ai-select-prod-el">اختر من منتجاتك الحالية (اختياري)</label>
        <select id="ai-select-prod-el" data-i="ai-select-prod">
          <option value="">— اختر منتجًا لتعبئة البيانات تلقائيًا —</option>
          ${products.map(p => `<option value="${p.id}">${esc(p.name)} (${fmtEGP(p.price)})</option>`).join('')}
        </select>

        <label for="ai-name">اسم المنتج الأساسي</label>
        <input id="ai-name" maxlength="140" placeholder="مثال: سماعة بلوتوث لاسلكية عازلة للضوضاء">

        <label for="ai-feats">أهم المميزات والمواصفات (افصل بينها بفاصلة)</label>
        <input id="ai-feats" maxlength="400" placeholder="مثال: بطارية ٣٠ ساعة، مايك عازل للضوضاء، ضمان سنة">

        <label for="ai-tone">نبرة الكتابة التسويقية</label>
        <select id="ai-tone">
          <option value="احترافية مقنعة تناسب المتسوق المصري">احترافية مقنعة تناسب المتسوق المصري</option>
          <option value="ترويجية حماسية تركز على العروض والتوفير">ترويجية حماسية تركز على العروض والتوفير</option>
          <option value="لهجة مصرية قريبة وبسيطة تزيد الثقة">لهجة مصرية قريبة وبسيطة تزيد الثقة</option>
          <option value="تقنية دقيقة تبرز المواصفات الفنية والجودة">تقنية دقيقة تبرز المواصفات الفنية والجودة</option>
        </select>

        <div class="row-wrap" style="margin-top:6px">
          <button class="btn sp" id="btn-ai-gen" data-a="ai-generate">✨ توليد المحتوى بذكاء Gemini</button>
          <button class="btn btn-gh" id="btn-ai-search" data-a="ai-market-search" title="البحث عن أسعار المنتج والمنافسين في مصر عبر Google Search">🌐 فحص أسعار السوق بمصر</button>
        </div>
      </div>

      <div id="ai-market-box">
        ${(aiCache.market ? renderMarketResearch(aiCache.market) : '') || `
          <div class="card" style="border-style:dashed">
            <div class="row">
              <span style="font-size:22px">🌐</span>
              <div>
                <b style="font-size:14px">رادار أسعار المنافسين المباشر (Google Search Grounding)</b>
                <p class="mu" style="font-size:12.5px">اضغط على <b>"فحص أسعار السوق بمصر"</b> أعلاه ليقوم Gemini بالبحث المباشر في الويب عن متوسط أسعار هذا المنتج في المتاجر المصرية وتقديم نصيحة تسعير.</p>
              </div>
            </div>
          </div>
        `}
      </div>
    </div>

    <div id="ai-output">
      ${aiListing ? renderAIListingCards(aiListing) : emptyState('✨', 'جاهز لكتابة قوائم منتجاتك', 'اختر منتجًا من كتالوجك أو اكتب مواصفاته ثم اضغط «توليد المحتوى بذكاء Gemini».')}
    </div>
  </div>
`;

// 5.6 حاسبة الأرباح (#/calc)
function renderProfitCalcResult([commPct, price, cost, ship, rtoPct]) {
  const platformFee = (price * commPct) / 100;
  const vatOnFee = platformFee * 0.14;
  const rtoLoss = (rtoPct / 100) * (ship * 1.8);
  const totalDeductions = platformFee + vatOnFee + cost + ship + rtoLoss;
  const netProfit = price - totalDeductions;
  const margin = price > 0 ? (netProfit / price) * 100 : 0;
  const breakEven = (cost + ship + rtoLoss) / Math.max(0.1, 1 - (commPct * 1.14) / 100);
  const pctBar = (v) => (price > 0 ? Math.max(0, (v / price) * 100) : 0);

  const rowItem = (label, val, sub = '') => `
    <div class="row" style="padding:8px 0;border-bottom:1px solid var(--bd)">
      <span class="sp">${label} <small class="mu">${sub}</small></span>
      <b>${fmtEGP(val)}</b>
    </div>
  `;

  return `
    <div>
      <h3>تحليل ربحية القطعة الواحدة</h3>
      <div class="row" style="gap:2px;height:14px;border-radius:99px;overflow:hidden;margin:10px 0 16px;background:var(--bg-sub)">
        <i style="height:100%;width:${pctBar(cost)}%;background:#64748b" title="تكلفة المنتج"></i>
        <i style="height:100%;width:${pctBar(ship + rtoLoss)}%;background:#0C5CA4" title="الشحن ومرتجعات"></i>
        <i style="height:100%;width:${pctBar(platformFee + vatOnFee)}%;background:#1CB4D0" title="عمولة المنصة والضريبة"></i>
        <i style="height:100%;width:${pctBar(netProfit)}%;background:#087F72" title="صافي الربح"></i>
      </div>

      ${rowItem('سعر البيع للعميل', price)}
      ${rowItem('تكلفة شراء / تصنيع المنتج', cost)}
      ${rowItem('عمولة المنصة', platformFee, `(${fmtNum(commPct)}٪)`)}
      ${rowItem('ضريبة القيمة المضافة على العمولة', vatOnFee, '(١٤٪ قانوني)')}
      ${rowItem('تكلفة الشحن والتغليف', ship)}
      ${rowItem('مخصص خسارة رفض الاستلام (RTO)', rtoLoss, `(${fmtNum(rtoPct)}٪ مرتجع)`)}
    </div>

    <div>
      <div class="row" style="padding-top:16px">
        <span class="sp"><b>صافي الربح في جيبك للقطعة</b></span>
        <b class="${netProfit < 0 ? 'er-tx' : 'ok-tx'}" style="font-size:26px">${fmtEGP(netProfit)}</b>
      </div>
      <div class="row" style="margin-top:6px">
        <span class="sp mu">هامش الربح الصافي</span>
        ${renderBadge(fmtNum(margin) + '٪', netProfit < 0 ? 'er' : margin < 12 ? 'wn' : 'ok')}
      </div>
      <div class="row" style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--bd);font-size:13px">
        <span class="sp mu">نقطة التعادل (أقل سعر بيع لتجنب الخسارة):</span>
        <b>${fmtEGP(Math.ceil(breakEven))}</b>
      </div>
    </div>
  `;
}

views.calc = () => `
  <div class="grid-2">
    <div class="card">
      <h3>حاسبة أرباح المنصات المصرية</h3>
      <p class="mu" style="font-size:13.5px;margin-bottom:14px">احسب ربحك الصافي بدقة شاملة ١٤٪ ضريبة القيمة المضافة على رسوم المنصة ومخصص رفض الاستلام.</p>

      <label for="c-mkt-sel">اختر المنصة لتعبئة العمولة التقريبية</label>
      <select id="c-mkt-sel" data-i="calc-mkt">
        <option value="12">أمازون مصر (متوسط عمولة ١٢٪)</option>
        <option value="10">نون مصر (متوسط عمولة ١٠٪)</option>
        <option value="11">جوميا مصر (متوسط عمولة ١١٪)</option>
      </select>

      <div class="grid-equal" style="gap:12px">
        <div>
          <label for="c-comm">عمولة الفئة (٪)</label>
          <input id="c-comm" type="number" value="12" data-i="calc-run">
        </div>
        <div>
          <label for="c-price">سعر البيع للعميل (ج.م)</label>
          <input id="c-price" type="number" value="450" data-i="calc-run">
        </div>
      </div>

      <div class="grid-equal" style="gap:12px">
        <div>
          <label for="c-cost">تكلفة المنتج عليك (ج.م)</label>
          <input id="c-cost" type="number" value="250" data-i="calc-run">
        </div>
        <div>
          <label for="c-ship">الشحن والتغليف (ج.م)</label>
          <input id="c-ship" type="number" value="38" data-i="calc-run">
        </div>
      </div>

      <label for="c-rto">نسبة رفض الاستلام المتوقعة (٪ RTO)</label>
      <input id="c-rto" type="number" value="5" data-i="calc-run">
    </div>

    <div class="card" id="calc-res-box" style="display:flex;flex-direction:column;justify-content:space-between">
      ${renderProfitCalcResult([12, 450, 250, 38, 5])}
    </div>
  </div>
`;

// 5.7 صفحة التكاملات (#/int)
const INTEGRATIONS_GROUPS = [
  {
    title: 'الأسواق الإلكترونية (Marketplaces)',
    items: [
      { key: 'a', name: 'أمازون مصر (Amazon Seller Central)', sub: 'مزامنة المخزون، الأسعار، والطلبات FBA / FBM' },
      { key: 'n', name: 'نون مصر (Noon Partners)', sub: 'مزامنة الكتالوج والطلبات السريعة' },
      { key: 'j', name: 'جوميا مصر (Jumia Vendor Center)', sub: 'ربط المنتجات وبوالص الشحن' }
    ]
  },
  {
    title: 'شركات الشحن والتحصيل (Couriers & COD)',
    items: [
      { key: 'bs', name: 'بوسطة (Bosta Egypt)', sub: 'إصدار بوالص الشحن وتتبّع تحصيلات COD' },
      { key: 'ar', name: 'أرامكس (Aramex)', sub: 'شحن لجميع محافظات الجمهورية' },
      { key: 'my', name: 'مايلرز (Mylerz)', sub: 'توصيل سريع في نفس اليوم للقاهرة والإسكندرية' }
    ]
  },
  {
    title: 'المدفوعات ومنظومة الضرائب المصرية',
    items: [
      { key: 'eta', name: 'منظومة الفاتورة الإلكترونية (ETA)', sub: 'مصلحة الضرائب المصرية · إصدار فواتير QR' },
      { key: 'fw', name: 'فوري باي (Fawry Pay)', sub: 'تحصيل المدفوعات الإلكترونية' },
      { key: 'vc', name: 'فودافون كاش وإنستاباي', sub: 'تسوية الحسابات والمحافظ الذكية' }
    ]
  }
];

views.int = () => INTEGRATIONS_GROUPS.map(g => `
  <h3 style="margin:20px 0 10px">${g.title}</h3>
  <div class="grid-cards">
    ${g.items.map(item => {
      const isOn = !!state.integrations[item.key];
      return `
        <div class="card row">
          ${MARKETPLACES[item.key] ? renderMarketChip(item.key) : ''}
          <div class="sp">
            <b>${item.name}</b>
            <p class="mu" style="font-size:12.5px">${item.sub}</p>
            <small class="${isOn ? 'ok-tx' : 'mu'}" style="font-weight:700">
              ${isOn ? 'متصل · آخر مزامنة: ' + lastSyncLabel() : 'غير متصل'}
            </small>
          </div>
          <span class="switch ${isOn ? 'on' : ''}" data-a="toggle-int" data-k="${item.key}" title="تفعيل أو إيقاف الربط"></span>
        </div>
      `;
    }).join('')}
  </div>
`).join('');

const demoBanner = () => `
  <div class="demo-banner" role="note">
    <span>أنت تتصفح حسابًا تجريبيًا على OrderFlow ببيانات جاهزة (تُحذف تلقائيًا بعد ٢٤ ساعة).</span>
    <button class="btn btn-ac btn-sm" data-a="auth" data-m="1">أنشئ حساب متجرك المجاني</button>
  </div>
`;

const loaders = {
  dash: () => api('GET', `/api/dashboard?range=${state.range}&market=${state.marketFilter}`),
  ord: () => api('GET', `/api/orders?${new URLSearchParams({ status: state.orderStatusFilter, q: state.orderQuery, page: state.orderPage })}`),
  cod: () => api('GET', '/api/cod'),
  pay: () => api('GET', '/api/billing')
};

/* ==========================================================================
   5.7.1 شباك الدفع الإلكتروني وبوابة الاشتراكات (OrderFlow Pay Counter & View)
   ========================================================================== */
const PG_METHOD_META = {
  card: ['💳', 'بطاقة بنكية', 'Visa / ميزة'],
  instapay: ['⚡', 'إنستاباي', 'تحويل لحظي'],
  wallet: ['📱', 'محفظة ذكية', 'فودافون / اتصالات'],
  fawry: ['🏪', 'فوري باي', 'كود مرجعي']
};

/** خوارزمية Luhn — فحص أولي على المتصفح (الخادم يعيد الفحص دائمًا) */
const luhnOk = (d) => {
  let sum = 0, dbl = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = d.charCodeAt(i) - 48;
    if (dbl) { n *= 2; if (n > 9) n -= 9; }
    sum += n; dbl = !dbl;
  }
  return sum % 10 === 0;
};
const pgCardBrand = (d) => (/^507803|^9\d{15}$/.test(d) ? 'MEEZA ميزة' : d.startsWith('4') ? 'VISA' : /^(5[1-5]|2[2-7])/.test(d) ? 'MASTERCARD' : 'BANK CARD');

const ensurePgGateway = async () => {
  if (pgState.gateway.loaded) return;
  try { pgState.gateway = { ...(await api('GET', '/api/billing/config')), loaded: true }; } catch (_) { /* نبقي الإعداد الافتراضي */ }
};
const pgMethodIds = () => pgState.gateway.methods.map((x) => x.id).filter((id) => PG_METHOD_META[id]);

function renderPgMethodForm() {
  const g = pgState.gateway;
  // بوابة مستضافة: لا حقول حساسة عندنا إطلاقًا — التحويل لصفحة البوابة المرخّصة
  if (!g.collectsCardData) {
    return `
      <div class="pg-redirect-note" role="note">
        <span class="pg-redirect-ic" aria-hidden="true">🔐</span>
        <div>
          <b>ستنتقل إلى صفحة الدفع الآمنة</b>
          <p class="mu">تُدخل بيانات الدفع لدى بوابة الدفع المرخّصة مباشرةً، ولا تمر بيانات بطاقتك أو محفظتك بخوادمنا. يُفعَّل اشتراكك تلقائيًا فور تأكيد البوابة للعملية.</p>
        </div>
      </div>`;
  }
  const m = pgState.method;
  const banner = `<div class="pg-sandbox-banner" role="note"><span aria-hidden="true">🧪</span><span>بيئة تجريبية — لا يُخصم أي مبلغ حقيقي. بطاقة النجاح <bdi dir="ltr">4242 4242 4242 4242</bdi> · بطاقة الرفض <bdi dir="ltr">4000 0000 0000 0002</bdi></span></div>`;

  if (m === 'card') {
    const raw = String(pgState.cardNumber || '').replace(/\D/g, '');
    const formatted = (raw.padEnd(16, '•').match(/.{1,4}/g) || []).join(' ');
    return `
      ${banner}
      <div class="pg-bank-card" aria-hidden="true">
        <div class="row" style="justify-content:space-between">
          <span class="pg-card-chip"></span>
          <b class="pg-card-brand" id="pg-card-preview-brand">${pgCardBrand(raw)}</b>
        </div>
        <div class="pg-card-num" id="pg-card-preview-num" dir="ltr">${esc(formatted)}</div>
        <div class="row" style="justify-content:space-between">
          <div><small class="pg-card-cap">CARD HOLDER</small><b id="pg-card-preview-holder" dir="ltr">${esc(pgState.cardHolder || 'MERCHANT NAME')}</b></div>
          <div style="text-align:end"><small class="pg-card-cap">EXPIRES</small><b id="pg-card-preview-exp" dir="ltr">${esc(pgState.cardExpiry || 'MM/YY')}</b></div>
        </div>
      </div>

      <div class="row-wrap" style="justify-content:space-between;margin-bottom:6px">
        <label for="pg-card-holder" style="margin:0">اسم حامل البطاقة (كما يظهر عليها)</label>
        <button type="button" class="btn btn-gh btn-sm" data-a="pg-fill-demo-card">⚡ تعبئة بطاقة تجريبية</button>
      </div>
      <input id="pg-card-holder" dir="ltr" autocomplete="cc-name" placeholder="AHMED ELNOOR" value="${esc(pgState.cardHolder)}" data-i="pg-card-input">

      <label for="pg-card-num">رقم البطاقة</label>
      <input id="pg-card-num" dir="ltr" inputmode="numeric" autocomplete="cc-number" maxlength="19" placeholder="0000 0000 0000 0000" value="${esc(pgState.cardNumber)}" data-i="pg-card-input">

      <div class="grid-equal" style="gap:12px">
        <div>
          <label for="pg-card-exp">تاريخ الانتهاء</label>
          <input id="pg-card-exp" dir="ltr" inputmode="numeric" autocomplete="cc-exp" maxlength="5" placeholder="MM/YY" value="${esc(pgState.cardExpiry)}" data-i="pg-card-input">
        </div>
        <div>
          <label for="pg-card-cvv">رمز الأمان CVV</label>
          <input id="pg-card-cvv" dir="ltr" type="password" inputmode="numeric" autocomplete="cc-csc" maxlength="4" placeholder="•••" value="${esc(pgState.cardCvv)}" data-i="pg-card-input">
        </div>
      </div>`;
  }

  if (m === 'instapay') {
    return `
      ${banner}
      <div class="pg-ipa-box">
        <div class="row-wrap" style="justify-content:space-between;margin-bottom:6px">
          <div>
            <small class="mu" style="display:block">عنوان الدفع الفوري للمنصة (InstaPay IPA)</small>
            <b dir="ltr" class="pg-ipa-addr">orderflow.pay@instapay</b>
          </div>
          <button type="button" class="btn btn-gh btn-sm" data-a="pg-copy-ipa" data-v="orderflow.pay@instapay">📋 نسخ العنوان</button>
        </div>
        <small class="mu">حوّل قيمة الاشتراك من تطبيق إنستاباي ثم أدخل عنوانك أو رقم الموبايل المحوّل منه.</small>
      </div>

      <label for="pg-ipa-addr">عنوان InstaPay الخاص بك أو رقم الموبايل</label>
      <input id="pg-ipa-addr" dir="ltr" placeholder="username@instapay أو 010xxxxxxxx" value="${esc(pgState.instaPayAddress)}" data-i="pg-field-sync">

      <label for="pg-ipa-ref">رقم مرجع التحويل (اختياري)</label>
      <input id="pg-ipa-ref" dir="ltr" placeholder="IPN-000000" value="${esc(pgState.transferRef)}" data-i="pg-field-sync">`;
  }

  if (m === 'wallet') {
    return `
      ${banner}
      <label for="pg-wallet-prov">شبكة المحفظة الذكية</label>
      <select id="pg-wallet-prov" data-i="pg-field-sync">
        ${['فودافون كاش', 'اتصالات كاش', 'أورنج كاش', 'WE Pay'].map((w) => `<option ${pgState.walletProvider === w ? 'selected' : ''}>${w}</option>`).join('')}
      </select>

      <label for="pg-wallet-phone">رقم موبايل المحفظة</label>
      <input id="pg-wallet-phone" dir="ltr" inputmode="tel" autocomplete="tel" placeholder="01012345678" value="${esc(pgState.walletPhone)}" data-i="pg-field-sync">

      <div class="row-wrap" style="justify-content:space-between;margin-bottom:6px">
        <label for="pg-wallet-otp" style="margin:0">كود التأكيد OTP</label>
        <button type="button" class="btn btn-gh btn-sm" data-a="pg-send-otp">📲 إرسال كود تجريبي</button>
      </div>
      <input id="pg-wallet-otp" dir="ltr" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••" value="${esc(pgState.walletOtp)}" data-i="pg-field-sync">`;
  }

  return `
    ${banner}
    <div class="pg-fawry-ticket">
      <small class="mu" style="display:block;font-weight:700">كود الدفع المرجعي عبر فوري</small>
      <div class="pg-fawry-code" dir="ltr">••• ••• •••</div>
      <span class="badge wn">يُصدَر الكود بعد تأكيد الطلب ويصلح ٤٨ ساعة في منافذ فوري وتطبيق MyFawry</span>
    </div>

    <label for="pg-fawry-phone">رقم الموبايل المسجّل لإشعار السداد</label>
    <input id="pg-fawry-phone" dir="ltr" inputmode="tel" autocomplete="tel" placeholder="01012345678" value="${esc(pgState.fawryPhone)}" data-i="pg-field-sync">`;
}

function renderPaymentGatewayCounter(inModal = false) {
  const q = getPgQuote();
  const receipt = pgState.lastReceipt;
  const g = pgState.gateway;
  if (!g.enabled) {
    return `<div class="pg-unavailable"><span aria-hidden="true">🛠️</span><h3>الدفع الإلكتروني غير مُفعّل حاليًا</h3><p class="mu">نعمل على تفعيل بوابة الدفع. يمكنك الاستمرار بالباقة المجانية الآن أو التواصل معنا لتفعيل باقتك يدويًا.</p></div>`;
  }
  const ids = pgMethodIds();
  if (!ids.includes(pgState.method)) pgState.method = ids[0] || 'card';
  const submitLabel = g.collectsCardData ? `🔒 إتمام الدفع الآمن (${fmtEGP(q.total)})` : `🔒 المتابعة إلى صفحة الدفع الآمنة (${fmtEGP(q.total)})`;

  if (receipt) {
    return `
      <div style="padding:28px 24px;text-align:center">
        <div style="width:58px;height:58px;border-radius:50%;background:var(--ok-soft);color:var(--ok);display:inline-grid;place-items:center;font-size:28px;font-weight:900;margin-bottom:12px">✓</div>
        <h3 style="font-size:21px;margin-bottom:6px">تم سداد الاشتراك وتفعيل «${esc(receipt.planName)}» بنجاح!</h3>
        <p class="mu" style="margin-bottom:18px">تم توثيق العملية عبر شباك الدفع الإلكتروني وإصدار فاتورتك الضريبية المعتمدة.</p>

        <div class="card" style="max-width:520px;margin:0 auto 18px;text-align:start;background:var(--bg)">
          <div class="row" style="padding:6px 0;border-bottom:1px dashed var(--bd)">
            <span class="mu">رقم العملية المرجعي</span>
            <span class="sp"></span>
            <code dir="ltr" style="font-weight:800;color:var(--pr)">${esc(receipt.txRef)}</code>
          </div>
          <div class="row" style="padding:6px 0;border-bottom:1px dashed var(--bd)">
            <span class="mu">الباقة والدورة</span>
            <span class="sp"></span>
            <b>${esc(receipt.planName)} (${receipt.cycle === 'yearly' ? 'سنوي' : 'شهري'})</b>
          </div>
          <div class="row" style="padding:6px 0;border-bottom:1px dashed var(--bd)">
            <span class="mu">وسيلة السداد</span>
            <span class="sp"></span>
            <b>${esc(receipt.methodShort)} — <span dir="ltr">${esc(receipt.payerInfo)}</span></b>
          </div>
          <div class="row" style="padding:6px 0;border-bottom:1px dashed var(--bd)">
            <span class="mu">سريان الاشتراك حتى</span>
            <span class="sp"></span>
            <b>${fmtDate(receipt.periodEnd)}</b>
          </div>
          <div class="row" style="padding:8px 0 2px">
            <b>الإجمالي المسدَّد (شامل ١٤٪ ق.م)</b>
            <span class="sp"></span>
            <b class="ok-tx" style="font-size:20px">${fmtEGP(receipt.amount)}</b>
          </div>
        </div>

        <div class="row-wrap" style="justify-content:center;gap:10px">
          <button type="button" class="btn" data-a="open-receipt" data-id="${receipt.id}">🧾 فتح وطباعة الإيصال الضريبي (QR) ↗</button>
          <button type="button" class="btn btn-gh" data-a="pg-new-payment">إجراء عملية دفع أخرى</button>
          ${inModal ? '<button type="button" class="btn btn-ac" data-a="pg-go-dash">الانتقال إلى لوحة التحكم ◂</button>' : ''}
        </div>
      </div>
    `;
  }

  return `
    <form class="pg-window" data-submit="pg-submit-checkout" novalidate>
      <div class="pg-main">
        <div class="row-wrap" style="justify-content:space-between;margin-bottom:12px">
          <div>
            <div class="pg-step"><span class="pg-step-n">١</span><div><b>اختر الباقة ودورة الفوترة</b><small class="mu">يمكنك الترقية أو التجديد في أي وقت</small></div></div>
          </div>
          <div class="row" style="background:var(--bg);padding:4px;border-radius:9px;border:1px solid var(--bd);gap:4px">
            <button type="button" class="pill ${pgState.cycle === 'monthly' ? 'on' : ''}" style="border:none;min-height:30px;padding:4px 11px;font-size:12px" data-a="pg-select-cycle" data-v="monthly">شهري</button>
            <button type="button" class="pill ${pgState.cycle === 'yearly' ? 'on' : ''}" style="border:none;min-height:30px;padding:4px 11px;font-size:12px" data-a="pg-select-cycle" data-v="yearly">سنوي (وفّر شهرين)</button>
          </div>
        </div>

        <div class="pg-plan-tabs">
          ${PLANS.filter((x) => x.price > 0).map((p) => {
            const pPrice = pgState.cycle === 'yearly' ? p.price * 10 : p.price;
            const active = pgState.plan === p.id;
            return `
              <button type="button" class="pg-plan-card ${active ? 'active' : ''}" data-a="pg-select-plan" data-p="${p.id}">
                <div class="row" style="justify-content:space-between;width:100%">
                  <b style="font-size:13.5px">${p.name}</b>
                  ${p.popular ? renderBadge('الأشهر', 'pr') : ''}
                </div>
                <div style="font-size:20px;font-weight:900;color:var(--pr)">
                  ${fmtEGP(pPrice)} <small class="mu" style="font-size:11.5px;font-weight:600">/ ${pgState.cycle === 'yearly' ? 'سنة' : 'شهر'}</small>
                </div>
                <small class="mu" style="font-size:11.5px">${p.feats[0]} · ${p.feats[1]}</small>
              </button>
            `;
          }).join('')}
        </div>

        <div class="pg-step"><span class="pg-step-n">٢</span><div><b>اختر وسيلة الدفع</b></div></div>
        <div class="pg-method-tabs" role="radiogroup" aria-label="وسائل الدفع المتاحة">
          ${ids.map((k) => { const [ic, title, sub] = PG_METHOD_META[k]; return `
            <button type="button" role="radio" aria-checked="${pgState.method === k}" class="pg-method-btn ${pgState.method === k ? 'active' : ''}" data-a="pg-select-method" data-m="${k}">
              <span class="pg-method-ic" aria-hidden="true">${ic}</span>
              <span>${title}</span>
              <small class="mu">${sub}</small>
            </button>`; }).join('')}
        </div>

        <div id="pg-method-body">
          ${renderPgMethodForm()}
        </div>

        <p id="pg-err" class="pg-err er-tx" role="alert"></p>

        <button type="submit" class="btn btn-ac btn-lg pg-submit" id="btn-pg-submit" data-label="${esc(submitLabel)}">
          ${submitLabel}
        </button>
      </div>

      <div class="pg-side">
        <div>
          <div class="row" style="justify-content:space-between;margin-bottom:12px">
            <b style="font-size:15px">ملخص فاتورة الاشتراك</b>
            ${renderBadge('شامل الضريبة ١٤٪', 'ok')}
          </div>

          <div class="pg-summary-box">
            <div class="row" style="padding:6px 0;border-bottom:1px solid var(--bd)">
              <div>
                <b style="display:block;font-size:14px">${esc(q.plan.name)}</b>
                <small class="mu">${q.isYearly ? 'دورة فوترة سنوية (١٢ شهرًا — شهران مجانًا)' : 'دورة فوترة شهرية (٣٠ يومًا)'}</small>
              </div>
              <span class="sp"></span>
              <b style="white-space:nowrap">${fmtEGP(q.basePrice)}</b>
            </div>

            <div style="padding:10px 0;border-bottom:1px solid var(--bd)">
              <label for="pg-coupon-inp" style="font-size:12px;margin-bottom:4px">هل لديك كود خصم ترويجي؟</label>
              <div class="pg-coupon-row">
                <input id="pg-coupon-inp" dir="ltr" placeholder="مثال: WELCOME20" value="${esc(pgState.couponInput)}" data-i="pg-coupon-typing">
                <button type="button" class="btn btn-gh btn-sm" data-a="pg-apply-coupon">تطبيق</button>
              </div>
              <div class="row-wrap" style="gap:6px;margin-top:6px">
                ${g.sandbox ? '<small class="mu" style="font-size:11.5px">أكواد متاحة للتجربة:</small>' : ''}
                ${(g.sandbox ? Object.values(COUPONS_MAP) : []).map((c) => `
                  <button type="button" class="badge ${pgState.appliedCoupon === c.code ? 'ok' : 'pr'}" style="border:none;cursor:pointer" data-a="pg-quick-coupon" data-c="${c.code}" title="${c.desc}">
                    ${c.code}
                  </button>
                `).join('')}
                ${pgState.appliedCoupon ? `<button type="button" class="badge er" style="border:none;cursor:pointer" data-a="pg-clear-coupon">إلغاء الكوبون ✕</button>` : ''}
              </div>
            </div>

            <div class="row" style="padding:6px 0;font-size:13px">
              <span class="mu">القيمة قبل الضريبة</span>
              <span class="sp"></span>
              <span>${fmtEGP(q.preTax)}</span>
            </div>
            <div class="row" style="padding:6px 0;font-size:13px">
              <span class="mu">ضريبة القيمة المضافة (١٤٪)</span>
              <span class="sp"></span>
              <span>${fmtEGP(q.vat)}</span>
            </div>
            ${q.discount > 0 ? `
              <div class="row" style="padding:6px 0;font-size:13px;color:var(--ok)">
                <b>خصم الكوبون (${esc(q.coupon.code)})</b>
                <span class="sp"></span>
                <b>− ${fmtEGP(q.discount)}</b>
              </div>
            ` : ''}

            <div class="row" style="padding:10px 0 2px;border-top:1px dashed var(--bd);margin-top:6px">
              <b style="font-size:15px">الإجمالي المطلوب دفعه</b>
              <span class="sp"></span>
              <b class="pr-tx" style="font-size:22px">${fmtEGP(q.total)}</b>
            </div>
          </div>

          <div style="margin-top:14px;font-size:12.5px;line-height:1.9;color:var(--mu)">
            <div>✓ تفعيل لحظي لجميع مزايا الباقة وحدود المنتجات</div>
            <div>✓ إصدار فاتورة ضريبية إلكترونية رسمية برمز QR</div>
            <div>✓ إمكانية إلغاء التجديد التلقائي في أي وقت بدون شروط</div>
          </div>
        </div>

        <div class="card" style="padding:12px;background:var(--bg-elev);font-size:12px">
          <div class="row" style="gap:8px">
            <span style="font-size:18px">🛡️</span>
            <div>
              ${g.sandbox
                ? '<b style="display:block">بيئة تجريبية</b><span class="mu">لا يُخصم أي مبلغ حقيقي ولا تُخزَّن بيانات البطاقة.</span>'
                : '<b style="display:block">دفع مؤمّن</b><span class="mu">تُعالَج العملية لدى بوابة دفع مرخّصة، ولا تمر بيانات بطاقتك بخوادمنا.</span>'}
            </div>
          </div>
        </div>
      </div>
    </form>
  `;
}

// 5.7.2 صفحة شباك الدفع والاشتراك في لوحة التحكم (#/pay)
views.pay = (d) => {
  if (d && d.plan) planInfo = d.plan;
  if (d && d.payments) payments = d.payments;
  if (d && d.gateway) pgState.gateway = { ...d.gateway, loaded: true };
  const p = planInfo || { id: 'free', name: 'باقة البداية', used: 0, limit: 50, markets: 2, aiLimit: 15, aiUsed: 0, cycle: 'monthly', autoRenew: true };
  const activeMarkets = ['a', 'n', 'j'].filter((k) => state.integrations && state.integrations[k]).length;

  return `
    <div class="grid-kpi" style="margin-bottom:18px">
      <div class="card kpi-card">
        <span class="mu" style="font-size:13px;font-weight:700">باقة اشتراكك الحالية</span>
        <b>${esc(p.name)}</b>
        <div>${renderBadge(p.id === 'free' ? 'باقة مجانية' : (p.cycle === 'yearly' ? 'اشتراك سنوي نشط ✓' : 'اشتراك شهري نشط ✓'), p.id === 'free' ? 'wn' : 'ok')}</div>
      </div>
      <div class="card kpi-card">
        <span class="mu" style="font-size:13px;font-weight:700">استهلاك سعة المنتجات</span>
        <b>${fmtNum(p.used)} / ${p.limit == null ? '∞' : fmtNum(p.limit)}</b>
        <div>${renderBadge(p.limit == null ? 'غير محدود' : `متبقي ${fmtNum(Math.max(0, p.limit - p.used))} منتج`, 'pr')}</div>
      </div>
      <div class="card kpi-card">
        <span class="mu" style="font-size:13px;font-weight:700">الأسواق المربوطة وحصة الذكاء الاصطناعي</span>
        <b>${fmtNum(activeMarkets)} من ${fmtNum(p.markets)} أسواق</b>
        <div>${renderBadge(`استهلاك AI اليوم: ${fmtNum(p.aiUsed || 0)} من ${fmtNum(p.aiLimit || 200)}`, 'ok')}</div>
      </div>
      <div class="card kpi-card">
        <span class="mu" style="font-size:13px;font-weight:700">تاريخ التجديد القادم</span>
        <b style="font-size:19px">${p.expiresAt ? fmtDate(p.expiresAt) : 'مفتوح (مجاني)'}</b>
        <div class="row" style="justify-content:space-between;margin-top:2px">
          <small class="mu" style="font-weight:700">تجديد تلقائي</small>
          <span class="switch ${p.autoRenew ? 'on' : ''}" data-a="toggle-autorenew" title="تفعيل أو إيقاف التجديد التلقائي للاشتراك"></span>
        </div>
      </div>
    </div>

    <div class="card" style="padding:0;overflow:hidden;margin-bottom:22px;border:2px solid var(--pr)">
      <div class="row-wrap" style="padding:16px 22px;background:linear-gradient(135deg,#071E38 0%,#0C5CA4 100%);color:#fff">
        <div>
          <span class="ai-badge" style="margin-bottom:4px">💳 شباك الدفع الإلكتروني الفوري — OrderFlow Pay</span>
          <h3 style="margin:0;color:#fff;font-size:18px">اشترك أو جدّد باقتك الآن بالجنيه المصري (١٬٠٠٠ ج.م للباقة الاحترافية / ٣٬٠٠٠ ج.م للشركات والمخازن)</h3>
        </div>
        <span class="sp"></span>
        <span style="font-size:12.5px;color:#cbd5e1">🔒 دفع مشفّر · تفعيل فوري · فاتورة ضريبية QR</span>
      </div>
      <div id="pay-page-counter-box">
        ${renderPaymentGatewayCounter(false)}
      </div>
    </div>

    <div class="card">
      <div class="row-wrap" style="margin-bottom:14px">
        <div>
          <h3 style="margin:0">سجل مدفوعات الاشتراك والإيصالات الضريبية</h3>
          <small class="mu">جميع العمليات المسددة عبر شباك الدفع وفواتيرها الضريبية المعتمدة</small>
        </div>
        <span class="sp"></span>
        <button type="button" class="btn btn-gh btn-sm" data-a="open-pay-window" data-p="pro">💳 فتح شباك الدفع في نافذة منبثقة</button>
      </div>
      ${payments.length ? renderTable(
        ['رقم العملية', 'الباقة', 'الدورة', 'وسيلة الدفع', 'بيانات الدافع', 'التاريخ', 'الخصم', 'الإجمالي المسدَّد', 'الحالة', 'الإيصال الضريبي'],
        payments.map((py) => [
          `<code dir="ltr" style="font-weight:700;color:var(--pr)">${esc(py.txRef)}</code>`,
          `<b>${esc(py.planName)}</b>`,
          py.cycle === 'yearly' ? 'سنوي (١٢ شهرًا)' : 'شهري (٣٠ يومًا)',
          esc(py.methodShort),
          `<span dir="ltr" class="mu" style="font-size:12.5px">${esc(py.payerInfo || '—')}</span>`,
          fmtDate(py.createdAt),
          py.discount > 0 ? `<span class="ok-tx">−${fmtEGP(py.discount)} (${esc(py.coupon)})</span>` : '—',
          `<b>${fmtEGP(py.amount)}</b>`,
          ({ paid: renderBadge('مدفوع ✓', 'ok'), pending: renderBadge('قيد التأكيد…', 'wn'), failed: renderBadge('فشلت', 'er'), cancelled: renderBadge('ملغاة', 'er'), review: renderBadge('قيد المراجعة', 'wn') })[py.status] || renderBadge(esc(py.status), ''),
          py.status === 'paid' ? `<button type="button" class="btn btn-gh btn-sm" data-a="open-receipt" data-id="${py.id}">🧾 إيصال ضريبي QR ↗</button>` : '—'
        ])
      ) : emptyState('💳', 'لا توجد مدفوعات سابقة', 'اختر الباقة المناسبة لك من شباك الدفع أعلاه لإتمام أول اشتراك وإصدار فاتورتك الضريبية.')}
    </div>
  `;
};

let renderSeq = 0;
async function renderApp(keepScroll = false) {
  const route = location.hash.slice(2);
  const seq = ++renderSeq;
  const root = $('#app');

  if (!views[route]) {
    root.removeAttribute('aria-busy');
    root.innerHTML = renderLanding();
    enhanceA11y(root);
    if (!keepScroll) window.scrollTo(0, 0);
    return;
  }

  if (!me) {
    go('#/');
    showToast('سجّل الدخول للوصول إلى لوحة التحكم');
    actions.auth({ dataset: { m: 0 } });
    return;
  }

  let data = null;
  if (loaders[route]) {
    root.setAttribute('aria-busy', 'true');
    try { data = await loaders[route](); } catch (e) { data = { __error: e.message }; }
    if (seq !== renderSeq) return;
  }
  root.removeAttribute('aria-busy');
  root.innerHTML = renderShell(route, data);
  enhanceA11y(root);
  if (!keepScroll) window.scrollTo(0, 0);
}

const boot = async () => {
  if (getStoredToken()) await loadSession();
  // العودة من صفحة بوابة الدفع: /?pay_ref=...#/pay
  const payRef = new URLSearchParams(location.search).get('pay_ref');
  if (payRef) {
    history.replaceState(null, '', `${location.pathname}#/pay`);
    if (me) {
      showToast('جارٍ التحقق من حالة الدفع...', 4000);
      const r = await pollPaymentStatus(payRef, 10, 2500).catch(() => null);
      if (r && r.status === 'paid') { pgState.lastReceipt = r.payment; showToast(`🎉 تم تأكيد الدفع وتفعيل «${planInfo.name}»`, 5000); }
      else if (r) showToast('⚠️ لم تكتمل عملية الدفع. يمكنك المحاولة مجددًا.', 5000);
      else showToast('العملية قيد التأكيد — ستظهر حالتها في سجل المدفوعات.', 5000);
    }
  }
  await renderApp();
};

// 5.8 صفحة الإعدادات (#/set)
views.set = () => `
  <div class="grid-2">
    <div class="card">
      <h3>بيانات المتجر والفوترة الضريبية</h3>
      <label for="set-name">اسم المتجر التجاري</label>
      <input id="set-name" maxlength="60" value="${esc(state.storeName)}">

      <label for="set-email">البريد الإلكتروني الرسمي</label>
      <input id="set-email" type="email" dir="ltr" value="${esc(state.storeEmail)}" ${me.isDemo ? 'disabled title="غير متاح في الحساب التجريبي"' : ''}>

      <label for="set-phone">رقم الموبايل (واتساب) — يُستخدم لتسجيل الدخول</label>
      <input id="set-phone" dir="ltr" inputmode="tel" value="${esc(state.storePhone)}" ${me.isDemo ? 'disabled title="غير متاح في الحساب التجريبي"' : ''}>

      <div class="grid-equal" style="gap:12px">
        <div>
          <label for="set-tax">رقم التسجيل الضريبي</label>
          <input id="set-tax" dir="ltr" maxlength="20" value="${esc(state.taxId)}">
        </div>
        <div>
          <label for="set-ipa">عنوان InstaPay لاستلام التحصيلات</label>
          <input id="set-ipa" dir="ltr" maxlength="60" value="${esc(state.instaPayHandle)}">
        </div>
      </div>

      <button class="btn" data-a="save-settings">💾 حفظ إعدادات المتجر</button>
    </div>

    <div class="card">
      <h3>تفضيلات التنبيهات الذكية</h3>
      ${[
        ['s', 'تنبيه فوري عند انخفاض مخزون أي منتج لأقل من ٥ قطع'],
        ['o', 'إشعار عند وصول طلب جديد من أمازون أو نون أو جوميا'],
        ['f', 'تنبيه في حال تعذر مزامنة الأسعار أو المخزون'],
        ['w', 'إرسال ملخص المبيعات اليومي على واتساب']
      ].map((n) => `
        <div class="row" style="padding:10px 0;border-bottom:1px solid var(--bd)">
          <span class="sp">${n[1]}</span>
          <span class="switch ${state.notifications[n[0]] ? 'on' : ''}" data-a="toggle-notif" data-k="${n[0]}" aria-label="${n[1]}"></span>
        </div>
      `).join('')}

      <h3 style="margin-top:22px">المظهر والبيانات</h3>
      <p class="mu" style="font-size:13px;margin-bottom:12px">${me.isDemo
        ? 'هذا حساب تجريبي: بياناته مؤقتة وتُحذف تلقائيًا بعد ٢٤ ساعة.'
        : 'بياناتك محفوظة بأمان على حسابك، ويمكنك تصديرها في أي وقت.'}</p>
      <div class="row-wrap">
        <button class="btn btn-gh" data-a="theme">🌓 تبديل الوضع الليلي / النهاري</button>
        ${me.isDemo
          ? '<button class="btn btn-er" data-a="reset-demo">↺ إعادة ضبط البيانات التجريبية</button>'
          : `<button class="btn btn-gh" data-a="export-prod-csv">📥 المنتجات CSV</button>
             <button class="btn btn-gh" data-a="export-ord-csv">📥 الطلبات CSV</button>`}
        <button class="btn btn-gh" data-a="logout">تسجيل الخروج</button>
      </div>

      ${me.isDemo ? '' : `
        <h3 style="margin-top:22px">الأمان والحساب</h3>
        <div class="row-wrap">
          <button class="btn btn-gh" data-a="change-password">🔑 تغيير كلمة المرور</button>
          <button class="btn btn-er" data-a="delete-account">🗑 حذف الحساب نهائيًا</button>
        </div>`}
    </div>
  </div>
`;

/* ==========================================================================
   6. الغلاف العام للوحة التحكم وعملية الرندرة (App Shell & Router)
   ========================================================================== */
const renderShell = (viewKey, data) => {
  const currentNav = NAV_LINKS.find(n => n.id === viewKey) || NAV_LINKS[0];
  const mobileQuickLinks = [
    NAV_LINKS[0], // dash
    NAV_LINKS[1], // prod
    NAV_LINKS[2], // ord
    NAV_LINKS[4]  // pay
  ];
  return `
    <div class="shell">
      <div class="sidebar-backdrop ${state.dashMenuOpen ? 'open' : ''}" data-a="close-dash-menu"></div>
      <aside class="sidebar ${state.dashMenuOpen ? 'open' : ''}" aria-label="قائمة لوحة التحكم">
        <div class="row" style="padding:6px 12px 16px;justify-content:space-between">
          ${LOGO_HTML}
          <button class="close-btn mobile-menu-btn" data-a="close-dash-menu" aria-label="إغلاق القائمة">✕</button>
        </div>
        ${NAV_LINKS.map(item => {
          const count = item.badge ? item.badge() : '';
          return `
            <a href="#/${item.id}" class="nav-item ${item.id === viewKey ? 'on' : ''}">
              <span>${item.icon}</span>
              <span>${item.title}</span>
              ${count ? `<b class="nav-count">${ typeof count === 'number' ? fmtNum(count) : esc(count) }</b>` : ''}
            </a>
          `;
        }).join('')}
        <span class="sp"></span>
        <div class="card side-extra" style="padding:14px;background:var(--bg);margin-top:12px">
          <div class="row" style="margin-bottom:4px">
            <b style="font-size:13.5px">${esc(state.storeName)}</b>
          </div>
          <p class="mu" style="font-size:12px;margin-bottom:8px">${esc(planInfo.name)} · ${fmtNum(planInfo.used)} من ${planInfo.limit == null ? 'غير محدود' : fmtNum(planInfo.limit)} منتج</p>
          <div class="progress"><i style="width:${planInfo.limit ? Math.min(100, (planInfo.used / planInfo.limit) * 100) : 4}%;background:var(--ac)"></i></div>
          <button class="btn btn-gh btn-sm" style="width:100%;margin-top:10px" data-a="upgrade-plan">💳 شباك الدفع وترقية الباقة</button>
        </div>
      </aside>

      <main>
        ${me.isDemo ? demoBanner() : ''}
        <div class="topbar">
          <button class="mobile-menu-btn" data-a="toggle-dash-menu" aria-label="فتح قائمة الأقسام" title="جميع أقسام لوحة التحكم">☰</button>
          <div>
            <h2 style="margin:0;font-size:clamp(19px,2.4vw,24px)">${currentNav.icon} ${currentNav.title}</h2>
            <small class="mu">آخر مزامنة عبر OrderFlow مع أمازون ونون وجوميا: <b>${lastSyncLabel()}</b></small>
          </div>
          <span class="sp"></span>
          ${viewKey === 'dash' ? `
            <select data-i="dash-range" aria-label="الفترة الزمنية" style="width:auto;margin:0;padding:8px 14px">
              ${[[7, 'آخر ٧ أيام'], [30, 'آخر ٣٠ يومًا'], [90, 'آخر ٩٠ يومًا']].map(r => `<option value="${r[0]}" ${state.range === r[0] ? 'selected' : ''}>${r[1]}</option>`).join('')}
            </select>
          ` : ''}
          <button class="btn btn-gh" data-a="open-pay-window" data-p="pro">💳 شباك الدفع</button>
          <button class="btn btn-gh" data-a="sync-now">⟳ مزامنة الآن</button>
          <button class="btn btn-ac" data-a="add-prod">+ نشر منتج</button>
          <button class="btn btn-gh" data-a="theme" aria-label="تبديل المظهر">🌓</button>
        </div>
        ${data && data.__error ? errorState(data.__error) : views[viewKey](data)}
      </main>

      <nav class="mobile-dash-bar" aria-label="التنقل السريع للجوال">
        ${mobileQuickLinks.map(item => {
          const count = item.badge ? item.badge() : '';
          return `
            <a href="#/${item.id}" class="${item.id === viewKey ? 'on' : ''}">
              <span style="font-size:16px">${item.icon}</span>
              <span>${item.title.split(' ')[0]}</span>
              ${count ? `<b class="m-badge">${typeof count === 'number' ? fmtNum(count) : esc(count)}</b>` : ''}
            </a>
          `;
        }).join('')}
        <button type="button" class="${!mobileQuickLinks.some(x => x.id === viewKey) ? 'on' : ''}" data-a="toggle-dash-menu">
          <span style="font-size:16px">☰</span>
          <span>المزيد</span>
        </button>
      </nav>
    </div>
  `;
};

/* ==========================================================================
   7. النوافذ المنبثقة والأحداث التفاعلية (Modals & Action Handlers)
   ========================================================================== */
const actions = {};
const inputs = {};

const openDialog = (title, bodyHtml, wide = false) => {
  dlg.classList.toggle('dlg-wide', Boolean(wide));
  dlg.innerHTML = `
    <div class="dlg-head">
      <h3 style="margin:0">${title}</h3>
      <button class="close-btn" data-a="close-dlg" aria-label="إغلاق">✕</button>
    </div>
    <div id="dlg-body-slot">${bodyHtml}</div>
  `;
  if (!dlg.open) dlg.showModal();
  enhanceA11y(dlg);
  // النافذة العريضة (الدفع): لا نقفز لأول حقل كي لا تُحجب الرأس والملخص؛ نترك التركيز للنافذة نفسها
  const first = wide ? null : dlg.querySelector('input:not([type=checkbox]):not([disabled]), select, textarea');
  if (first) first.focus();
  else if (wide) { dlg.scrollTop = 0; const h = dlg.querySelector('.dlg-head h3'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }
};

let pendingConfirmFn = null;
const openConfirmDialog = (title, message, confirmText, isDanger, onConfirm) => {
  pendingConfirmFn = onConfirm;
  openDialog(title, `
    <p class="mu" style="font-size:14.5px;margin-bottom:18px;line-height:1.7">${esc(message)}</p>
    <div class="row-wrap" style="justify-content:flex-end">
      <button type="button" class="btn btn-gh" data-a="close-dlg">إلغاء</button>
      <button type="button" class="btn ${isDanger ? 'btn-er' : 'btn-ac'}" data-a="confirm-proceed">${esc(confirmText)}</button>
    </div>
  `);
};

actions['close-dlg'] = () => dlg.close();

actions['toggle-mobile-nav'] = () => {
  state.mobileNavOpen = !state.mobileNavOpen;
  const drawer = $('#mobile-nav-drawer');
  if (drawer) drawer.classList.toggle('open', state.mobileNavOpen);
};

actions['toggle-dash-menu'] = () => {
  state.dashMenuOpen = !state.dashMenuOpen;
  const sb = $('.sidebar');
  const bd = $('.sidebar-backdrop');
  if (sb) sb.classList.toggle('open', state.dashMenuOpen);
  if (bd) bd.classList.toggle('open', state.dashMenuOpen);
};

actions['close-dash-menu'] = () => {
  state.dashMenuOpen = false;
  const sb = $('.sidebar');
  const bd = $('.sidebar-backdrop');
  if (sb) sb.classList.remove('open');
  if (bd) bd.classList.remove('open');
};

actions.scroll = (el) => {
  state.mobileNavOpen = false;
  const drawer = $('#mobile-nav-drawer');
  if (drawer) drawer.classList.remove('open');
  const target = document.getElementById(el.dataset.t);
  if (target) target.scrollIntoView({ behavior: 'smooth' });
};

actions['hero-mkt'] = (el) => {
  state.heroMarket = el.dataset.v || 'all';
  const box = $('#hero-preview-box');
  if (box) {
    box.innerHTML = renderHeroPreviewCard();
    enhanceA11y(box);
  }
};

actions['hero-sim-order'] = () => {
  const ev = HERO_SAMPLE_EVENTS[heroEventIdx % HERO_SAMPLE_EVENTS.length];
  heroEventIdx++;
  const ch = heroLiveState[ev.m];
  ch.orders += 1;
  ch.revenue += ev.price;
  ch.profit += ev.net;
  ch.cod += ev.price;
  const otherMkts = ['a', 'n', 'j'].filter(k => k !== ev.m).map(k => MARKETPLACES[k].name).join(' و');
  heroLiveState.lastEvent = `طلب جديد (${ev.gov}) على ${MARKETPLACES[ev.m].name}: «${ev.item}» بـ ${fmtEGP(ev.price)} ← خُصم المخزون فورًا من ${otherMkts} (+${fmtEGP(ev.net)} ربح صافي)`;
  const box = $('#hero-preview-box');
  if (box) {
    box.innerHTML = renderHeroPreviewCard();
    enhanceA11y(box);
  }
  showToast(`⚡ تمت محاكاة طلب جديد على ${MARKETPLACES[ev.m].name} ومزامنة المخزون لحظيًا!`);
};

actions['pricing-toggle'] = (el) => {
  state.yearlyPricing = +el.dataset.v === 1;
  renderApp(true);
};

actions['mkt-filter'] = (el) => {
  state.marketFilter = el.dataset.v;
  saveAppState();
  renderApp(true);
};

actions['prod-flt'] = (el) => {
  state.prodStockFilter = el.dataset.v;
  renderApp(true);
};

const renderModalProfitPreview = () => {
  const price = num($('#pm-price')?.value || 0);
  const cost = num($('#pm-cost')?.value || 0);
  const box = $('#pm-profit-preview');
  if (!box) return;
  if (!price) {
    box.innerHTML = '<span class="mu">أدخل سعر البيع وتكلفة الشراء لمعاينة صافي الربح التقديري بعد عمولة المنصة وضريبة ١٤٪.</span>';
    return;
  }
  const avgFee = price * 0.11 * 1.14;
  const estNet = Math.round(price - cost - avgFee);
  const margin = Math.round((estNet / price) * 100);
  box.innerHTML = `
    <div class="row-wrap" style="justify-content:space-between;font-size:13px">
      <span>صافي الربح التقديري (بعد متوسط عمولة ١١٪ + ضريبة ١٤٪):</span>
      <b class="${estNet >= 0 ? 'ok-tx' : 'er-tx'}">${fmtEGP(estNet)} (${fmtNum(margin)}٪)</b>
    </div>
  `;
};
inputs['pm-calc'] = renderModalProfitPreview;

const openProductModal = (prod = null) => {
  const isEdit = !!prod;
  openDialog(
    isEdit ? '✎ تعديل بيانات المنتج' : '+ نشر منتج جديد على الأسواق',
    `
      <input type="hidden" id="pm-id" value="${isEdit ? prod.id : ''}">
      <label for="pm-name">اسم المنتج</label>
      <input id="pm-name" placeholder="مثال: سماعة بلوتوث لاسلكية" value="${isEdit ? esc(prod.name) : ''}">
      <div class="grid-equal" style="gap:10px">
        <div>
          <label for="pm-sku">كود المنتج (SKU)</label>
          <input id="pm-sku" dir="ltr" placeholder="SKU-105" value="${isEdit ? esc(prod.sku) : 'EG-' + (products.length + 101)}">
        </div>
        <div>
          <label for="pm-cat">الفئة</label>
          <input id="pm-cat" placeholder="إلكترونيات" value="${isEdit ? esc(prod.cat || 'إلكترونيات') : 'إلكترونيات'}">
        </div>
      </div>
      <div class="grid-equal" style="gap:10px">
        <div>
          <label for="pm-cost">تكلفة الشراء (ج.م)</label>
          <input id="pm-cost" type="number" inputmode="numeric" data-i="pm-calc" value="${isEdit ? prod.cost : ''}">
        </div>
        <div>
          <label for="pm-price">سعر البيع للعميل (ج.م)</label>
          <input id="pm-price" type="number" inputmode="numeric" data-i="pm-calc" value="${isEdit ? prod.price : ''}">
        </div>
      </div>
      <div id="pm-profit-preview" style="background:var(--bg);padding:10px 12px;border-radius:8px;margin-bottom:12px;font-size:12.5px"></div>
      <label for="pm-stock">الكمية المتاحة في المخزون</label>
      <input id="pm-stock" type="number" inputmode="numeric" value="${isEdit ? prod.stock : 20}">
      <label style="margin-bottom:8px">الأسواق المطلوب النشر عليها</label>
      <div class="row-wrap" style="margin-bottom:16px">
        ${['a', 'n', 'j'].map(k => `
          <label class="row" style="cursor:pointer;color:var(--tx);font-weight:600">
            <input type="checkbox" class="pm-mkt" value="${k}" style="width:auto;min-height:auto;margin:0" ${!isEdit || prod.markets.includes(k) ? 'checked' : ''}>
            ${renderMarketChip(k)} ${MARKETPLACES[k].name}
          </label>
        `).join('')}
      </div>
      <button class="btn" style="width:100%" data-a="save-prod">
        ${isEdit ? 'حفظ التعديلات ومزامنة الأسعار' : '🚀 نشر المنتج الآن'}
      </button>
      ${isEdit ? `<button class="btn btn-er" style="width:100%;margin-top:8px" data-a="delete-prod" data-id="${prod.id}">🗑 حذف المنتج</button>` : ''}
    `
  );
  renderModalProfitPreview();
};

actions['add-prod'] = () => openProductModal(null);
actions['edit-prod'] = (el) => {
  const p = products.find(x => x.id == el.dataset.id);
  if (p) openProductModal(p);
};

actions.theme = () => {
  const root = document.documentElement;
  const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('omni_theme', next); } catch (_) {}
};

const refreshPgCounterUI = () => {
  const modalSlot = $('#dlg-body-slot');
  if (dlg.open && modalSlot && dlg.classList.contains('dlg-wide')) {
    modalSlot.innerHTML = renderPaymentGatewayCounter(true);
    enhanceA11y(modalSlot);
  }
  const pageBox = $('#pay-page-counter-box');
  if (pageBox) {
    pageBox.innerHTML = renderPaymentGatewayCounter(false);
    enhanceA11y(pageBox);
  }
};

const openPaymentGatewayModal = async (planId = 'pro', cycle = null) => {
  await ensurePgGateway();
  if (planId && planId !== 'free') pgState.plan = planId;
  if (cycle) pgState.cycle = cycle;
  else if (location.hash === '' || location.hash === '#/') pgState.cycle = state.yearlyPricing ? 'yearly' : 'monthly';
  pgState.lastReceipt = null;
  state.mobileNavOpen = false;
  openDialog('💳 شباك الدفع الإلكتروني الآمن — OrderFlow Pay', renderPaymentGatewayCounter(true), true);
};

actions['open-pay-window'] = (el) => {
  openPaymentGatewayModal(el?.dataset?.p || 'pro', el?.dataset?.c || null);
};

actions['upgrade-plan'] = () => {
  go('#/pay');
};

/* ----- الإجراءات المتصلة بالخادم ----- */
const act = (name, fn) => {
  actions[name] = async (el, ev) => {
    const d = el && el.dataset;
    if (d && d.busy) return;
    if (d) d.busy = '1';
    try {
      await fn(el, ev);
    } catch (e) {
      showToast('⚠️ ' + (e.message || 'حدث خطأ غير متوقع'), 4200);
    } finally {
      if (d) delete d.busy;
    }
  };
};
const closeDlg = () => { if (dlg.open) dlg.close(); };

act('confirm-proceed', async () => {
  const fn = pendingConfirmFn;
  pendingConfirmFn = null;
  if (fn) await fn();
});

// نافذة تسجيل الدخول / إنشاء حساب
actions.auth = (el) => {
  state.authMode = +el.dataset.m;
  const up = state.authMode === 1;
  openDialog(up ? '🚀 إنشاء حساب تاجر مجاني على OrderFlow' : '👋 مرحبًا بعودتك إلى OrderFlow', `
    <form data-submit="auth-submit" novalidate>
      <p class="mu" style="margin-bottom:14px;font-size:13.5px">${up
        ? 'احصل على لوحة تحكم موحدة لأمازون ونون وجوميا بدون بطاقة ائتمان.'
        : 'سجّل الدخول لمتابعة إدارة مخزونك وطلباتك.'}</p>
      ${up ? `
        <label for="auth-store">اسم المتجر أو العلامة التجارية</label>
        <input id="auth-store" maxlength="60" autocomplete="organization" placeholder="مثال: متجر النور للإلكترونيات">` : ''}
      <label for="auth-id">${up ? 'رقم الموبايل (واتساب)' : 'رقم الموبايل أو البريد الإلكتروني'}</label>
      <input id="auth-id" dir="ltr" autocomplete="username" ${up ? 'inputmode="tel"' : ''} placeholder="${up ? '010xxxxxxxx' : '010xxxxxxxx أو sales@store.com'}">
      <label for="auth-pass">كلمة المرور</label>
      <input id="auth-pass" type="password" autocomplete="${up ? 'new-password' : 'current-password'}" placeholder="${up ? '٨ أحرف على الأقل' : '••••••••'}">
      <p id="auth-err" class="er-tx" role="alert" style="min-height:22px;margin:2px 0 8px;font-size:13px;font-weight:700"></p>
      <button class="btn" style="width:100%" type="submit">${up ? 'إنشاء الحساب والدخول للوحة التحكم' : 'تسجيل الدخول'}</button>
      <p class="mu ctr" style="margin-top:14px;font-size:13px">
        ${up ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
        <a class="pr-tx" style="font-weight:700;cursor:pointer" data-a="auth" data-m="${up ? 0 : 1}">${up ? 'سجّل الدخول' : 'أنشئ حسابًا مجانيًا'}</a>
      </p>
    </form>
    <hr style="border:0;border-top:1px solid var(--bd);margin:14px 0">
    <button class="btn btn-gh" style="width:100%" data-a="demo">أو جرّب لوحة تحكم تجريبية بدون تسجيل</button>
  `);
};

act('auth-submit', async () => {
  const up = state.authMode === 1;
  const err = $('#auth-err');
  err.textContent = '';
  const id = $('#auth-id').value.trim();
  const password = $('#auth-pass').value;
  try {
    if (up) await api('POST', '/api/auth/register', { store: $('#auth-store').value.trim(), phone: id, password });
    else await api('POST', '/api/auth/login', { id, password });
  } catch (e) {
    err.textContent = e.message;
    return;
  }
  closeDlg();
  await loadSession();
  go('#/dash');
  showToast(up ? 'مرحبًا بك في OrderFlow 🎉 ابدأ بإضافة أول منتج' : 'مرحبًا بعودتك 👋');
});

act('demo', async () => {
  try {
    const r = await api('POST', '/api/auth/demo');
    if (r && r.token) {
      try { localStorage.setItem('omni_token', r.token); } catch (_) {}
    }
    await loadSession();
    showToast('أنت الآن في حساب تجريبي ببيانات جاهزة 🧪', 3600);
    closeDlg();
    go('#/dash');
  } catch (err) {
    showToast('⚠️ ' + (err.message || 'تعذر فتح لوحة التحكم التجريبية'), 4500);
  }
});

act('logout', async () => {
  try { await api('POST', '/api/auth/logout'); } catch (_) {}
  clearSession();
  go('#/');
  showToast('تم تسجيل الخروج');
});

act('choose-plan', async (el) => {
  const pid = el.dataset.p || 'pro';
  if (pid === 'free') {
    if (!me) return actions.auth({ dataset: { m: 1 } });
    if (planInfo && planInfo.id === 'free') return;
    const r = await api('POST', '/api/billing/checkout', { plan: 'free', cycle: 'monthly' });
    planInfo = r.plan;
    showToast(`تم تفعيل ${r.plan.name} ✓`);
    renderApp(true);
    return;
  }
  openPaymentGatewayModal(pid, state.yearlyPricing ? 'yearly' : 'monthly');
});

/* ----- أحداث شباك الدفع الإلكتروني (OrderFlow Pay Gateway Actions) ----- */
actions['pg-select-plan'] = (el) => {
  pgState.plan = el.dataset.p || 'pro';
  refreshPgCounterUI();
};

actions['pg-select-cycle'] = (el) => {
  pgState.cycle = el.dataset.v === 'yearly' ? 'yearly' : 'monthly';
  refreshPgCounterUI();
};

actions['pg-select-method'] = (el) => {
  pgState.method = el.dataset.m || 'card';
  refreshPgCounterUI();
};

actions['pg-apply-coupon'] = () => {
  const code = String($('#pg-coupon-inp')?.value || pgState.couponInput || '').trim().toUpperCase();
  pgState.couponInput = code;
  if (!code) return showToast('⚠️ أدخل كود الخصم أولًا');
  if (!COUPONS_MAP[code]) return showToast('⚠️ كود الخصم غير صالح، جرّب WELCOME20 أو EGYPT10 أو OMNI50');
  pgState.appliedCoupon = code;
  showToast(`🎉 تم تطبيق الكوبون ${code}: ${COUPONS_MAP[code].desc}`);
  refreshPgCounterUI();
};

actions['pg-quick-coupon'] = (el) => {
  const code = el.dataset.c;
  if (!code || !COUPONS_MAP[code]) return;
  pgState.couponInput = code;
  pgState.appliedCoupon = code;
  showToast(`🎉 تم تفعيل الكوبون ${code}: ${COUPONS_MAP[code].desc}`);
  refreshPgCounterUI();
};

actions['pg-clear-coupon'] = () => {
  pgState.couponInput = '';
  pgState.appliedCoupon = '';
  refreshPgCounterUI();
};

actions['pg-fill-demo-card'] = () => {
  pgState.cardHolder = 'AHMED ELNOOR';
  pgState.cardNumber = '4242 4242 4242 4242';
  pgState.cardExpiry = '12/30';
  pgState.cardCvv = '123';
  showToast('💳 تم تعبئة بطاقة الاختبار');
  refreshPgCounterUI();
};

actions['pg-copy-ipa'] = async (el) => {
  const v = el.dataset.v || 'orderflow.pay@instapay';
  if (await copyText(v)) showToast(`📋 تم نسخ "${v}" إلى الحافظة ✓`);
};

actions['pg-send-otp'] = () => {
  const code = String(100000 + Math.floor(Math.random() * 899999));
  pgState.walletOtp = code;
  const inp = $('#pg-wallet-otp');
  if (inp) inp.value = code;
  showToast(`📲 وصل كود التأكيد التجريبي للمحفظة: ${code}`);
};

actions['pg-new-payment'] = () => {
  pgState.lastReceipt = null;
  refreshPgCounterUI();
};

actions['pg-go-dash'] = () => {
  closeDlg();
  go('#/pay');
};

inputs['pg-coupon-typing'] = (el) => {
  pgState.couponInput = el.value;
};

inputs['pg-field-sync'] = () => {
  if ($('#pg-ipa-addr')) pgState.instaPayAddress = $('#pg-ipa-addr').value;
  if ($('#pg-ipa-ref')) pgState.transferRef = $('#pg-ipa-ref').value;
  if ($('#pg-wallet-prov')) pgState.walletProvider = $('#pg-wallet-prov').value;
  if ($('#pg-wallet-phone')) pgState.walletPhone = $('#pg-wallet-phone').value;
  if ($('#pg-wallet-otp')) pgState.walletOtp = $('#pg-wallet-otp').value;
  if ($('#pg-fawry-phone')) pgState.fawryPhone = $('#pg-fawry-phone').value;
};

inputs['pg-card-input'] = (el) => {
  if (el.id === 'pg-card-num') {
    const digits = el.value.replace(/\D/g, '').slice(0, 16);
    el.value = (digits.match(/.{1,4}/g) || []).join(' ');
    pgState.cardNumber = el.value;
  } else if (el.id === 'pg-card-exp') {
    let d = el.value.replace(/\D/g, '').slice(0, 4);
    if (d.length >= 3) d = d.slice(0, 2) + '/' + d.slice(2);
    el.value = d;
    pgState.cardExpiry = el.value;
  } else if (el.id === 'pg-card-holder') {
    pgState.cardHolder = el.value;
  } else if (el.id === 'pg-card-cvv') {
    pgState.cardCvv = el.value.replace(/\D/g, '').slice(0, 4);
    el.value = pgState.cardCvv;
  }
  const numEl = $('#pg-card-preview-num');
  if (numEl) {
    const raw = String(pgState.cardNumber || '').replace(/\D/g, '');
    numEl.textContent = (raw.padEnd(16, '•').match(/.{1,4}/g) || []).join(' ');
  }
  const bEl = $('#pg-card-preview-brand');
  if (bEl) bEl.textContent = pgCardBrand(String(pgState.cardNumber || '').replace(/\D/g, ''));
  const hEl = $('#pg-card-preview-holder');
  if (hEl) hEl.textContent = pgState.cardHolder || 'MERCHANT NAME';
  const eEl = $('#pg-card-preview-exp');
  if (eEl) eEl.textContent = pgState.cardExpiry || 'MM/YY';
};

const newIdemKey = () => (globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `k${Date.now()}${Math.random().toString(36).slice(2, 10)}`);

/** يتابع عملية معلّقة حتى تتأكد من البوابة (الخطاف) أو تنتهي المهلة */
async function pollPaymentStatus(ref, tries = 20, gap = 3000) {
  for (let i = 0; i < tries; i++) {
    const r = await api('GET', `/api/billing/status/${encodeURIComponent(ref)}`);
    if (r.plan) planInfo = r.plan;
    if (r.me) me = r.me;
    if (r.payments) payments = r.payments;
    if (r.status !== 'pending') return r;
    await new Promise((resolve) => setTimeout(resolve, gap));
  }
  return null;
}

act('pg-submit-checkout', async () => {
  const errEl = $('#pg-err');
  if (errEl) errEl.textContent = '';
  const g = pgState.gateway;
  const fail = (msg) => { if (errEl) { errEl.textContent = msg; errEl.focus?.(); } else showToast('⚠️ ' + msg, 4200); };

  // قراءة أحدث القيم من الحقول الظاهرة
  inputs['pg-field-sync']();
  if ($('#pg-card-holder')) pgState.cardHolder = $('#pg-card-holder').value.trim();
  if ($('#pg-card-num')) pgState.cardNumber = $('#pg-card-num').value.trim();
  if ($('#pg-card-exp')) pgState.cardExpiry = $('#pg-card-exp').value.trim();
  if ($('#pg-card-cvv')) pgState.cardCvv = $('#pg-card-cvv').value.trim();

  // فحص أولي على المتصفح لتوفير رحلة للخادم (الخادم يعيد كل الفحوصات)
  if (g.collectsCardData && pgState.method === 'card') {
    const digits = pgState.cardNumber.replace(/\D/g, '');
    if (digits.length !== 16 || !luhnOk(digits)) return fail('رقم البطاقة غير صالح، تأكد من الأرقام.');
    const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(pgState.cardExpiry);
    if (!m) return fail('تاريخ الانتهاء غير صالح (MM/YY).');
    const now = new Date();
    if (+m[2] < now.getFullYear() % 100 || (+m[2] === now.getFullYear() % 100 && +m[1] < now.getMonth() + 1)) return fail('البطاقة منتهية الصلاحية.');
    if (!/^\d{3,4}$/.test(pgState.cardCvv)) return fail('رمز الأمان CVV غير صالح.');
  }

  const btn = $('#btn-pg-submit');
  const restoreBtn = () => { if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.label || 'إتمام الدفع'; } };
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> جارٍ معالجة العملية...'; }

  try {
    if (!me) {
      if (!g.sandbox) { // الدفع الحقيقي يتطلب حسابًا حقيقيًا
        closeDlg();
        showToast('سجّل الدخول أو أنشئ حسابًا أولًا لإتمام الاشتراك');
        actions.auth({ dataset: { m: 0 } });
        return;
      }
      const demoRes = await api('POST', '/api/auth/demo'); // البيئة التجريبية: جلسة فورية للتجربة
      if (demoRes && demoRes.token) { try { localStorage.setItem('omni_token', demoRes.token); } catch (_) {} }
      await loadSession();
    }

    if (!pgState.idemKey) pgState.idemKey = newIdemKey();
    const payload = { plan: pgState.plan, cycle: pgState.cycle, method: pgState.method, coupon: pgState.appliedCoupon, idempotencyKey: pgState.idemKey };
    if (g.collectsCardData) { // لا تُرسل أي بيانات حساسة إلى الخادم مع البوابات المستضافة
      Object.assign(payload, {
        cardHolder: pgState.cardHolder, cardNumber: pgState.cardNumber, cardExpiry: pgState.cardExpiry, cardCvv: pgState.cardCvv,
        instaPayAddress: pgState.instaPayAddress, transferRef: pgState.transferRef,
        walletProvider: pgState.walletProvider, walletPhone: pgState.walletPhone, walletOtp: pgState.walletOtp,
        fawryPhone: pgState.fawryPhone
      });
    }

    const r = await api('POST', '/api/billing/checkout', payload);
    if (r.plan) planInfo = r.plan;
    if (r.me) me = r.me;
    if (r.payments) payments = r.payments;

    // نمسح البيانات الحساسة من الذاكرة فور إرسالها
    pgState.cardNumber = ''; pgState.cardCvv = ''; pgState.cardExpiry = ''; pgState.walletOtp = '';

    if (r.status === 'pending' && r.redirectUrl) { // بوابة مستضافة: نحوّل العميل إلى صفحتها
      showToast('جارٍ تحويلك إلى صفحة الدفع الآمنة...', 4000);
      location.assign(r.redirectUrl);
      return;
    }
    if (r.status === 'pending') { // لا رابط: ننتظر تأكيد البوابة
      showToast('العملية قيد التأكيد من البوابة...', 4000);
      const done = await pollPaymentStatus(r.payment.txRef);
      if (!done || done.status !== 'paid') { renderApp(true); return fail('لم يصلنا تأكيد الدفع بعد. ستجد حالة العملية في سجل المدفوعات وسيُفعَّل اشتراكك تلقائيًا عند التأكيد.'); }
      r.payment = done.payment;
    }
    pgState.idemKey = '';
    pgState.lastReceipt = r.payment;
    showToast(`🎉 تم سداد ${fmtEGP(r.payment.amount)} وتفعيل «${planInfo.name}» بنجاح!`, 4200);
    if (location.hash === '#/pay') renderApp(true); else refreshPgCounterUI();
  } catch (e) {
    pgState.idemKey = ''; // بعد أي خطأ تبدأ المحاولة التالية بمفتاح جديد
    pgState.cardCvv = '';
    if (e.data && e.data.code === 'PAYMENT_UNAVAILABLE') { pgState.gateway = { ...pgState.gateway, enabled: false }; refreshPgCounterUI(); return; }
    fail(e.message);
    restoreBtn();
  }
});

act('open-receipt', async (el) => {
  const w = window.open('', '_blank');
  try {
    const r = await api('POST', `/api/billing/payments/${el.dataset.id}/receipt-link`);
    if (w) { w.opener = null; w.location.href = r.url; } else location.href = r.url;
  } catch (e) { if (w) w.close(); throw e; }
});

act('toggle-autorenew', async () => {
  const next = !(planInfo && planInfo.autoRenew);
  const r = await api('POST', '/api/billing/auto-renew', { autoRenew: next });
  planInfo = r.plan;
  showToast(next ? 'تم تفعيل التجديد التلقائي للاشتراك ✓' : 'تم إيقاف التجديد التلقائي للاشتراك');
  renderApp(true);
});

actions.retry = () => renderApp(true);

/* المنتجات والمخزون */
act('quick-restock', async (el) => {
  const r = await api('POST', `/api/products/${el.dataset.id}/restock`, { qty: 10 });
  upsertProducts([r.product]);
  applyMeta(r);
  showToast(`تم تزويد مخزون "${r.product.name}" بـ ١٠ قطع ومزامنة المنصات ✓`);
  renderApp(true);
});

act('toggle-prod-mkt', async (el) => {
  const p = products.find((x) => x.id === +el.dataset.id);
  const m = el.dataset.m;
  if (!p) return;
  let markets;
  if (p.markets.includes(m)) {
    if (p.markets.length === 1) return showToast('يجب أن يكون المنتج نشطًا على سوق واحد على الأقل');
    markets = p.markets.replace(m, '');
  } else {
    markets = ['a', 'n', 'j'].filter((k) => k === m || p.markets.includes(k)).join('');
  }
  const r = await api('PUT', `/api/products/${p.id}`, { markets });
  upsertProducts([r.product]);
  applyMeta(r);
  showToast(`تم تحديث عرض المنتج على ${MARKETPLACES[m].name} ✓`);
  renderApp(true);
});

act('save-prod', async () => {
  const id = $('#pm-id').value;
  const name = $('#pm-name').value.trim();
  const price = num($('#pm-price').value);
  if (!name || !price) return showToast('⚠️ يرجى إدخال اسم المنتج وسعر البيع');
  const cost = $('#pm-cost').value;
  const body = {
    name,
    sku: $('#pm-sku').value.trim() || 'SKU-' + Date.now().toString(36).toUpperCase(),
    cat: $('#pm-cat').value.trim() || 'عام',
    price,
    cost: cost === '' ? Math.round(price * 0.6) : num(cost),
    stock: num($('#pm-stock').value) || 0,
    markets: [...document.querySelectorAll('.pm-mkt:checked')].map((c) => c.value).join('') || 'a'
  };
  const r = id ? await api('PUT', `/api/products/${id}`, body) : await api('POST', '/api/products', body);
  upsertProducts([r.product]);
  applyMeta(r);
  closeDlg();
  showToast(id ? 'تم تحديث المنتج ومزامنته مع المنصات ✓' : 'تم نشر المنتج الجديد بنجاح ✓');
  renderApp(true);
});

actions['delete-prod'] = (el) => {
  const p = products.find((x) => x.id === +el.dataset.id);
  if (!p) return;
  openConfirmDialog(
    '🗑 تأكيد حذف المنتج',
    `هل أنت متأكد من حذف "${p.name}" نهائيًا من الكتالوج؟ لا يمكن التراجع عن هذا الإجراء.`,
    'نعم، احذف المنتج',
    true,
    async () => {
      const r = await api('DELETE', `/api/products/${p.id}`);
      products = products.filter((x) => x.id !== p.id);
      applyMeta(r);
      closeDlg();
      showToast('تم حذف المنتج');
      renderApp(true);
    }
  );
};

actions['export-prod-csv'] = () => downloadFile('/api/products/export.csv', 'orderflow-products.csv', 'كتالوج المنتجات CSV');
actions['export-ord-csv'] = () => downloadFile('/api/orders/export.csv', 'orderflow-orders.csv', 'سجل الطلبات CSV');

/* الطلبات والفواتير */
actions['ord-flt'] = (el) => {
  state.orderStatusFilter = +el.dataset.v;
  state.orderPage = 1;
  renderApp(true);
};
actions['ord-page'] = (el) => {
  state.orderPage = +el.dataset.v;
  renderApp(true);
};

act('set-status', async (el) => {
  const r = await api('POST', `/api/orders/${el.dataset.id}/status`, { status: +el.dataset.s });
  upsertProducts(r.products);
  applyMeta(r);
  showToast(`تم تحديث حالة الطلب #${arDigits(r.order.no)} إلى "${ORDER_STATUS[r.order.status].label}" ✓`);
  renderApp(true);
});

const orderLineHtml = (avail) => `
  <div class="row no-line" style="gap:8px;margin-bottom:8px">
    <select class="no-prod" data-i="order-total" aria-label="المنتج" style="margin:0">
      ${avail.map((p) => `<option value="${p.id}" data-price="${p.price}">${esc(p.name)} — ${fmtEGP(p.price)} (متاح ${fmtNum(p.stock)})</option>`).join('')}
    </select>
    <input class="no-qty" data-i="order-total" type="number" min="1" value="1" inputmode="numeric" aria-label="الكمية" style="width:84px;margin:0">
    <button type="button" class="btn btn-gh btn-sm" data-a="remove-order-line" aria-label="حذف المنتج">✕</button>
  </div>
`;

const updateOrderTotal = () => {
  let total = 0;
  document.querySelectorAll('#no-lines .no-line').forEach((l) => {
    const opt = l.querySelector('.no-prod').selectedOptions[0];
    total += (+(opt && opt.dataset.price) || 0) * (num(l.querySelector('.no-qty').value) || 0);
  });
  const box = $('#no-total');
  if (box) box.innerHTML = `<span class="sp mu">إجمالي الطلب</span><b style="font-size:18px">${fmtEGP(total)}</b>`;
};
inputs['order-total'] = updateOrderTotal;

const availFor = (m) => products.filter((p) => p.stock > 0 && p.markets.includes(m));
const fillOrderLines = (m) => {
  const avail = availFor(m);
  $('#no-lines').innerHTML = avail.length
    ? orderLineHtml(avail)
    : '<p class="mu" style="font-size:13px;margin-bottom:8px">لا توجد منتجات متاحة ومنشورة على هذا السوق.</p>';
  updateOrderTotal();
};
inputs['order-market'] = (el) => fillOrderLines(el.value);

actions['new-order'] = () => {
  const market = ['a', 'n', 'j'].find((k) => availFor(k).length);
  if (!market) return showToast('أضف منتجًا متاحًا في المخزون أولًا');
  openDialog('+ تسجيل طلب جديد', `
    <form data-submit="save-order" novalidate>
      <div class="grid-equal" style="gap:10px">
        <div><label for="no-market">السوق</label>
          <select id="no-market" data-i="order-market">${['a', 'n', 'j'].map((k) => `<option value="${k}" ${k === market ? 'selected' : ''}>${MARKETPLACES[k].name}</option>`).join('')}</select></div>
        <div><label for="no-courier">شركة الشحن</label>
          <select id="no-courier">${COURIER_NAMES.map((c) => `<option>${c}</option>`).join('')}</select></div>
      </div>
      <label for="no-customer">اسم العميل</label>
      <input id="no-customer" maxlength="60" autocomplete="off">
      <div class="grid-equal" style="gap:10px">
        <div><label for="no-phone">موبايل العميل (اختياري)</label>
          <input id="no-phone" dir="ltr" inputmode="tel" placeholder="010xxxxxxxx"></div>
        <div><label for="no-gov">المحافظة</label>
          <select id="no-gov">${GOVERNORATES.map((g) => `<option>${g}</option>`).join('')}</select></div>
      </div>
      <label for="no-address">العنوان (اختياري، يظهر في بوليصة الشحن)</label>
      <input id="no-address" maxlength="200" autocomplete="off">
      <label for="no-pay">طريقة الدفع</label>
      <select id="no-pay">${PAY_METHODS.map((m) => `<option>${m}</option>`).join('')}</select>
      <label>المنتجات</label>
      <div id="no-lines">${orderLineHtml(availFor(market))}</div>
      <button type="button" class="btn btn-gh btn-sm" data-a="add-order-line" style="margin:2px 0 12px">+ منتج آخر</button>
      <div id="no-total" class="row" style="padding:8px 0;border-top:1px dashed var(--bd)"></div>
      <p id="no-err" class="er-tx" role="alert" style="min-height:22px;font-size:13px;font-weight:700"></p>
      <button class="btn" style="width:100%" type="submit">تسجيل الطلب وخصم المخزون</button>
    </form>
  `);
  updateOrderTotal();
};

actions['add-order-line'] = () => {
  const avail = availFor($('#no-market').value);
  if (!avail.length) return;
  if (!document.querySelector('#no-lines .no-line')) $('#no-lines').innerHTML = '';
  $('#no-lines').insertAdjacentHTML('beforeend', orderLineHtml(avail));
  updateOrderTotal();
};

actions['remove-order-line'] = (el) => {
  if (document.querySelectorAll('#no-lines .no-line').length > 1) {
    el.closest('.no-line').remove();
    updateOrderTotal();
  }
};

act('save-order', async () => {
  const err = $('#no-err');
  err.textContent = '';
  const items = [...document.querySelectorAll('#no-lines .no-line')].map((l) => ({
    productId: +l.querySelector('.no-prod').value,
    qty: num(l.querySelector('.no-qty').value)
  }));
  if (!items.length) { err.textContent = 'أضف منتجًا واحدًا على الأقل'; return; }
  let r;
  try {
    r = await api('POST', '/api/orders', {
      market: $('#no-market').value, courier: $('#no-courier').value, customer: $('#no-customer').value.trim(),
      phone: $('#no-phone').value.trim(), gov: $('#no-gov').value, address: $('#no-address').value.trim(),
      pay: $('#no-pay').value, items
    });
  } catch (e) {
    err.textContent = e.message;
    return;
  }
  upsertProducts(r.products);
  applyMeta(r);
  closeDlg();
  showToast(`تم تسجيل الطلب #${arDigits(r.order.no)} وخصم المخزون ✓`);
  state.orderPage = 1;
  renderApp(true);
});

actions['view-invoice'] = (el) => {
  const o = ordersById.get(+el.dataset.id);
  if (!o) return;
  const preTax = Math.round(o.total / 1.14);
  const vat = o.total - preTax;
  const invUrl = authedUrl(`/api/orders/${o.id}/invoice`);
  openDialog(`🧾 فاتورة ضريبية مبسطة #${arDigits(o.no)}`, `
    <div class="card" style="background:var(--bg);box-shadow:none">
      <div class="row" style="margin-bottom:10px">
        <div class="sp"><b>${esc(state.storeName)}</b><br><small class="mu">الرقم الضريبي: <span dir="ltr">${esc(state.taxId) || '—'}</span></small></div>
        ${renderBadge('فاتورة ضريبية QR', 'pr')}
      </div>
      <div style="font-size:13px;margin-bottom:10px"><b>العميل:</b> ${esc(o.customer)} — ${esc(o.gov)}<br><b>التاريخ:</b> ${fmtDate(o.createdAt)} · <b>الدفع:</b> ${esc(o.pay)} · <b>الشحن:</b> ${esc(o.courier)}</div>
      <div class="row" style="padding:8px 0;border-top:1px dashed var(--bd)"><span class="sp">${esc(o.items)}</span></div>
      <div class="row" style="padding:4px 0"><span class="sp mu">القيمة قبل الضريبة</span><b>${fmtEGP(preTax)}</b></div>
      <div class="row" style="padding:4px 0"><span class="sp mu">ضريبة القيمة المضافة (١٤٪)</span><b>${fmtEGP(vat)}</b></div>
      <div class="row" style="padding:8px 0 0;border-top:1px solid var(--bd)"><b class="sp">الإجمالي شامل الضريبة</b><b class="pr-tx" style="font-size:20px">${fmtEGP(o.total)}</b></div>
    </div>
    <a class="btn" style="width:100%;margin-top:12px;text-align:center;display:flex;text-decoration:none" href="${esc(invUrl)}" target="_blank" rel="noopener noreferrer">🖨️ فتح وطباعة الفاتورة الضريبية الرسمية (QR) ↗</a>
  `);
};

actions['bulk-awb'] = () => {
  const a = document.createElement('a');
  a.href = authedUrl('/api/orders/awb');
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast(counts.pendingOrders ? `🚚 جاري تجهيز ${fmtNum(counts.pendingOrders)} بوليصة شحن للطباعة` : 'لا توجد طلبات قيد التجهيز حاليًا');
};

let ordSearchTimer;
let ordSearchSeq = 0;
inputs['ord-search'] = (el) => {
  state.orderQuery = el.value;
  state.orderPage = 1;
  clearTimeout(ordSearchTimer);
  ordSearchTimer = setTimeout(async () => {
    const seq = ++ordSearchSeq;
    try {
      const d = await loaders.ord();
      const box = $('#ord-table-box');
      if (box && seq === ordSearchSeq) { box.innerHTML = renderOrdersTable(d); enhanceA11y(box); }
    } catch (e) {
      showToast('⚠️ ' + e.message);
    }
  }, 280);
};

/* تحصيلات COD */
act('payout-cod', async (el) => {
  const r = await api('POST', `/api/cod/${el.dataset.k}/payout`);
  showToast(`💸 تم تسجيل طلب تحويل ${fmtEGP(r.net)} إلى ${r.handle} بنجاح`, 4000);
  renderApp(true);
});

/* الذكاء الاصطناعي */
act('ai-generate', async () => {
  const name = $('#ai-name') && $('#ai-name').value.trim();
  const out = $('#ai-output');
  if (!name) return showToast('⚠️ اكتب اسم المنتج أولًا');
  if (!out) return;
  const btn = $('#btn-ai-gen');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> جاري التوليد...';
  try {
    const r = await api('POST', '/api/ai/listing', { name, features: $('#ai-feats').value.trim(), tone: $('#ai-tone').value });
    aiListing = { ...r.data, source: r.source };
    out.innerHTML = renderAIListingCards(aiListing);
    showToast(r.source === 'gemini' ? '✨ تم توليد المحتوى بواسطة Gemini' : (r.notice || '📝 تم توليد المحتوى من قالب جاهز'));
  } finally {
    btn.disabled = false;
    btn.innerHTML = '✨ توليد المحتوى بذكاء Gemini';
  }
});

act('ai-market-search', async () => {
  const name = $('#ai-name') && $('#ai-name').value.trim();
  const box = $('#ai-market-box');
  if (!name) return showToast('⚠️ اكتب اسم المنتج أولًا');
  if (!box) return;
  const btn = $('#btn-ai-search');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> جاري البحث في السوق المصري...';
  box.innerHTML = `<div class="card"><div class="row"><span class="spinner" style="border-top-color:var(--pr)"></span><b>يقوم Gemini الآن بالبحث المباشر في الويب عن أسعار "${esc(name)}" في مصر...</b></div></div>`;
  try {
    const r = await api('POST', '/api/ai/market', { name });
    aiCache.market = r.market;
    box.innerHTML = renderMarketResearch(r.market);
    showToast('🌐 تم جلب تحليل أسعار السوق المصري بنجاح ✓');
  } catch (e) {
    box.innerHTML = `<div class="card" style="border-style:dashed"><p class="mu">${esc(e.message)}</p></div>`;
    throw e;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '🌐 فحص أسعار السوق بمصر';
  }
});

actions['toggle-thinking'] = (el) => {
  state.highThinking = el.checked;
  const btn = $('#btn-ai-advisor');
  if (btn) btn.innerHTML = state.highThinking ? '🧠 تحليل استراتيجي فائق (High Thinking)' : '✨ تحليل المتجر بالذكاء الاصطناعي';
};

act('ai-store-advisor', async () => {
  const panel = $('#ai-advisor-panel');
  if (!panel) return;
  const btn = $('#btn-ai-advisor');
  const thinking = Boolean(state.highThinking || $('#chk-high-thinking')?.checked);
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> ${thinking ? 'جاري التفكير العميق (Gemini 4 Argon)...' : 'جاري تحليل بيانات متجرك...'}`;
  panel.style.marginBottom = '18px';
  panel.innerHTML = `<div class="card ai-glow"><div class="row"><span class="spinner" style="border-top-color:var(--pr)"></span><b>${thinking ? 'يقوم المستشار الاستراتيجي بتشغيل وضع التفكير العميق (Gemini 4 Argon) لمقارنة عمولات الأسواق الثلاثة وتدفقات COD...' : 'يقوم المستشار الذكي بتحليل المخزون وهوامش الربح وتحصيلات الشحن...'}</b></div></div>`;
  try {
    const r = await api('POST', '/api/ai/advisor', { thinking });
    aiCache.advisor = r.advisor;
    panel.innerHTML = renderAdvisor(r.advisor);
    showToast(r.advisor.thinking ? '🧠 اكتمل تقرير التفكير العميق الاستراتيجي للمتجر ✓' : (r.advisor.source === 'gemini' ? '✨ اكتمل التحليل الذكي للمتجر بواسطة Gemini ✓' : '📊 اكتمل تحليل بيانات متجرك ✓'), 3500);
  } catch (e) {
    panel.innerHTML = '';
    panel.style.marginBottom = '0';
    throw e;
  } finally {
    btn.disabled = false;
    btn.innerHTML = state.highThinking ? '🧠 تحليل استراتيجي فائق (High Thinking)' : '✨ تحليل المتجر بالذكاء الاصطناعي';
  }
});

actions['close-advisor'] = () => {
  delete aiCache.advisor;
  const panel = $('#ai-advisor-panel');
  if (panel) { panel.innerHTML = ''; panel.style.marginBottom = '0'; }
};

act('ai-order-msg', async (el) => {
  const o = ordersById.get(+el.dataset.id);
  if (!o) return;
  openDialog(`💬 مساعد رسائل العملاء الذكي (الطلب #${arDigits(o.no)})`, `
    <div id="ai-msg-body" style="padding:16px 0;text-align:center">
      <span class="spinner" style="border-top-color:var(--pr);width:24px;height:24px"></span>
      <p class="mu" style="margin-top:8px">جاري صياغة رسالة واتساب مخصصة للعميل <b>${esc(o.customer)}</b> ...</p>
    </div>
  `);
  let r;
  try {
    r = await api('POST', '/api/ai/order-message', { orderId: o.id });
  } catch (e) {
    closeDlg();
    throw e;
  }
  const box = $('#ai-msg-body');
  if (!box) return;
  box.style.textAlign = 'start';
  const waHref = o.phone ? `https://wa.me/2${encodeURIComponent(o.phone)}?text=${encodeURIComponent(r.text)}` : '';
  box.innerHTML = `
    <div class="row-wrap" style="margin-bottom:8px">
      <span class="ai-badge">${r.source === 'gemini' ? '✨ جاهزة للإرسال عبر واتساب' : '📝 رسالة جاهزة (قالب)'}</span>
      <span class="sp"></span>
      <span class="mu" style="font-size:12px">العميل: ${esc(o.customer)} (${esc(o.gov)})</span>
    </div>
    <textarea id="ai-wa-text" rows="6" style="font-size:14px;line-height:1.7">${esc(r.text)}</textarea>
    <div class="row-wrap">
      <button class="btn sp" data-a="copy-wa-msg">📋 نسخ الرسالة</button>
      ${waHref ? `<a class="btn btn-ok" href="${esc(waHref)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none">💬 فتح واتساب ↗</a>` : ''}
    </div>
  `;
});

act('copy-wa-msg', async () => {
  const ta = $('#ai-wa-text');
  if (!ta) return;
  if (await copyText(ta.value)) { closeDlg(); showToast('📋 تم نسخ رسالة الواتساب إلى الحافظة ✓'); }
  else showToast('⚠️ تعذر النسخ تلقائيًا، حدّد النص وانسخه يدويًا');
});

act('copy-tx', async (el) => {
  const t = document.getElementById(el.dataset.target);
  if (!t) return;
  showToast((await copyText(t.innerText.trim())) ? '📋 تم نسخ النص إلى الحافظة' : '⚠️ تعذر النسخ');
});

/* التكاملات والإعدادات والحساب */
act('toggle-int', async (el) => {
  const on = !state.integrations[el.dataset.k];
  const r = await api('PUT', '/api/settings/integrations', { key: el.dataset.k, on });
  state.integrations = r.integrations;
  showToast(on ? 'تم تفعيل الربط والمزامنة ✓' : 'تم إيقاف الربط مؤقتًا');
  renderApp(true);
});

act('toggle-notif', async (el) => {
  const r = await api('PUT', '/api/settings/notifications', { key: el.dataset.k, on: !state.notifications[el.dataset.k] });
  state.notifications = r.notifications;
  showToast('تم حفظ تفضيل التنبيه ✓');
  renderApp(true);
});

act('sync-now', async () => {
  const r = await api('POST', '/api/sync');
  state.lastSyncAt = r.lastSyncAt;
  showToast(r.message || `⟳ تمت المزامنة: ${fmtNum(r.products)} منتج على ${fmtNum(r.markets.length)} أسواق مفعّلة ✓`, 3500);
  renderApp(true);
});

act('save-settings', async () => {
  const body = {
    storeName: $('#set-name').value.trim() || state.storeName,
    taxId: $('#set-tax').value.trim(),
    instaPayHandle: $('#set-ipa').value.trim()
  };
  if (!me.isDemo) {
    body.storePhone = $('#set-phone').value.trim() || state.storePhone;
    body.storeEmail = $('#set-email').value.trim();
  }
  const r = await api('PUT', '/api/settings', body);
  Object.assign(state, r.settings);
  me = r.me;
  showToast('تم حفظ بيانات المتجر والإعدادات الضريبية ✓');
  renderApp(true);
});

actions['reset-demo'] = () => {
  openConfirmDialog(
    '↺ إعادة ضبط البيانات التجريبية',
    'سيتم استرجاع المنتجات والطلبات التجريبية الأصلية وحذف أي تعديلات أجريتها في الجلسة الحالية. هل تود المتابعة؟',
    'نعم، أعد ضبط البيانات',
    true,
    async () => {
      await api('POST', '/api/demo/reset');
      await loadSession();
      closeDlg();
      showToast('↺ تمت استعادة البيانات التجريبية الأصلية');
      renderApp(true);
    }
  );
};

actions['change-password'] = () => openDialog('🔑 تغيير كلمة المرور', `
  <form data-submit="change-password-submit" novalidate>
    <label for="pw-cur">كلمة المرور الحالية</label>
    <input id="pw-cur" type="password" autocomplete="current-password">
    <label for="pw-new">كلمة المرور الجديدة</label>
    <input id="pw-new" type="password" autocomplete="new-password" placeholder="٨ أحرف على الأقل">
    <p id="pw-err" class="er-tx" role="alert" style="min-height:22px;font-size:13px;font-weight:700"></p>
    <button class="btn" style="width:100%" type="submit">حفظ كلمة المرور</button>
  </form>
`);
act('change-password-submit', async () => {
  try {
    await api('POST', '/api/account/password', { current: $('#pw-cur').value, next: $('#pw-new').value });
  } catch (e) {
    $('#pw-err').textContent = e.message;
    return;
  }
  closeDlg();
  showToast('تم تغيير كلمة المرور ✓ وتم تسجيل خروجك من الأجهزة الأخرى', 4000);
});

actions['delete-account'] = () => openDialog('🗑 حذف الحساب نهائيًا', `
  <form data-submit="delete-account-submit" novalidate>
    <p class="mu" style="margin-bottom:12px;font-size:13.5px">سيتم حذف حسابك وكل منتجاتك وطلباتك نهائيًا ولا يمكن التراجع. صدّر بياناتك أولًا إن احتجتها.</p>
    <label for="del-pass">أدخل كلمة المرور للتأكيد</label>
    <input id="del-pass" type="password" autocomplete="current-password">
    <p id="del-err" class="er-tx" role="alert" style="min-height:22px;font-size:13px;font-weight:700"></p>
    <button class="btn btn-er" style="width:100%" type="submit">حذف حسابي نهائيًا</button>
  </form>
`);
act('delete-account-submit', async () => {
  try {
    await api('DELETE', '/api/account', { password: $('#del-pass').value });
  } catch (e) {
    $('#del-err').textContent = e.message;
    return;
  }
  closeDlg();
  clearSession();
  go('#/');
  showToast('تم حذف حسابك وبياناتك نهائيًا');
});

// معالجات حقول الإدخال الفورية
inputs['prod-search'] = (el) => {
  state.prodQuery = el.value;
  $('#prod-table-box').innerHTML = renderProductsTable();
};

inputs['dash-range'] = (el) => {
  state.range = +el.value;
  saveAppState();
  renderApp(true);
};

inputs['ai-select-prod'] = (el) => {
  const p = products.find(x => x.id == el.value);
  if (p) {
    $('#ai-name').value = p.name;
    $('#ai-feats').value = `فئة ${p.cat || 'متميزة'}، خامات أصلية عالية الجودة، ضمان محلي وشحن سريع`;
    actions['ai-generate']();
  }
};

inputs['calc-run'] = () => {
  const vals = ['c-comm', 'c-price', 'c-cost', 'c-ship', 'c-rto'].map(id => +$('#' + id).value || 0);
  $('#calc-res-box').innerHTML = renderProfitCalcResult(vals);
};

inputs['calc-mkt'] = (el) => {
  $('#c-comm').value = el.value;
  inputs['calc-run']();
};

inputs['lp-calc-run'] = () => {
  const vals = ['lp-comm', 'lp-price', 'lp-cost', 'lp-ship', 'lp-rto'].map(id => +$('#' + id).value || 0);
  const box = $('#lp-calc-res-box');
  if (box) box.innerHTML = renderProfitCalcResult(vals);
};

inputs['lp-calc-mkt'] = (el) => {
  const comm = $('#lp-comm');
  if (comm) comm.value = el.value;
  inputs['lp-calc-run']();
};

/* ==========================================================================
   8. ربط المستمعين والتشغيل الأولي (Event Listeners & Bootstrap)
   ========================================================================== */
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-a]');
  if (btn && actions[btn.dataset.a]) {
    actions[btn.dataset.a](btn, ev);
  }
});

document.addEventListener('input', (ev) => {
  const inp = ev.target.closest('[data-i]');
  if (inp && inputs[inp.dataset.i]) {
    inputs[inp.dataset.i](inp);
  }
});

dlg.addEventListener('click', (ev) => {
  if (ev.target === dlg) dlg.close();
});

document.addEventListener('submit', (ev) => {
  const form = ev.target.closest('[data-submit]');
  if (!form) return;
  ev.preventDefault();
  const fn = actions[form.dataset.submit];
  if (fn) fn(form, ev);
});

document.addEventListener('keydown', (ev) => {
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('[role="button"][data-a], [role="switch"][data-a]')) {
    ev.preventDefault();
    ev.target.click();
  }
});

window.addEventListener('hashchange', () => renderApp());

try {
  const savedTheme = localStorage.getItem('omni_theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
} catch (_) {}

// تحديث هادئ لعداد المبيعات في الهيرو
setInterval(() => {
  const profitEl = $('#hero-profit');
  if (!profitEl) return;
  const keys = ['a', 'n', 'j'];
  const k = keys[Math.floor(Math.random() * keys.length)];
  heroLiveState[k].orders += 1;
  heroLiveState[k].profit += 65 + Math.floor(Math.random() * 110);
  heroLiveState[k].cod += 320 + Math.floor(Math.random() * 280);
  const st = getHeroStats();
  profitEl.textContent = '+' + fmtEGP(st.profit);
  const totEl = $('#hero-total-orders');
  if (totEl) totEl.textContent = fmtNum(st.orders) + ' طلب';
  const codEl = $('#hero-cod-ready');
  if (codEl) codEl.textContent = fmtEGP(st.cod);
  keys.forEach((mk) => {
    const el = $('#hero-ord-' + mk);
    if (el) el.textContent = fmtNum(heroLiveState[mk].orders) + ' طلب اليوم';
  });
}, 3500);

boot();
