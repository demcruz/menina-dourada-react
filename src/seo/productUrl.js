import { slugifyProduct } from "./slugifyProduct";

export function getProductSlug(product) {
  if (!product) return "produto";
  if (product.slug) return product.slug;
  return slugifyProduct(product.nome || product.name) || "produto";
}

export function getProductPath(product) {
  return `/produto/${getProductSlug(product)}`;
}
