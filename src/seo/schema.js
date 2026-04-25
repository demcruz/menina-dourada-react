import { getImageUrl } from "../utils/imageUrl";
import { BUSINESS } from "../config/business";

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Menina Dourada",
  url: "https://meninadourada.shop",
});

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Menina Dourada Swim",
  url: "https://meninadourada.shop",
  logo: "https://meninadourada.shop/android-chrome-512x512.png",
  image: "https://meninadourada.shop/android-chrome-512x512.png",
  sameAs: ["https://www.instagram.com/meninadouradaloja"],
});

export const clothingStoreSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": "https://meninadourada.shop/#store",
  name: "Menina Dourada Swim",
  url: "https://meninadourada.shop",
  logo: "https://meninadourada.shop/android-chrome-512x512.png",
  image: "https://meninadourada.shop/android-chrome-512x512.png",
  description: "Loja oficial da Menina Dourada Swim. Moda praia feminina: biquínis, maiôs, cangas e acessórios com entrega para todo o Brasil.",
  telephone: "+55 21 97313-7347",
  email: "comercialmeninadourada@gmail.com",
  priceRange: "R$",
  currenciesAccepted: "BRL",
  areaServed: "BR",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rio de Janeiro",
    addressRegion: "RJ",
    addressCountry: "BR",
  },
  brand: {
    "@type": "Brand",
    name: "Menina Dourada Swim",
  },
  sameAs: ["https://www.instagram.com/meninadouradaloja"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+55 21 97313-7347",
    email: "comercialmeninadourada@gmail.com",
    contactType: "customer service",
    availableLanguage: "Portuguese",
    areaServed: "BR",
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
  const image = getImageUrl(
    product?.image ||
    product?.variacoes?.[0]?.imagens?.[0]?.url ||
    "https://meninadourada.shop/android-chrome-512x512.png"
  );
  const price =
    product?.price ??
    product?.variacoes?.[0]?.precoVenda ??
    product?.variacoes?.[0]?.preco ??
    0;
  const url = product?.url || "";

  // Estoque real da primeira variação
  const estoque = product?.variacoes?.[0]?.estoque ?? 1;
  const availability =
    estoque > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

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
      availability,
      url: url || undefined,
      seller: {
        "@type": "Organization",
        name: "Menina Dourada",
      },
      // hasMerchantReturnPolicy — política de trocas e devoluções
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "BR",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: BUSINESS.returnDays || 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      // shippingDetails — frete para todo o Brasil
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "BRL",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "BR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 10,
            unitCode: "DAY",
          },
        },
      },
    },
    // aggregateRating só incluído se a API retornar dados reais
    ...(product?.ratingValue && product?.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(product.ratingValue),
            reviewCount: String(product.reviewCount),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };

  if (product?.sku) schema.sku = product.sku;
  else if (product?._id?.timestamp) schema.sku = `MD-${product._id.timestamp}`;
  else if (product?.id) schema.sku = `MD-${product.id}`;
  if (product?.gtin) schema.gtin = product.gtin;
  if (product?.categoria || product?.category) {
    schema.category = product.categoria || product.category;
  }
  return schema;
};
