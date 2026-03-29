export const productSchema = (product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  image: product.image,
  description: product.description,
  brand: {
    "@type": "Brand",
    name: "Menina Dourada",
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "BRL",
    price: product.price,
    availability: "https://schema.org/InStock",
  },
});
