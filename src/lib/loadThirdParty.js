/**
 * Carregamento inteligente de scripts de terceiros.
 *
 * - Analytics (GA): requestIdleCallback ou 3s timeout
 * - Chat/widget: primeira interação do usuário
 *
 * Uso: importar em src/index.js APÓS o render inicial.
 */

const GA_ID = 'G-KKHZWCHSSN';

/* ── helpers ── */
function injectScript(src, attrs = {}) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function scheduleIdle(fn, timeout = 4000) {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(fn, { timeout });
  } else {
    setTimeout(fn, 2000);
  }
}

function onFirstInteraction(fn) {
  let fired = false;
  const handler = () => {
    if (fired) return;
    fired = true;
    events.forEach(e => document.removeEventListener(e, handler));
    fn();
  };
  const events = ['click', 'scroll', 'keydown', 'touchstart', 'mousemove'];
  events.forEach(e => document.addEventListener(e, handler, { once: true, passive: true }));
  // Fallback: carrega após 8s mesmo sem interação
  setTimeout(handler, 8000);
}

/* ── Google Analytics ── */
let gaLoaded = false;
function loadGA() {
  if (gaLoaded) return;
  gaLoaded = true;

  injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`).then(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { send_page_view: true });
  }).catch(() => { /* GA bloqueado por adblocker — silencioso */ });
}

/* ── Google Merchant Widget (selo de avaliações) ── */
let merchantLoaded = false;
function loadMerchantWidget() {
  if (merchantLoaded) return;
  merchantLoaded = true;

  injectScript('https://www.gstatic.com/shopping/merchant/merchantwidget.js', { defer: '' })
    .then(() => {
      if (window.merchantwidget) {
        window.merchantwidget.start({
          merchant_id: 5746534315,
          position: 'BOTTOM_RIGHT',
          region: 'BR',
        });
      }
    })
    .catch(() => { /* bloqueado — silencioso */ });
}

/* ── Inicialização ── */
export function initThirdPartyScripts() {
  // Não executar no SSR / react-snap
  if (typeof window === 'undefined') return;
  if (navigator.userAgent.includes('ReactSnap')) return;

  // GA: carrega no idle ou após 4s
  scheduleIdle(loadGA, 4000);

  // Merchant Widget: carrega no idle (não depende de interação)
  scheduleIdle(loadMerchantWidget, 5000);

  // Também carrega GA na primeira interação (o que vier primeiro)
  onFirstInteraction(loadGA);
}
