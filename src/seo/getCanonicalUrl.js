import { defaultUrl } from "./seoDefaults";

/**
 * Build a canonical URL from the current window location.
 * Strips query params and hash. Returns defaultUrl when window is unavailable.
 */
export default function getCanonicalUrl(pathname) {
  try {
    const origin =
      typeof window !== "undefined" ? window.location.origin : defaultUrl;
    const path = pathname || (typeof window !== "undefined" ? window.location.pathname : "/");
    return `${origin}${path}`.split("?")[0].split("#")[0];
  } catch {
    return defaultUrl;
  }
}
