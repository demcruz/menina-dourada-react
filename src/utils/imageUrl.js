/**
 * CDN URL helper — centraliza a troca de domínio S3 → CloudFront.
 *
 * Regras:
 *  - URL já no CDN  → retorna sem alteração
 *  - URL S3 (http)  → substitui origem pelo CDN, mantém pathname
 *  - Caminho relativo (/) → prefixa com CDN
 *  - Qualquer outro → retorna como está (sem crash)
 *  - Falsy          → retorna ""
 */

const CDN_BASE =
  (process.env.REACT_APP_CDN_URL || 'https://cdn.meninadourada.shop').replace(/\/$/, '');

export function getImageUrl(path) {
  if (!path || typeof path !== 'string') return '';

  // Já está no CDN — não reprocessar
  if (path.includes('cdn.meninadourada.shop')) return path;

  try {
    // URL absoluta (S3 ou qualquer outro host) → troca origem pelo CDN
    if (path.startsWith('http')) {
      const { pathname } = new URL(path);
      return `${CDN_BASE}${pathname}`;
    }

    // Caminho relativo com barra inicial
    if (path.startsWith('/')) {
      return `${CDN_BASE}${path}`;
    }
  } catch {
    // URL malformada — retorna original sem crash
  }

  return path;
}
