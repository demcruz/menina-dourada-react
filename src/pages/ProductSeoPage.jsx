import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllProductsCached } from "../api/axiosInstance";
import { findProductBySlug } from "../seo/findProductBySlug";
import { mapProductToSeo } from "../seo/mapProductToSeo";
import AdvancedSEO from "../seo/AdvancedSEO";
import Breadcrumbs from "../components/seo/Breadcrumbs";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductDetailSection from "../components/ProductDetailSection";

/* ── component ── */
const ProductSeoPage = ({ addToCart }) => {
  const { slug } = useParams();

  // Durante a hydration do react-snap, os produtos já estão em window.__PRELOADED_PRODUCTS__
  // injetados pelo postbuild. Isso garante que o HTML capturado tem conteúdo real.
  const preloaded = typeof window !== "undefined" && window.__PRELOADED_PRODUCTS__;
  const [products, setProducts] = useState(Array.isArray(preloaded) ? preloaded : []);
  const [loading, setLoading] = useState(!Array.isArray(preloaded) || preloaded.length === 0);

  useEffect(() => {
    // Se já temos dados pré-carregados (prerender ou cache), não busca de novo
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
          // Sinaliza ao react-snap que o conteúdo dinâmico está pronto para captura
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

  if (loading) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
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

  const seo = mapProductToSeo(product);

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
        jsonLd={seo.jsonLd}
      />

      <Breadcrumbs items={seo.breadcrumbItems} />

      <ProductDetailSection product={product} addToCart={addToCart} />

      <div style={{ textAlign: "center", margin: "2rem 0 1rem" }}>
        <Link to="/produtos" className="pdp-back-link">
          ← Voltar para a loja
        </Link>
      </div>
    </div>
  );
};

export default ProductSeoPage;
