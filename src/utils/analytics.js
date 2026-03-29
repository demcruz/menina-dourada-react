const GA_ID = 'G-KKHZWCHSSN';

export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag('config', GA_ID, { page_path: path });
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
};
