import { Helmet } from "react-helmet-async";
import {
  defaultTitle,
  defaultDescription,
  defaultImage,
  defaultUrl,
  defaultKeywords,
} from "./seoDefaults";

export default function AdvancedSEO({
  title,
  description,
  image,
  url,
  type = "website",
  canonical,
  keywords,
  noindex = false,
  jsonLd,
}) {
  const t = title || defaultTitle;
  const d = description || defaultDescription;
  const img = image || defaultImage;
  const u = url || defaultUrl;
  const kw = keywords || defaultKeywords;
  const can = canonical || u;
  const robots = noindex ? "noindex, nofollow" : "index, follow";

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta name="keywords" content={kw} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={can} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={u} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Menina Dourada" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
}
