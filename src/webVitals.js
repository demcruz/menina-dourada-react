import { onCLS, onINP, onLCP } from 'web-vitals';

const ENDPOINT = 'https://api.meninadourada.shop/analytics';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
    url: window.location.href,
    userAgent: navigator.userAgent,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, body);
  } else {
    fetch(ENDPOINT, {
      method: 'POST',
      body,
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
  }
}

export function reportWebVitals() {
  // Não executar no SSR nem no react-snap (Puppeteer headless)
  if (typeof window === 'undefined') return;
  if (navigator.userAgent.includes('ReactSnap')) return;
  if (!Array.prototype.at) return; // browser muito antigo, skip silencioso

  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
}
