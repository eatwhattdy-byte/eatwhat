const CF_API_KEY = '629af430d3c440b7958ccb294f81d361';
const CF_LATEST_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${CF_API_KEY}`;
const REFRESH_MS = 60 * 60 * 1000; // 60 minutes
const RATES_CACHE_KEY = 'exchangeDeskRatesCache_v4';
const FETCH_TIMEOUT_MS = 15000; // generous margin for slower mobile/cellular connections

const FIAT_CURRENCIES = {
  AED: 'UAE Dirham', AFN: 'Afghan Afghani', ALL: 'Albanian Lek', AMD: 'Armenian Dram',
  ANG: 'Netherlands Antillean Guilder', AOA: 'Angolan Kwanza', ARS: 'Argentine Peso',
  AUD: 'Australian Dollar', AWG: 'Aruban Florin', AZN: 'Azerbaijani Manat',
  BAM: 'Bosnia-Herzegovina Convertible Mark', BBD: 'Barbadian Dollar', BDT: 'Bangladeshi Taka',
  BGN: 'Bulgarian Lev', BHD: 'Bahraini Dinar', BIF: 'Burundian Franc', BMD: 'Bermudan Dollar',
  BND: 'Brunei Dollar', BOB: 'Bolivian Boliviano', BRL: 'Brazilian Real', BSD: 'Bahamian Dollar',
  BTN: 'Bhutanese Ngultrum', BWP: 'Botswanan Pula', BYN: 'Belarusian Ruble', BZD: 'Belize Dollar',
  CAD: 'Canadian Dollar', CDF: 'Congolese Franc', CHF: 'Swiss Franc', CLP: 'Chilean Peso',
  CNY: 'Chinese Yuan', COP: 'Colombian Peso', CRC: 'Costa Rican Colón', CUP: 'Cuban Peso',
  CVE: 'Cape Verdean Escudo', CZK: 'Czech Koruna', DJF: 'Djiboutian Franc', DKK: 'Danish Krone',
  DOP: 'Dominican Peso', DZD: 'Algerian Dinar', EGP: 'Egyptian Pound', ERN: 'Eritrean Nakfa',
  ETB: 'Ethiopian Birr', EUR: 'Euro', FJD: 'Fijian Dollar', FKP: 'Falkland Islands Pound',
  GBP: 'British Pound', GEL: 'Georgian Lari', GHS: 'Ghanaian Cedi', GIP: 'Gibraltar Pound',
  GMD: 'Gambian Dalasi', GNF: 'Guinean Franc', GTQ: 'Guatemalan Quetzal', GYD: 'Guyanaese Dollar',
  HKD: 'Hong Kong Dollar', HNL: 'Honduran Lempira', HRK: 'Croatian Kuna', HTG: 'Haitian Gourde',
  HUF: 'Hungarian Forint', IDR: 'Indonesian Rupiah', ILS: 'Israeli New Shekel', INR: 'Indian Rupee',
  IQD: 'Iraqi Dinar', IRR: 'Iranian Rial', ISK: 'Icelandic Króna', JMD: 'Jamaican Dollar',
  JOD: 'Jordanian Dinar', JPY: 'Japanese Yen', KES: 'Kenyan Shilling', KGS: 'Kyrgystani Som',
  KHR: 'Cambodian Riel', KMF: 'Comorian Franc', KPW: 'North Korean Won', KRW: 'South Korean Won',
  KWD: 'Kuwaiti Dinar', KYD: 'Cayman Islands Dollar', KZT: 'Kazakhstani Tenge', LAK: 'Laotian Kip',
  LBP: 'Lebanese Pound', LKR: 'Sri Lankan Rupee', LRD: 'Liberian Dollar', LSL: 'Lesotho Loti',
  LYD: 'Libyan Dinar', MAD: 'Moroccan Dirham', MDL: 'Moldovan Leu', MGA: 'Malagasy Ariary',
  MKD: 'Macedonian Denar', MMK: 'Myanmar Kyat', MNT: 'Mongolian Tugrik', MOP: 'Macanese Pataca',
  MRU: 'Mauritanian Ouguiya', MUR: 'Mauritian Rupee', MVR: 'Maldivian Rufiyaa', MWK: 'Malawian Kwacha',
  MXN: 'Mexican Peso', MYR: 'Malaysian Ringgit', MZN: 'Mozambican Metical', NAD: 'Namibian Dollar',
  NGN: 'Nigerian Naira', NIO: 'Nicaraguan Córdoba', NOK: 'Norwegian Krone', NPR: 'Nepalese Rupee',
  NZD: 'New Zealand Dollar', OMR: 'Omani Rial', PAB: 'Panamanian Balboa', PEN: 'Peruvian Sol',
  PGK: 'Papua New Guinean Kina', PHP: 'Philippine Peso', PKR: 'Pakistani Rupee', PLN: 'Polish Złoty',
  PYG: 'Paraguayan Guarani', QAR: 'Qatari Rial', RON: 'Romanian Leu', RSD: 'Serbian Dinar',
  RUB: 'Russian Ruble', RWF: 'Rwandan Franc', SAR: 'Saudi Riyal', SBD: 'Solomon Islands Dollar',
  SCR: 'Seychellois Rupee', SDG: 'Sudanese Pound', SEK: 'Swedish Krona', SGD: 'Singapore Dollar',
  SHP: 'Saint Helena Pound', SLE: 'Sierra Leonean Leone', SOS: 'Somali Shilling',
  SRD: 'Surinamese Dollar', SSP: 'South Sudanese Pound', STN: 'São Tomé and Príncipe Dobra',
  SYP: 'Syrian Pound', SZL: 'Swazi Lilangeni', THB: 'Thai Baht', TJS: 'Tajikistani Somoni',
  TMT: 'Turkmenistani Manat', TND: 'Tunisian Dinar', TOP: 'Tongan Paʻanga', TRY: 'Turkish Lira',
  TTD: 'Trinidad and Tobago Dollar', TWD: 'New Taiwan Dollar', TZS: 'Tanzanian Shilling',
  UAH: 'Ukrainian Hryvnia', UGX: 'Ugandan Shilling', USD: 'US Dollar', UYU: 'Uruguayan Peso',
  UZS: 'Uzbekistani Som', VES: 'Venezuelan Bolívar', VND: 'Vietnamese Dong', VUV: 'Vanuatu Vatu',
  WST: 'Samoan Tala', XAF: 'Central African CFA Franc', XCD: 'East Caribbean Dollar',
  XCG: 'Caribbean Guilder', XOF: 'West African CFA Franc', XPF: 'CFP Franc', YER: 'Yemeni Rial',
  ZAR: 'South African Rand', ZMW: 'Zambian Kwacha', ZWL: 'Zimbabwean Dollar'
};

let ratesCache = { base: null, date: null, rates: null, fetchedAt: null, stale: false };
let ratesFetchPromise = null;

/* ---------------- Fetch + cache helpers ---------------- */
function fetchWithTimeout(url, ms = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function writeCache(key, payload) {
  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    /* storage full or blocked — not fatal */
  }
}

async function fetchAllRatesFromAPI() {
  const res = await fetchWithTimeout(CF_LATEST_URL);
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) throw new Error('CurrencyFreaks API key was rejected.');
    if (res.status === 429) throw new Error('CurrencyFreaks monthly call limit reached.');
    throw new Error(`CurrencyFreaks request failed (${res.status})`);
  }
  const data = await res.json();
  if (!data.rates) throw new Error('Unexpected response shape from CurrencyFreaks');

  // Only keep rates for codes in our fixed country-currency list — this is what actually
  // guarantees crypto/stablecoins never reach the UI, regardless of what the API sends.
  const rates = { USD: 1 };
  Object.keys(data.rates).forEach(rawCode => {
    const code = rawCode.toUpperCase();
    if (!FIAT_CURRENCIES[code]) return;
    const val = parseFloat(data.rates[rawCode]);
    if (!Number.isNaN(val)) rates[code] = val;
  });

  return { base: 'USD', date: data.date, rates, fetchedAt: Date.now(), stale: false };
}

async function ensureRates() {
  if (ratesCache.rates) return ratesCache;
  if (ratesFetchPromise) return ratesFetchPromise;

  ratesFetchPromise = (async () => {
    const cached = readCache(RATES_CACHE_KEY);
    if (cached && cached.fetchedAt && (Date.now() - cached.fetchedAt) < REFRESH_MS) {
      ratesCache = cached;
      return ratesCache;
    }
    try {
      const fresh = await fetchAllRatesFromAPI();
      writeCache(RATES_CACHE_KEY, fresh);
      ratesCache = fresh;
      return ratesCache;
    } catch (err) {
      if (cached) {
        ratesCache = { ...cached, stale: true };
        return ratesCache;
      }
      throw err;
    }
  })();

  try {
    return await ratesFetchPromise;
  } finally {
    ratesFetchPromise = null;
  }
}

function getRate(from, to) {
  const rates = ratesCache.rates;
  if (!rates || rates[from] === undefined || rates[to] === undefined) return undefined;
  if (from === to) return 1;
  return rates[to] / rates[from];
}

// Every currency to show in pickers and the grid: codes in our fixed country-currency
// list that CurrencyFreaks actually returned a live rate for, sorted A→Z.
function fiatCodesSortedAZ() {
  const rateCodes = ratesCache.rates ? Object.keys(ratesCache.rates) : Object.keys(FIAT_CURRENCIES);
  return rateCodes.slice().sort((a, b) => a.localeCompare(b));
}

function currencyName(code) {
  return FIAT_CURRENCIES[code] || code;
}

function fmt(n) {
  if (n === undefined || n === null || Number.isNaN(n)) return '—';
  const abs = Math.abs(n);
  const digits = abs >= 100 ? 2 : abs >= 1 ? 4 : 6;
  return n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: 2 });
}

function setUpdatedStamp(el, date) {
  if (!el) return;
  const stamp = el.querySelector('.stamp-date');
  if (stamp) stamp.textContent = date;
}

/* ---------------- Searchable currency picker (no flags — code + name only) ---------------- */
function initCurrencyPicker(rootEl, initialCode, onChange) {
  const hiddenInput = rootEl.querySelector('input[type="hidden"]');
  const trigger = rootEl.querySelector('.ccy-trigger');
  const panel = rootEl.querySelector('.ccy-panel');
  const searchInput = rootEl.querySelector('.ccy-search');
  const listEl = rootEl.querySelector('.ccy-list');

  function renderList(filter) {
    const q = (filter || '').trim().toLowerCase();
    const codes = fiatCodesSortedAZ();
    const matches = codes.filter(code => {
      if (!q) return true;
      return code.toLowerCase().includes(q) || currencyName(code).toLowerCase().includes(q);
    });
    listEl.innerHTML = matches.slice(0, 400).map(code => `
      <li role="option" data-code="${code}" tabindex="-1">
        <span class="ccy-opt-code">${code}</span>
        <span class="ccy-opt-name">${currencyName(code)}</span>
      </li>`).join('') || `<li class="ccy-empty">No matches</li>`;
  }

  function setValue(code, { silent } = {}) {
    hiddenInput.value = code;
    trigger.innerHTML = `<span class="ccy-code">${code}</span><svg class="ccy-caret" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8l5 5 5-5"/></svg>`;
    if (!silent && typeof onChange === 'function') onChange(code);
  }

  function openPanel() {
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    renderList('');
    searchInput.value = '';
    panel.style.transform = ''; // reset before re-measuring against the current viewport
    requestAnimationFrame(() => clampPanelToViewport());
    setTimeout(() => searchInput.focus(), 0);
  }

  // The panel is centered under its trigger by default (see CSS), which works fine on
  // desktop but can push off-screen on mobile when the trigger sits near a screen edge —
  // nudge it back into view instead of letting it clip or force horizontal scroll.
  function clampPanelToViewport() {
    const rect = panel.getBoundingClientRect();
    const margin = 8;
    if (rect.left < margin) {
      panel.style.transform = `translateX(calc(-50% + ${margin - rect.left}px))`;
    } else if (rect.right > window.innerWidth - margin) {
      panel.style.transform = `translateX(calc(-50% - ${rect.right - (window.innerWidth - margin)}px))`;
    }
  }

  function closePanel() {
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', () => {
    if (panel.hidden) openPanel(); else closePanel();
  });

  searchInput.addEventListener('input', () => renderList(searchInput.value));

  listEl.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-code]');
    if (!li) return;
    setValue(li.dataset.code);
    closePanel();
  });

  document.addEventListener('click', (e) => {
    if (!rootEl.contains(e.target)) closePanel();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  setValue(initialCode, { silent: true });

  return { setValue, getValue: () => hiddenInput.value };
}

/* ---------------- Converter ---------------- */
async function initConverter() {
  const form = document.getElementById('converter-form');
  if (!form) return;

  const amountEl = document.getElementById('amount');
  const fromRoot = document.getElementById('from-currency-picker');
  const toRoot = document.getElementById('to-currency-picker');
  const swapBtn = document.getElementById('swap-btn');
  const figureEl = document.getElementById('result-figure');
  const subEl = document.getElementById('result-sub');
  const stampEl = document.getElementById('hero-updated');
  if (!fromRoot || !toRoot) return;

  function flashFigure() {
    figureEl.classList.remove('flip');
    void figureEl.offsetWidth;
    figureEl.classList.add('flip');
  }

  async function convert() {
    const amount = parseFloat(amountEl.value) || 0;
    const from = fromPicker.getValue();
    const to = toPicker.getValue();
    subEl.classList.remove('err');
    subEl.textContent = 'Fetching live rate…';
    try {
      await ensureRates();
      setUpdatedStamp(stampEl, ratesCache.date);
      const rate = getRate(from, to);
      if (rate === undefined) throw new Error('Rate unavailable for this pair');
      const converted = amount * rate;
      figureEl.textContent = `${fmt(converted)} ${to}`;
      subEl.textContent = ratesCache.stale
        ? `1 ${from} = ${fmt(rate)} ${to} · showing last known rates (as of ${ratesCache.date})`
        : `1 ${from} = ${fmt(rate)} ${to} · as of ${ratesCache.date}`;
      flashFigure();
    } catch (err) {
      figureEl.textContent = '—';
      subEl.innerHTML = `Could not reach the rate service. <button type="button" class="retry-link" id="retry-convert">Retry</button>`;
      subEl.classList.add('err');
      const retryBtn = document.getElementById('retry-convert');
      if (retryBtn) retryBtn.addEventListener('click', () => { ratesCache = { base: null, date: null, rates: null, fetchedAt: null, stale: false }; convert(); });
    }
  }

  const fromPicker = initCurrencyPicker(fromRoot, fromRoot.dataset.default || 'USD', convert);
  const toPicker = initCurrencyPicker(toRoot, toRoot.dataset.default || 'EUR', convert);

  swapBtn.addEventListener('click', () => {
    const a = fromPicker.getValue();
    const b = toPicker.getValue();
    fromPicker.setValue(b, { silent: true });
    toPicker.setValue(a, { silent: true });
    convert();
  });

  form.addEventListener('submit', (e) => { e.preventDefault(); convert(); });
  amountEl.addEventListener('input', debounce(convert, 350));

  convert();
}

/* ---------------- Rate grid — shows every fiat currency ---------------- */
async function initGrid() {
  const gridEl = document.getElementById('rate-grid');
  const baseRoot = document.getElementById('grid-base-picker');
  const filterInput = document.getElementById('grid-filter');
  if (!gridEl || !baseRoot) return;

  async function renderGrid() {
    const base = basePicker.getValue();
    const symbols = fiatCodesSortedAZ().filter(c => c !== base);

    gridEl.innerHTML = symbols.map(code => `
      <div class="rate-tile skeleton" data-code="${code}" data-name="${currencyName(code).toLowerCase()}">
        <div class="tile-top">
          <span class="pair">${base} → ${code}</span>
        </div>
        <div class="tile-mid">
          <span class="val">···</span>
        </div>
      </div>`).join('');

    try {
      await ensureRates();

      const tiles = symbols.map(code => {
        const rate = getRate(base, code);
        return `
          <div class="rate-tile" data-code="${code}" data-name="${currencyName(code).toLowerCase()}">
            <div class="tile-top">
              <span class="pair">${base} → ${code}</span>
            </div>
            <div class="tile-mid">
              <span class="val">${fmt(rate)}<small>per 1 ${base} · ${currencyName(code)}</small></span>
            </div>
          </div>`;
      }).join('');

      gridEl.innerHTML = tiles;
      applyGridFilter();
      const noteEl = document.getElementById('grid-note');
      if (noteEl) {
        noteEl.textContent = ratesCache.stale
          ? `Showing last known rates (as of ${ratesCache.date}) — live service was unreachable on the most recent check.`
          : `${symbols.length} currencies shown, as of ${ratesCache.date}, sourced from CurrencyFreaks.`;
      }
    } catch (err) {
      gridEl.innerHTML = `<p class="grid-note">Rate service unavailable right now. <button type="button" class="retry-link" id="retry-grid">Retry</button></p>`;
      const retryBtn = document.getElementById('retry-grid');
      if (retryBtn) retryBtn.addEventListener('click', renderGrid);
    }
  }

  function applyGridFilter() {
    if (!filterInput) return;
    const q = filterInput.value.trim().toLowerCase();
    gridEl.querySelectorAll('.rate-tile').forEach(tile => {
      const match = !q || tile.dataset.code.toLowerCase().includes(q) || tile.dataset.name.includes(q);
      tile.style.display = match ? '' : 'none';
    });
  }

  const basePicker = initCurrencyPicker(baseRoot, baseRoot.dataset.default || 'USD', renderGrid);
  if (filterInput) filterInput.addEventListener('input', applyGridFilter);
  renderGrid();
}

/* ---------------- Scroll reveal ---------------- */
// Used sparingly now — only for the decorative trust strip, never for primary functional
// content (a scroll-triggered animation should never be able to hide something the page
// actually needs to work). A hard fallback timer forces visibility regardless of whether
// IntersectionObserver ever fires, so nothing can get stuck invisible on any device.
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const reveal = (el) => el.classList.add('in');

  if (!('IntersectionObserver' in window)) {
    targets.forEach(reveal);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => io.observe(el));

  // Safety net: whatever the reason an element might not have revealed itself yet,
  // force it visible after 3s so it's never permanently stuck.
  setTimeout(() => targets.forEach(reveal), 3000);
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  initReveal();
  try {
    await ensureRates();
  } catch (e) {
    /* fall through — converter/grid show their own retry states */
  }
  // Each component is isolated: if one throws, it can't take the rest of the page down with it.
  try { initConverter(); } catch (e) { console.error('Converter failed to initialize:', e); }
  try { initGrid(); } catch (e) { console.error('Rate grid failed to initialize:', e); }
  setInterval(() => {
    ratesCache = { base: null, date: null, rates: null, fetchedAt: null, stale: false };
    ensureRates();
  }, REFRESH_MS);
});