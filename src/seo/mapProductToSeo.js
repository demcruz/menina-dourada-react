import { productSchema, breadcrumbSchema } from "./schema";
import { getProductSlug } from "./productUrl";
import { defaultImage, defaultUrl } from "./seoDefaults";
import { getImageUrl } from "../utils/imageUrl";

/**
 * Map a raw product object to all SEO props needed by AdvancedSEO.
 */
export function mapProductToSeo(product) {
  const name = product?.nome || product?.name || "Produto Menina Dourada";
  const slug = getProductSlug(product);
  const canonical = `${defaultUrl}/produto/${slug}`;
  const category = product?.categoria || "";

  // Preço formatado para a description
  const price = product?.variacoes?.[0]?.precoVenda ?? product?.variacoes?.[0]?.preco;
  const priceStr = price != null
    ? `R$ ${Number(price).toFixed(2).replace('.', ',')}`
    : '';

  // Description única por produto (150-160 chars) — inclui preço e categoria
  const descParts = [name];
  if (priceStr) descParts.push(`por ${priceStr}`);
  descParts.push('com envio rápido para todo o Brasil.');
  if (category) descParts.push(`${category} na Menina Dourada Swim.`);
  else descParts.push('Compre na Menina Dourada Swim.');
  const description = descParts.join(' ').slice(0, 160);

  // Title único (50-60 chars)
  const titleBase = `${name} | Menina Dourada`;
  const title = titleBase.length > 60 ? `${name.slice(0, 47)}... | Menina Dourada` : titleBase;

  const image = getImageUrl(
    product?.variacoes?.[0]?.imagens?.[0]?.url || product?.image || defaultImage
  );

  const keywords = [name, category, "moda praia feminina", "menina dourada", "biquíni", "comprar online"]
    .filter(Boolean)
    .join(", ");

  const breadcrumbItems = [
    { name: "Home", url: `${defaultUrl}/` },
    { name: "Produtos", url: `${defaultUrl}/produtos` },
  ];
  if (category) {
    breadcrumbItems.push({ name: category, url: `${defaultUrl}/produtos?categoria=${encodeURIComponent(category.toLowerCase())}` });
  }
  breadcrumbItems.push({ name, url: canonical });

  const enhancedSchema = productSchema({ ...product, url: canonical });

  return {
    title,
    description,
    image,
    keywords,
    canonical,
    url: canonical,
    breadcrumbItems,
    jsonLd: [enhancedSchema, breadcrumbSchema(breadcrumbItems)],
  };
}
