
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner'; 
import { getProducts as fetchProductsFromApi } from '../api/axiosInstance'; 

const PRODUCTS_PER_PAGE = 6; 

const ProductGrid = ({ addToCart, openProductModal }) => {
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); 
    const [totalPages, setTotalPages] = useState(0); 

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchProductsFromApi(currentPage, PRODUCTS_PER_PAGE);
                
                setProducts(response.content);
                setTotalPages(response.totalPages);
            } catch (err) {
                setError(err.message || 'Erro ao carregar produtos do servidor.');
                console.error('Erro ao buscar produtos:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [currentPage]); 

    
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPrecoPrincipal = (produto) => {
        if (!produto.variacoes || produto.variacoes.length === 0) return null;
        return produto.variacoes[0].preco; 
    };

    

    return (
        <section id="shop" className="product-grid-section">
            <div className="container px-4">
                <h2 className="section-title">Nossa Loja</h2>

                
                <div className="product-filters md:flex-row">
                    <div className="filter-group md:mb-0">
                        <span className="filter-label">Filtrar por:</span>
                        <div className="filter-select-wrapper">
                            <select className="filter-select">
                                <option>Todos</option>
                                <option>Biquínis</option>
                                <option>Maiôs</option>
                                <option>Acessórios</option>
                            </select>
                        </div>

                        <div className="filter-select-wrapper">
                            <select className="filter-select">
                                <option>Tamanho</option>
                                <option>PP</option>
                                <option>P</option>
                                <option>M</option>
                                <option>G</option>
                                <option>GG</option>
                            </select>
                        </div>

                        <div className="filter-select-wrapper">
                            <select className="filter-select">
                                <option>Cor</option>
                                <option>Preto</option>
                                <option>Branco</option>
                                <option>Vermelho</option>
                                <option>Azul</option>
                                <option>Estampado</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <span className="filter-label">Ordenar por:</span>
                        <div className="filter-select-wrapper">
                            <select className="filter-select">
                                <option>Mais vendidos</option>
                                <option>Novidades</option>
                                <option>Preço: menor para maior</option>
                                <option>Preço: maior para menor</option>
                            </select>
                        </div>
                    </div>
                </div>

               
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <p className="error-message text-center">{error}</p>
                ) : products.length === 0 ? (
                    <p className="text-center">Nenhum produto encontrado.</p>
                ) : (
                    <div className="products-grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map(product => (
                            <div
                                key={product.id} 
                                className="product-card"
                                onClick={() => openProductModal(product)}
                            >
                                <div className="product-image-wrapper">
                                    
                                    <img
                                        src={product.variacoes?.[0]?.imagens?.[0]?.url || '/placeholder.jpg'}
                                        alt={product.variacoes?.[0]?.imagens?.[0]?.altText || product.nome}
                                        className="product-image"
                                    />                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.nome || product.name}</h3>
                                    <p className="product-category">{product.categoria || product.category}</p>
                                    <div className="product-price-add">
                                        <span className="product-price">
                                            R$ {getPrecoPrincipal(product)?.toFixed(2).replace('.', ',') ?? '—'}
                                        </span>
                                        <button
                                            className="add-to-cart-btn"
                                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                
                {totalPages > 1 && (
                    <div className="pagination-controls view-more-products-btn-container"> 
                        <button
                            className="view-more-products-btn" 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0 || loading}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage + 1} de {totalPages}</span>
                        <button
                            className="view-more-products-btn" 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1 || loading}
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductGrid;