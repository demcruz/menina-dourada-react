/**
 * Centralized product image resolution.
 * Supports new API variants (thumb, medium, full) with fallback to legacy (url, path).
 * All URLs are routed through getImageUrl() → CloudFront CDN.
 *
 * Usage:
 *   getThumbSrc(img)      → grid cards, cart items, thumbnails
 *   getMediumSrc(img)     → detail page main image, modal main image
 *   getFullSrc(img)       → zoom / lightbox
 *   getLegacySrc(img)     → SEO, schema, og:image (always canonical url)
 *   getProductImageSrc()  → resolves primary image for a product object
 */
import { getImageUrl } from './imageUrl';

/** Grid cards, cart sidebar, thumbnails — smallest available */
export const getThumbSrc = (img) =>
  getImageUrl(img?.thumb || img?.medium || img?.url || img?.path || '');

/** Detail page main image, modal main image */
export const getMediumSrc = (img) =>
  getImageUrl(img?.medium || img?.full || img?.url || img?.path || '');

/** Zoom / lightbox — largest available */
export const getFullSrc = (img) =>
  getImageUrl(img?.full || img?.medium || img?.url || img?.path || '');

/** SEO / schema — always the canonical url field */
export const getLegacySrc = (img) =>
  getImageUrl(img?.url || img?.path || img?.medium || img?.thumb || '');

/**
 * Resolve the primary image for a product (first variation, first image).
 * @param {object} product - product object with variacoes
 * @param {'thumb'|'medium'|'full'} variant - which size to prefer
 * @returns {string} CDN image URL or local fallback
 */
export const getProductImageSrc = (product, variant = 'thumb') => {
  const img = product?.variacoes?.[0]?.imagens?.[0];
  if (!img) return '/placeholder.jpg';
  switch (variant) {
    case 'medium': return getMediumSrc(img);
    case 'full':   return getFullSrc(img);
    default:       return getThumbSrc(img);
  }
};
