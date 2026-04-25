const GA_ID = 'G-KKHZWCHSSN';

/**
 * Extrai parâmetros UTM da URL atual.
 * Retorna objeto com os valores encontrados (omite os ausentes).
 */
function getUtmParams(search) {
  const params = new URLSearchParams(search || window.location.search);
  const utm = {};
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  keys.forEach((k) => {
    const v = params.get(k);
    if (v) utm[k] = v;
  });
  return utm;
}

/**
 * Envia page_view ao GA4 com path + UTM completos.
 * Chamado pelo PageTracker a cada mudança de rota.
 */
export const trackPageView = (path) => {
  if (!window.gtag) return;

  const utm = getUtmParams(window.location.search);

  window.gtag('config', GA_ID, {
    page_path: path,
    // Passa a URL completa para o GA4 processar UTM automaticamente
    page_location: window.location.href,
    // Repassa UTM explicitamente como campaign_* para garantir atribuição
    ...(utm.utm_source   && { campaign_source:  utm.utm_source }),
    ...(utm.utm_medium   && { campaign_medium:  utm.utm_medium }),
    ...(utm.utm_campaign && { campaign_name:    utm.utm_campaign }),
    ...(utm.utm_term     && { campaign_term:    utm.utm_term }),
    ...(utm.utm_content  && { campaign_content: utm.utm_content }),
  });
};

/**
 * Envia evento customizado ao GA4.
 * Inclui UTM automaticamente se presentes na URL.
 */
export const trackEvent = (eventName, params = {}) => {
  if (!window.gtag) return;

  const utm = getUtmParams(window.location.search);

  window.gtag('event', eventName, {
    ...params,
    // Anexa UTM ao evento para segmentação por campanha nos relatórios
    ...(utm.utm_source   && { campaign_source:  utm.utm_source }),
    ...(utm.utm_medium   && { campaign_medium:  utm.utm_medium }),
    ...(utm.utm_campaign && { campaign_name:    utm.utm_campaign }),
    ...(utm.utm_term     && { campaign_term:    utm.utm_term }),
    ...(utm.utm_content  && { campaign_content: utm.utm_content }),
  });
};
