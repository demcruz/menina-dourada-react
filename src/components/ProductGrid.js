import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { getProducts as fetchProductsFromApi } from '../api/axiosInstance';
import { toNumber, formatBRL } from '../utils/price';

const PRODUCTS_PER_PAGE = 8;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

function cacheKey(page, size) {
  return `md:products:page=${page}:size=${size}`;
}

function normalizeResponse(raw) {
  // Pode vir direto como array/paginado ou como objeto proxy { statusCode, body: "..." }
  let payload = raw;

  // Se vier do Lambda como { body: string }, faz parse
  if (payload && payload.body) {
    try {
      payload = JSON.parse(payload.body);
    } catch {
      payload = [];
    }
  }

  // Se for paginação do back-end: { content: [...], totalPages: N }
  const items =
    Array.isArray(payload?.content) ? payload.content :
      Array.isArray(payload) ? payload :
        [];

  const totalPages = payload?.totalPages ?? 1;
  return { items, totalPages, raw: payload };
}

const ProductGrid = ({ addToCart, openProductModal }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Todos os produtos para filtro
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Estados dos filtros
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [colorFilter, setColorFilter] = useState('todas');
  const [sortOrder, setSortOrder] = useState('vendidos');

  // Refs para controle de scroll
  const didFetchRef = useRef(false);
  const productGridRef = useRef(null);
  const sectionRef = useRef(null);

  // Evita o duplo fetch do React.StrictMode em dev
  useEffect(() => {
    // Em produção não precisa, mas em dev evita duplo useEffect
    if (didFetchRef.current) return;
    didFetchRef.current = true;
  }, []);

  // Carrega todos os produtos para filtro
  const loadAllProducts = useCallback(async () => {
    try {
      const allItems = [];
      let page = 0;
      let hasMore = true;
      
      while (hasMore && page < 10) { // Limite de 10 páginas para segurança
        const resp = await fetchProductsFromApi(page, PRODUCTS_PER_PAGE);
        const norm = normalizeResponse(resp);
        allItems.push(...norm.items);
        
        if (page >= norm.totalPages - 1 || norm.items.length === 0) {
          hasMore = false;
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

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) Tenta cache
        const key = cacheKey(currentPage, PRODUCTS_PER_PAGE);
        const cached = localStorage.getItem(key);
        if (cached) {
          const { ts, data } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL_MS) {
            const norm = normalizeResponse(data);
            setProducts(norm.items);
            setTotalPages(norm.totalPages);
            setLoading(false);
            
            // Carrega todos em background para filtros
            if (allProducts.length === 0) {
              loadAllProducts();
            }
            return; // usa cache, não chama a API
          } else {
            localStorage.removeItem(key);
          }
        }

        // 2) Busca API
        const resp = await fetchProductsFromApi(currentPage, PRODUCTS_PER_PAGE, { signal });
        const norm = normalizeResponse(resp);

        setProducts(norm.items);
        setTotalPages(norm.totalPages);

        // 3) Salva no cache
        localStorage.setItem(
          key,
          JSON.stringify({ ts: Date.now(), data: norm.raw })
        );
        
        // Carrega todos em background para filtros
        if (allProducts.length === 0) {
          loadAllProducts();
        }
      } catch (err) {
        // ignora se foi cancelado pelo unmount/troca de página
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
        console.error('Erro ao buscar produtos:', err);
        setError(err?.message || 'Erro ao carregar produtos do servidor.');
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    loadProducts();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Função para scroll suave para o topo da grid de produtos
  const scrollToProductGrid = () => {
    if (productGridRef.current) {
      // Calcula offset para ficar um pouco acima da grid (para mostrar o título)
      const element = productGridRef.current;
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const offset = 100; // 100px acima da grid para mostrar o título
      
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    } else if (sectionRef.current) {
      // Fallback: scroll para a seção
      sectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      
      // Scroll suave para o topo da grid após mudança de página
      setTimeout(() => {
        scrollToProductGrid();
      }, 100); // Pequeno delay para garantir que o estado foi atualizado
    }
  };

  const getPrecoPrincipal = (produto) => {
    const preco = produto?.variacoes?.[0]?.preco;
    if (preco == null) return null;
    return typeof preco === 'string' ? parseFloat(preco) : preco;
  };

  const getImagemPrincipal = (produto) =>
    produto?.variacoes?.[0]?.imagens?.[0]?.url || '/placeholder.jpg';

  const getId = (p) => p?._id?.timestamp || p?.id || crypto.randomUUID();

  // Detecta categoria do produto pelo nome
  const getProductCategory = (product) => {
    const nome = product?.nome?.toLowerCase() || '';
    if (nome.includes('maiô') || nome.includes('maio')) return 'maios';
    if (nome.includes('saída') || nome.includes('saida')) return 'saidas';
    if (nome.includes('biquíni') || nome.includes('biquini')) return 'biquinis';
    return 'outros';
  };

  // Extrai todas as cores de um produto (de todas as variações)
  const getProductColors = (product) => {
    const colors = new Set();
    product?.variacoes?.forEach(v => {
      if (v?.cor) {
        colors.add(v.cor.toLowerCase().trim());
      }
    });
    return Array.from(colors);
  };

  // Lista de cores disponíveis (extraída de todos os produtos)
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

  // Verifica se filtro está ativo
  const isFilterActive = categoryFilter !== 'todos' || colorFilter !== 'todas';

  // Decide qual lista usar baseado no filtro
  const sourceProducts = isFilterActive ? allProducts : products;

  // Filtra e ordena produtos
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...sourceProducts];

    // Filtro por categoria
    if (categoryFilter !== 'todos') {
      result = result.filter(product => getProductCategory(product) === categoryFilter);
    }

    // Filtro por cor
    if (colorFilter !== 'todas') {
      result = result.filter(product => {
        const productColors = getProductColors(product);
        return productColors.some(c => c.includes(colorFilter.toLowerCase()));
      });
    }

    // Ordenação
    switch (sortOrder) {
      case 'menor':
        result.sort((a, b) => (getPrecoPrincipal(a) || 0) - (getPrecoPrincipal(b) || 0));
        break;
      case 'maior':
        result.sort((a, b) => (getPrecoPrincipal(b) || 0) - (getPrecoPrincipal(a) || 0));
        break;
      case 'novidades':
        // Mantém ordem original (assumindo que já vem ordenado por data)
        result.reverse();
        break;
      case 'vendidos':
      default:
        // Mantém ordem original da API
        break;
    }

    return result;
  }, [sourceProducts, categoryFilter, colorFilter, sortOrder]);

  // Mostra paginação apenas quando não há filtro ativo
  const showPagination = !isFilterActive && totalPages > 1;

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
              <option value="saidas">Saídas</option>
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
          <div className="products-grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" ref={productGridRef}>
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
                  </div>

                  <div className="product-info">
                    <div className="product-info-text">
                      <h3 className="product-name">{product?.nome}</h3>
                      <p className="product-category">
                        {product?.variacoes?.[0]?.cor || 'Cor unica'}
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
                          addToCart({
                            id: getId(product),
                            nome: product?.nome,
                            price: precoNumerico ?? 0,
                            image: getImagemPrincipal(product),
                            cor: product?.variacoes?.[0]?.cor,
                            tamanho: product?.variacoes?.[0]?.tamanho,
                            quantity: 1,
                          });
                        }}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showPagination && (
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
              aria-label="Página anterior"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <span className="pagination-info">
              Página <strong className="pagination-current">{currentPage + 1}</strong> de {totalPages}
            </span>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || loading}
              aria-label="Próxima página"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
