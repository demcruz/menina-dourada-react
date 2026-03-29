import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProducts as fetchProductsFromApi, setCachedAllProducts } from '../api/axiosInstance';
import { toNumber, formatBRL } from '../utils/price';
import { getProductPath } from '../seo/productUrl';
import { getThumbSrc, getProductImageSrc } from '../utils/productImage';
import { trackEvent } from '../utils/analytics';

const PRODUCTS_PER_PAGE = 9;
const LOAD_MORE_DELAY = 1500;

const CATEGORY_CHIPS = [
  { value: 'todos',      emoji: '🔥', label: 'Todos' },
  { value: 'biquinis',   emoji: '👙', label: 'Biquínis' },
  { value: 'maios',      emoji: '🩱', label: 'Maiôs' },
  { value: 'saidas',     emoji: '🏖️', label: 'Saídas' },
  { value: 'cangas',     emoji: '🧣', label: 'Cangas' },
  { value: 'acessorios', emoji: '💎', label: 'Acessórios' },
];

const SORT_OPTIONS = [
  { value: 'vendidos',  label: '🔥 Mais vendidos' },
  { value: 'novidades', label: '✨ Novidades' },
  { value: 'menor',     label: '↓ Menor preço' },
  { value: 'maior',     label: '↑ Maior preço' },
];

// Mapa de nomes de cor para hex (fallback)
const COLOR_HEX_MAP = {
  preto: '#1a1a1a', preta: '#1a1a1a', black: '#1a1a1a',
  branco: '#fafafa', branca: '#fafafa', white: '#fafafa',
  vermelho: '#e74c3c', vermelha: '#e74c3c', red: '#e74c3c',
  azul: '#3498db', blue: '#3498db',
  verde: '#2ecc71', green: '#2ecc71',
  amarelo: '#f1c40f', amarela: '#f1c40f', yellow: '#f1c40f',
  rosa: '#ff69b4', pink: '#ff69b4',
  roxo: '#9b59b6', roxa: '#9b59b6', purple: '#9b59b6',
  laranja: '#f39c12', orange: '#f39c12',
  marrom: '#8B4513', brown: '#8B4513',
  bege: '#D4A574', nude: '#D4A574',
  dourado: '#DAA520', gold: '#DAA520', dourada: '#DAA520',
  cinza: '#999', gray: '#999', grey: '#999',
  coral: '#FF6F61',
  vinho: '#722F37',
  lilás: '#C8A2C8', lilas: '#C8A2C8',
  turquesa: '#40E0D0',
  mostarda: '#FFDB58',
  terracota: '#CC4E3C',
  off: '#FAF0E6',
  estampado: 'conic-gradient(#e74c3c,#f39c12,#2ecc71,#3498db,#9b59b6,#e74c3c)',
  estampada: 'conic-gradient(#e74c3c,#f39c12,#2ecc71,#3498db,#9b59b6,#e74c3c)',
  multicolor: 'conic-gradient(#e74c3c,#f39c12,#2ecc71,#3498db,#9b59b6,#e74c3c)',
};

// Skeleton de um card
const ProductCardSkeleton = () => (
  <div className="product-skeleton">
    <div className="skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton-line skeleton-line-name" />
      <div className="skeleton-line skeleton-line-name2" />
      <div className="skeleton-line skeleton-line-color" />
      <div className="skeleton-line skeleton-line-price" />
      <div className="skeleton-btn" />
    </div>
  </div>
);

// Badge de conversão por posição no grid
function getCardBadge(index) {
  if (index === 0) return { label: '🔥 Mais vendido', cls: 'badge-hot' };
  if (index === 1) return { label: '✨ Novo',         cls: 'badge-new' };
  if (index === 2) return { label: '💎 Premium',      cls: 'badge-premium' };
  return null;
}

// Prova social por posição
function getSocialProof(index) {
  if (index === 0) return '⭐ 4.9 · +230 vendidos';
  if (index === 1) return '⭐ 4.8 · +180 vendidos';
  if (index === 2) return '⭐ 4.8 · +150 vendidos';
  if (index < 6)   return '🔥 Alta procura';
  return null;
}

function getColorHex(colorName) {
  const lower = (colorName || '').toLowerCase().trim();
  // Exact match
  if (COLOR_HEX_MAP[lower]) return COLOR_HEX_MAP[lower];
  // Partial match
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return hex;
  }
  // Fallback: generate from string hash
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = lower.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 55%, 55%)`;
}

function normalizeResponse(raw) {
  let payload = raw;
  if (payload && payload.body) {
    try { payload = JSON.parse(payload.body); } catch { payload = []; }
  }
  const items =
    Array.isArray(payload?.content) ? payload.content :
    Array.isArray(payload) ? payload : [];
  const totalPages = payload?.totalPages ?? 1;
  return { items, totalPages, raw: payload };
}

const ProductGrid = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [colorFilter, setColorFilter] = useState('todas');
  const [sortOrder, setSortOrder] = useState('vendidos');
  const [sortOpen, setSortOpen] = useState(false);

  const didFetchRef = useRef(false);
  const sectionRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
  }, []);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loadAllProducts = useCallback(async () => {
    try {
      const allItems = [];
      let page = 0;
      let hasMorePages = true;
      while (hasMorePages && page < 10) {
        const resp = await fetchProductsFromApi(page, PRODUCTS_PER_PAGE);
        const norm = normalizeResponse(resp);
        allItems.push(...norm.items);
        if (page >= norm.totalPages - 1 || norm.items.length === 0) hasMorePages = false;
        page++;
      }
      setAllProducts(allItems);
      setCachedAllProducts(allItems);
      return allItems;
    } catch (err) {
      console.error('Erro ao carregar todos os produtos:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchProductsFromApi(0, PRODUCTS_PER_PAGE, { signal });
        const norm = normalizeResponse(resp);
        setProducts(norm.items);
        setCurrentPage(0);
        setHasMore(norm.totalPages > 1);
        loadAllProducts();
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
        console.error('Erro ao buscar produtos:', err);
        setError(err?.message || 'Erro ao carregar produtos do servidor.');
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };
    loadProducts();
    return () => controller.abort();
  }, [loadAllProducts]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, LOAD_MORE_DELAY));
    try {
      const nextPage = currentPage + 1;
      const resp = await fetchProductsFromApi(nextPage, PRODUCTS_PER_PAGE);
      const norm = normalizeResponse(resp);
      setProducts(prev => [...prev, ...norm.items]);
      setCurrentPage(nextPage);
      setHasMore(nextPage < norm.totalPages - 1);
    } catch (err) {
      console.error('Erro ao carregar mais produtos:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const getPrecoPrincipal = (produto) => {
    const variacao = produto?.variacoes?.[0];
    const preco = variacao?.precoVenda ?? variacao?.preco;
    if (preco == null) return null;
    return typeof preco === 'string' ? parseFloat(preco) : preco;
  };

  const getImagemPrincipal = (produto) => getProductImageSrc(produto, 'thumb');
  const getId = (p) => p?._id?.timestamp || p?.id || crypto.randomUUID();

  const getProductCategory = (product) => {
    const nome = product?.nome?.toLowerCase() || '';
    const categoria = product?.categoria?.toLowerCase() || '';
    if (categoria) {
      if (categoria.includes('biquini') || categoria.includes('biquíni')) return 'biquinis';
      if (categoria.includes('maio') || categoria.includes('maiô')) return 'maios';
      if (categoria.includes('saida') || categoria.includes('saída')) return 'saidas';
      if (categoria.includes('canga')) return 'cangas';
      if (categoria.includes('acessorio') || categoria.includes('acessório')) return 'acessorios';
    }
    if (nome.includes('maiô') || nome.includes('maio')) return 'maios';
    if (nome.includes('saída') || nome.includes('saida')) return 'saidas';
    if (nome.includes('canga')) return 'cangas';
    if (nome.includes('acessório') || nome.includes('acessorio')) return 'acessorios';
    if (nome.includes('biquíni') || nome.includes('biquini')) return 'biquinis';
    return 'outros';
  };

  const getProductColors = (product) => {
    const colors = new Set();
    product?.variacoes?.forEach(v => {
      if (v?.cor) colors.add(v.cor.toLowerCase().trim());
    });
    return Array.from(colors);
  };

  const availableColors = useMemo(() => {
    const colors = new Set();
    const sourceList = allProducts.length > 0 ? allProducts : products;
    sourceList.forEach(product => {
      product?.variacoes?.forEach(v => {
        if (v?.cor) colors.add(v.cor.trim());
      });
    });
    return Array.from(colors).sort();
  }, [allProducts, products]);

  const isFilterActive = categoryFilter !== 'todos' || colorFilter !== 'todas';
  const sourceProducts = isFilterActive ? allProducts : products;

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...sourceProducts];
    if (categoryFilter !== 'todos') {
      result = result.filter(product => getProductCategory(product) === categoryFilter);
    }
    if (colorFilter !== 'todas') {
      result = result.filter(product => {
        const productColors = getProductColors(product);
        return productColors.some(c => c.includes(colorFilter.toLowerCase()));
      });
    }
    switch (sortOrder) {
      case 'menor':
        result.sort((a, b) => (getPrecoPrincipal(a) || 0) - (getPrecoPrincipal(b) || 0));
        break;
      case 'maior':
        result.sort((a, b) => (getPrecoPrincipal(b) || 0) - (getPrecoPrincipal(a) || 0));
        break;
      case 'novidades':
        result.reverse();
        break;
      case 'vendidos':
      default:
        break;
    }
    return result;
  }, [sourceProducts, categoryFilter, colorFilter, sortOrder]);

  const showLoadMore = !isFilterActive && hasMore && !loading;
  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortOrder)?.label || 'Ordenar';

  return (
    <section id="shop" className="product-grid-section" ref={sectionRef}>
      <div className="container px-4">
        <h2 className="section-title">🔥 Mais desejados da semana</h2>

        <div className="product-filters-compact">

          {/* Seção 1: Categorias + botão ordenação no canto direito */}
          <div className="filter-section-categories">
            <div className="filter-chips-row" role="tablist" aria-label="Filtrar por categoria">
              {CATEGORY_CHIPS.map(chip => (
                <button
                  key={chip.value}
                  role="tab"
                  aria-selected={categoryFilter === chip.value}
                  className={`filter-chip${categoryFilter === chip.value ? ' active' : ''}`}
                  onClick={() => setCategoryFilter(chip.value)}
                >
                  <span className="filter-chip-emoji">{chip.emoji}</span>
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Ordenação — ícone discreto, canto direito */}
            <div className="sort-dropdown-wrap" ref={sortRef}>
              <button
                className={`sort-toggle-btn${sortOrder !== 'vendidos' ? ' sort-active' : ''}`}
                onClick={() => setSortOpen(prev => !prev)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                aria-label="Ordenar produtos"
                title="Ordenar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="15" y2="12" />
                  <line x1="4" y1="18" x2="10" y2="18" />
                </svg>
              </button>
              {sortOpen && (
                <div className="sort-dropdown" role="listbox">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      role="option"
                      aria-selected={sortOrder === opt.value}
                      className={`sort-dropdown-item${sortOrder === opt.value ? ' active' : ''}`}
                      onClick={() => { setSortOrder(opt.value); setSortOpen(false); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seção 2: Cores */}
          <div className="filter-section-colors">
            <span className="filter-colors-label">Cores</span>
            <div className="filter-colors-row" role="radiogroup" aria-label="Filtrar por cor">
              <button
                className={`filter-color-dot-all${colorFilter === 'todas' ? ' active' : ''}`}
                onClick={() => setColorFilter('todas')}
                aria-label="Todas as cores"
                title="Todas"
              />
              {availableColors.map(color => {
                const hex = getColorHex(color);
                const isGradient = hex.includes('gradient');
                return (
                  <button
                    key={color}
                    className={`filter-color-dot${colorFilter === color ? ' active' : ''}`}
                    style={isGradient ? { background: hex } : { backgroundColor: hex }}
                    onClick={() => setColorFilter(colorFilter === color ? 'todas' : color)}
                    aria-label={color}
                    title={color}
                  />
                );
              })}
            </div>
          </div>

        </div>

        {loading ? (
          <div className="products-grid">
            {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="error-message text-center">{error}</p>
        ) : filteredAndSortedProducts.length === 0 ? (
          <p className="text-center text-gray-500" style={{ padding: '2rem' }}>
            Nenhum produto encontrado para este filtro.
          </p>
        ) : (
          <div className="products-grid">
            {filteredAndSortedProducts.map((product, index) => {
              const preco = getPrecoPrincipal(product);
              const productPath = getProductPath(product);
              const badge = getCardBadge(index);
              const social = getSocialProof(index);
              return (
                <Link
                  key={getId(product)}
                  className="product-card"
                  to={productPath}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={getImagemPrincipal(product)}
                      alt={product?.variacoes?.[0]?.imagens?.[0]?.altText || product?.nome || 'Produto Menina Dourada'}
                      className="product-image"
                      loading={index < 4 ? 'eager' : 'lazy'}
                    />
                    {/* Badge de conversão */}
                    {badge && (
                      <span className={`product-badge ${badge.cls}`}>{badge.label}</span>
                    )}
                    {/* Overlay quick-view (desktop) */}
                    <div className="product-overlay">
                      <span className="product-quick-view" aria-label="Ver detalhes">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="product-info">
                    <div className="product-info-text">
                      <h3 className="product-name">{product?.nome}</h3>
                      <p className="product-category">{product?.variacoes?.[0]?.cor || 'Cor única'}</p>
                    </div>

                    {/* Prova social */}
                    {social && (
                      <p className="product-social-proof">{social}</p>
                    )}

                    <div className="product-price-add">
                      <div className="product-price-block">
                        <div className="product-price-row">
                          <span className="product-price-symbol">R$</span>
                          <span className="product-price-value">
                            {preco != null
                              ? Number(preco).toFixed(2).replace('.', ',')
                              : '—'}
                          </span>
                        </div>
                      </div>
                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Ver produto
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {showLoadMore && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? (
                <>
                  <span className="load-more-spinner"></span>
                  <span>Carregando...</span>
                </>
              ) : (
                <>
                  <span>Ver mais produtos</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {!isFilterActive && !hasMore && products.length > PRODUCTS_PER_PAGE && (
          <div className="no-more-products">
            <span>✨ Você viu todos os produtos ✨</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
