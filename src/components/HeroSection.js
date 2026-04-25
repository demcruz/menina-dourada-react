import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts as fetchProductsFromApi } from '../api/axiosInstance';
import { formatBRL } from '../utils/price';
import { getProductPath } from '../seo/productUrl';
import { getProductImageSrc } from '../utils/productImage';

// Memoized para evitar re-render quando o pai re-renderiza
const HighlightCard = memo(({ product, price, id }) => (
  <Link
    key={id}
    to={getProductPath(product)}
    className="featured-highlight-card"
  >
    <div className="featured-highlight-img-wrap">
      <img
        src={getProductImageSrc(product, 'thumb')}
        alt={product?.nome || 'Produto'}
        width="400"
        height="400"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div className="featured-highlight-info">
      <p className="featured-highlight-name">{product?.nome}</p>
      {price != null && (
        <p className="featured-highlight-price">
          {formatBRL(price, { withSymbol: true })}
        </p>
      )}
    </div>
  </Link>
));

const HeroSection = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const resp = await fetchProductsFromApi(0, 3);
        let items = [];
        if (resp && resp.body) {
          try { items = JSON.parse(resp.body); } catch { items = []; }
        }
        const list = Array.isArray(items?.content)
          ? items.content
          : Array.isArray(items) ? items : [];
        if (!cancelled) setFeatured(list.slice(0, 3));
      } catch { /* silently fail */ }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const getPrice = (p) => {
    const v = p?.variacoes?.[0];
    const price = v?.precoVenda ?? v?.preco;
    if (price == null) return null;
    return typeof price === 'string' ? parseFloat(price) : price;
  };

  return (
    <>
      {/* Hero: usa <picture> com WebP responsivo para LCP otimizado */}
      <section id="home" className="hero-section hero-section--img">
        <picture>
          <source srcSet="/hero-bg-mobile.webp" type="image/webp" media="(max-width: 768px)" />
          <source srcSet="/hero-bg.webp" type="image/webp" />
          <img
            src="/hero-bg.jpg"
            alt=""
            aria-hidden="true"
            className="hero-bg-img"
            width="1200"
            height="600"
            fetchPriority="high"
            decoding="sync"
            loading="eager"
          />
        </picture>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Brilhe na Coleção 2026</h1>
          <p className="hero-subtitle">
            Biquínis exclusivos que realçam suas curvas e elevam sua confiança.
          </p>
          <div className="hero-cta-container">
            <Link to="/produtos" className="hero-button-primary">
              Ver Coleção 2026
            </Link>
            <p className="hero-trust-signal">
              🚚 Frete grátis acima de R$ 250 | 💎 Qualidade premium
            </p>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="featured-highlights">
          <div className="container">
            <h2 className="featured-highlights-title">✨ Destaques</h2>
            <div className="featured-highlights-grid">
              {featured.map((product) => {
                const price = getPrice(product);
                const id = product?._id?.timestamp || product?.id;
                return (
                  <HighlightCard key={id} product={product} price={price} id={id} />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HeroSection;
