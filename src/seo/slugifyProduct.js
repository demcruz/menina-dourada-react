/**
 * Normalize a string into a URL-safe slug.
 * Strips accents, lowercases, replaces separators with hyphens,
 * removes unsafe chars, collapses repeated hyphens, trims edges.
 */
export function slugifyProduct(value) {
  if (!value || typeof value !== "string") return "";
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // remove unsafe chars
    .replace(/[\s_]+/g, "-")         // spaces/underscores → hyphen
    .replace(/-{2,}/g, "-")          // collapse repeated hyphens
    .replace(/^-+|-+$/g, "");        // trim leading/trailing hyphens
}
