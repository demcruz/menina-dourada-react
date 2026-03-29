export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Menina Dourada",
  url: "https://meninadourada.shop",
});

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Menina Dourada",
  url: "https://meninadourada.shop",
  logo: "https://meninadourada.shop/logo.png",
});

export const clothingStoreSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Menina Dourada",
  url: "https://meninadourada.shop",
  logo: "https://meninadourada.shop/logo.png",
  sameAs: ["https://www.instagram.com/meninadouradaloja"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contato@meninadourada.shop",
    contactType: "customer service",
  },
});

export const webPageSchema = (name, url) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name,
  url,
});

export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const productSchema = (product) => {
  const name = product?.name || product?.nome || "Produto Menina Dourada";
  const image =
    product?.image ||
    product?.variacoes?.[0]?.imagens?.[0]?.url ||
    "https://meninadourada.shop/og-image.jpg";
  const price =
    product?.price ??
    product?.variacoes?.[0]?.precoVenda ??
    product?.variacoes?.[0]?.preco ??
    0;
  const url = product?.url || "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description:
      product?.description ||
      product?.descricao ||
      `${name} com alta qualidade e conforto. Compre na Menina Dourada.`,
    image,
    brand: {
      "@type": "Brand",
      name: "Menina Dourada",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price,
      availability: "https://schema.org/InStock",
      url: url || undefined,
    },
  };
  if (product?.sku) schema.sku = product.sku;
  if (product?.categoria || product?.category) {
    schema.category = product.categoria || product.category;
  }
  return schema;
};
