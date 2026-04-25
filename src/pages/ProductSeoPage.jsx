import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { getAllProductsCached } from "../api/axiosInstance";
import { findProductBySlug } from "../seo/findProductBySlug";
import { mapProductToSeo } from "../seo/mapProductToSeo";
import { getProductPath, getProductSlug } from "../seo/productUrl";
import { getProductImageSrc } from "../utils/productImage";
import AdvancedSEO from "../seo/AdvancedSEO";
import Breadcrumbs from "../components/seo/Breadcrumbs";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductDetailSection from "../components/ProductDetailSection";

/* ── FAQ questions (static) ── */
const buildFaqSchema = (productName) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: `Qual o prazo de entrega de ${productName}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: "O prazo de entrega varia de 2 a 10 dias úteis após a confirmação do pagamento, dependendo da sua região e modalidade de envio escolhida.",
      },
    },
    {
      "@type": "Question",
      name: `Posso trocar ${productName} se não servir?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim! Você pode solicitar a troca em até 30 dias corridos após o recebimento. O produto deve estar sem uso e com etiqueta original.",
      },
    },
    {
      "@type": "Question",
      name: "Quais formas de pagamento são aceitas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aceitamos pagamento via PIX (aprovação imediata) e cartão de crédito. Todos os pagamentos são processados de forma segura.",
      },
    },
    {
      "@type": "Question",
      name: "O frete é grátis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, oferecemos frete grátis para compras acima de R$ 250,00. Para valores menores, o frete é calculado automaticamente no checkout.",
      },
    },
  ],
});

/* ── component ── */
const ProductSeoPage = ({ addToCart }) => {
  const { slug } = useParams();

  const preloaded = typeof window !== "undefined" && window.__PRELOADED_PRODUCTS__;
  const [products, setProducts] = useState(Array.isArray(preloaded) ? preloaded : []);
  const [loading, setLoading] = useState(!Array.isArray(preloaded) || preloaded.length === 0);

  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const all = await getAllProductsCached();
        if (!cancelled) setProducts(all);
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
          if (typeof window !== "undefined" && typeof window.snapSaveState === "function") {
            window.snapSaveState();
          }
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const product = useMemo(
    () => findProductBySlug(products, slug),
    [products, slug]
  );

  // ALL hooks must be above any conditional return
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const category = product?.categoria?.toLowerCase() || "";
    if (!category) {
      return products.filter((p) => p !== product).slice(0, 4);
    }
    const sameCat = products.filter(
      (p) => p !== product && (p?.categoria?.toLowerCase() || "") === category
    );
    if (sameCat.length >= 4) return sameCat.slice(0, 4);
    const others = products.filter((p) => p !== product && !sameCat.includes(p));
    return [...sameCat, ...others].slice(0, 4);
  }, [products, product]);

  const seo = useMemo(
    () => (product ? mapProductToSeo(product) : null),
    [product]
  );

  const productName = product?.nome || product?.name || "este produto";
  const faqSchema = useMemo(() => buildFaqSchema(productName), [productName]);
  const allJsonLd = useMemo(
    () => (seo ? [...(seo.jsonLd || []), faqSchema] : []),
    [seo, faqSchema]
  );

  // ── conditional returns (after all hooks) ──

  // Redirect legacy/partial slugs to canonical slug (client-side 301 equivalent)
  if (product && !loading) {
    const canonicalSlug = getProductSlug(product);
    if (slug !== canonicalSlug) {
      return <Navigate to={`/produto/${canonicalSlug}`} replace />;
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!product || !seo) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <AdvancedSEO
          title="Produto não encontrado | Menina Dourada"
          description="O produto que você procura não foi encontrado."
          noindex
        />
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Produto não encontrado
        </h1>
        <p style={{ marginBottom: "1.5rem", color: "#666" }}>
          O produto que você procura não está disponível no momento.
        </p>
        <Link
          to="/produtos"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            background: "#bfa14a",
            color: "#fff",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Ver todos os produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="pdp-container">
      <AdvancedSEO
        title={seo.title}
        description={seo.description}
        image={seo.image}
        url={seo.url}
        canonical={seo.canonical}
        keywords={seo.keywords}
        type="product"
        jsonLd={allJsonLd}
      />

      <Breadcrumbs items={seo.breadcrumbItems} />

      <ProductDetailSection product={product} addToCart={addToCart} />

      {/* FAQ Section */}
      <section style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#3d2b1f" }}>
          Perguntas Frequentes
        </h2>
        {faqSchema.mainEntity.map((faq, i) => (
          <details
            key={i}
            style={{
              marginBottom: "0.75rem",
              borderBottom: "1px solid #ede8e0",
              paddingBottom: "0.75rem",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "#3d2b1f",
                padding: "0.5rem 0",
              }}
            >
              {faq.name}
            </summary>
            <p style={{ margin: "0.5rem 0 0", color: "#666", fontSize: "0.9rem", lineHeight: 1.6 }}>
              {faq.acceptedAnswer.text}
            </p>
          </details>
        ))}
      </section>

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <section style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#3d2b1f", textAlign: "center" }}>
            Produtos Relacionados
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {relatedProducts.map((rp) => {
              const rpPath = getProductPath(rp);
              const rpImg = getProductImageSrc(rp, "thumb");
              const rpPrice = rp?.variacoes?.[0]?.precoVenda ?? rp?.variacoes?.[0]?.preco;
              return (
                <Link
                  key={rp?._id?.timestamp || rp?.id || rp?.nome}
                  to={rpPath}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    background: "#fff",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    transition: "transform 0.2s",
                  }}
                >
                  <div style={{ aspectRatio: "1/1", overflow: "hidden", background: "#f5f0ea" }}>
                    <img
                      src={rpImg}
                      alt={rp?.nome || "Produto relacionado"}
                      width="200"
                      height="200"
                      loading="lazy"
                      decoding="async"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <div style={{ padding: "0.75rem" }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, margin: "0 0 0.25rem", lineHeight: 1.3 }}>
                      {rp?.nome}
                    </p>
                    {rpPrice != null && (
                      <p style={{ fontSize: "0.9rem", color: "#bfa14a", fontWeight: 700, margin: 0 }}>
                        R$ {Number(rpPrice).toFixed(2).replace(".", ",")}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div style={{ textAlign: "center", margin: "2rem 0 1rem" }}>
        <Link to="/produtos" className="pdp-back-link">
          ← Voltar para a loja
        </Link>
      </div>
    </div>
  );
};

export default ProductSeoPage;
