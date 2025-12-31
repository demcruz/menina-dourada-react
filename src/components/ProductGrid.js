import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { getProducts as fetchProductsFromApi } from '../api/axiosInstance';
import { toNumber, formatBRL } from '../utils/price';

const PRODUCTS_PER_PAGE = 9;
const LOAD_MORE_DELAY = 1500; // 1.5 segundos de loading

function normalizeResponse(raw) {
  let payload = raw;

  if (payload && payload.body) {
    try {
      payload = JSON.parse(payload.body);
    } catch {
      payload = [];
    }
  }

  const items =
    Array.isArray(payload?.content) ? payload.content :
      Array.isArray(payload) ? payload :
        [];

  const totalPages = payload?.totalPages ?? 1;
  return { items, totalPages, raw: payload };
}

const ProductGrid = ({ addToCart, openProductModal }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Estados dos filtros
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [colorFilter, setColorFilter] = useState('todas');
  const [sortOrder, setSortOrder] = useState('vendidos');

  const didFetchRef = useRef(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
  }, []);

  // Carrega todos os produtos para filtro
  const loadAllProducts = useCallback(async () => {
    try {
      const allItems = [];
      let page = 0;
      let hasMorePages = true;
      
      while (hasMorePages && page < 10) {
        const resp = await fetchProductsFromApi(page, PRODUCTS_PER_PAGE);
        const norm = normalizeResponse(resp);
        allItems.push(...norm.items);
        
        if (page >= norm.totalPages - 1 || norm.items.length === 0) {
          hasMorePages = false;
        }
        page++;
      }
      
      setAllProducts(allItems);
      return allItems;
    } catch (err) {
      console.error('Erro ao carregar todos os produtos:', err);
      return [];
    }
  }, []);

  // Carrega produtos iniciais
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
        setTotalPages(norm.totalPages);
        setCurrentPage(0);
        setHasMore(norm.totalPages > 1);
        
        // Carrega todos em background para filtros
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

  // Função para carregar mais produtos
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    // Delay para dar sensação de carregamento premium
    await new Promise(resolve => setTimeout(resolve, LOAD_MORE_DELAY));
    
    try {
      const nextPage = currentPage + 1;
      const resp = await fetchProductsFromApi(nextPage, PRODUCTS_PER_PAGE);
      const norm = normalizeResponse(resp);
      
      // Adiciona novos produtos à lista existente
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

  const getImagemPrincipal = (produto) =>
    produto?.variacoes?.[0]?.imagens?.[0]?.url || '/placeholder.jpg';

  const getId = (p) => p?._id?.timestamp || p?.id || crypto.randomUUID();

  const getProductCategory = (product) => {
    const nome = product?.nome?.toLowerCase() || '';
    const categoria = product?.categoria?.toLowerCase() || '';
    
    // Primeiro verifica pela categoria do produto (se existir)
    if (categoria) {
      if (categoria.includes('biquini') || categoria.includes('biquíni')) return 'biquinis';
      if (categoria.includes('maio') || categoria.includes('maiô')) return 'maios';
      if (categoria.includes('saida') || categoria.includes('saída')) return 'saidas';
      if (categoria.includes('canga')) return 'cangas';
      if (categoria.includes('acessorio') || categoria.includes('acessório')) return 'acessorios';
    }
    
    // Fallback: verifica pelo nome do produto
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
      if (v?.cor) {
        colors.add(v.cor.toLowerCase().trim());
      }
    });
    return Array.from(colors);
  };

  const availableColors = useMemo(() => {
    const colors = new Set();
    const sourceList = allProducts.length > 0 ? allProducts : products;
    
    sourceList.forEach(product => {
      product?.variacoes?.forEach(v => {
        if (v?.cor) {
          colors.add(v.cor.trim());
        }
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

  // Mostra "Carregar mais" apenas quando não há filtro ativo e há mais produtos
  const showLoadMore = !isFilterActive && hasMore && !loading;

  return (
    <section id="shop" className="product-grid-section" ref={sectionRef}>
      <div className="container px-4">
        <h2 className="section-title">Lançamentos</h2>

        <div className="product-filters-compact">
          <div className="filter-group-compact">
            <span className="filter-label-compact">Filtrar por:</span>
            <select 
              className="filter-select-compact"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="biquinis">Biquínis</option>
              <option value="maios">Maiôs</option>
              <option value="saidas">Saídas de Praia</option>
              <option value="cangas">Cangas</option>
              <option value="acessorios">Acessórios</option>
              <option value="outros">Outros</option>
            </select>

            <select 
              className="filter-select-compact"
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
            >
              <option value="todas">Cor</option>
              {availableColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div className="filter-group-compact">
            <span className="filter-label-compact">Ordenar por:</span>
            <select 
              className="filter-select-compact"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="vendidos">Mais vendidos</option>
              <option value="novidades">Novidades</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="error-message text-center">{error}</p>
        ) : filteredAndSortedProducts.length === 0 ? (
          <p className="text-center text-gray-500" style={{ padding: '2rem' }}>
            Nenhum produto encontrado para este filtro.
          </p>
        ) : (
          <div className="products-grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map((product) => {
              const preco = getPrecoPrincipal(product);
              return (
                <div
                  key={getId(product)}
                  className="product-card"
                  onClick={() => openProductModal(product)}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={getImagemPrincipal(product)}
                      alt={
                        product?.variacoes?.[0]?.imagens?.[0]?.altText || product?.nome
                      }
                      className="product-image"
                    />
                    <div className="product-overlay">
                      <button className="product-quick-view" aria-label="Ver detalhes">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="product-info">
                    <div className="product-info-text">
                      <h3 className="product-name">{product?.nome}</h3>
                      <p className="product-category">
                        {product?.variacoes?.[0]?.cor || 'Cor única'}
                      </p>
                    </div>

                    <div className="product-price-add">
                      <span className="product-price">
                        {formatBRL(preco, { withSymbol: true })}
                      </span>

                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const precoNumerico = toNumber(preco);
                          const variacaoTamanho = product?.variacoes?.[0]?.tamanho;
                          let tamanhoValue = Array.isArray(variacaoTamanho) 
                            ? variacaoTamanho[0] 
                            : (Array.isArray(product?.tamanho) ? product.tamanho[0] : variacaoTamanho);
                          if (tamanhoValue) tamanhoValue = tamanhoValue.toUpperCase();
                          addToCart({
                            id: getId(product),
                            nome: product?.nome,
                            price: precoNumerico ?? 0,
                            image: getImagemPrincipal(product),
                            cor: product?.variacoes?.[0]?.cor,
                            tamanho: tamanhoValue,
                            ufCadastro: product?.ufCadastro,
                            quantity: 1,
                          });
                        }}
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Botão Carregar Mais */}
        {showLoadMore && (
          <div className="load-more-container">
            <button
              className="load-more-btn"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
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

        {/* Mensagem quando não há mais produtos */}
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