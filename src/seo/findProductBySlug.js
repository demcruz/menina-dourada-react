import { getProductSlug } from "./productUrl";

/**
 * Find a product whose generated slug matches the given route slug.
 * First tries exact match, then falls back to partial/prefix match
 * to handle legacy short slugs (e.g. "biquini-red-shell" matching
 * "biquini-vermelho-red-shell-feminino-moda-praia-verao").
 */
export function findProductBySlug(products, slug) {
  if (!Array.isArray(products) || !slug) return null;

  // 1. Exact match (primary)
  const exact = products.find((p) => getProductSlug(p) === slug);
  if (exact) return exact;

  // 2. Partial match — slug is a prefix or substring of the product slug
  //    Handles legacy short slugs that may be bookmarked or indexed
  const partial = products.find((p) => {
    const productSlug = getProductSlug(p);
    return productSlug.startsWith(slug + "-") || productSlug.includes("-" + slug + "-");
  });
  return partial || null;
}
