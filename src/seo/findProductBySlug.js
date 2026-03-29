import { getProductSlug } from "./productUrl";

/**
 * Find a product whose generated slug matches the given route slug.
 * Returns the matched product or null.
 */
export function findProductBySlug(products, slug) {
  if (!Array.isArray(products) || !slug) return null;
  return products.find((p) => getProductSlug(p) === slug) || null;
}
