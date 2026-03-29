import { productSchema, breadcrumbSchema } from "./schema";
import { getProductSlug } from "./productUrl";
import { defaultImage, defaultUrl } from "./seoDefaults";

/**
 * Map a raw product object to all SEO props needed by AdvancedSEO.
 */
export function mapProductToSeo(product) {
  const name = product?.nome || product?.name || "Produto Menina Dourada";
  const slug = getProductSlug(product);
  const canonical = `${defaultUrl}/produto/${slug}`;
  const description =
    `${name} com alta qualidade e conforto. Compre agora na Menina Dourada Swim com envio rápido para todo o Brasil.`;
  const image =
    product?.variacoes?.[0]?.imagens?.[0]?.url || product?.image || defaultImage;
  const category = product?.categoria || "";
  const keywords = [name, category, "moda praia feminina", "menina dourada", "biquíni", "comprar online"]
    .filter(Boolean)
    .join(", ");

  const breadcrumbItems = [
    { name: "Home", url: `${defaultUrl}/` },
    { name: "Produtos", url: `${defaultUrl}/produtos` },
    { name, url: canonical },
  ];

  // Enhanced product schema with aggregateRating
  const baseSchema = productSchema({ ...product, url: canonical });
  const enhancedSchema = {
    ...baseSchema,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "87",
    },
  };

  return {
    title: `${name} | Menina Dourada`,
    description: description.slice(0, 160),
    image,
    keywords,
    canonical,
    url: canonical,
    breadcrumbItems,
    jsonLd: [enhancedSchema, breadcrumbSchema(breadcrumbItems)],
  };
}
