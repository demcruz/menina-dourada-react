// src/components/ProductGrid.js
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner'; // Caminho para o átomo LoadingSpinner
import { getProducts as fetchProductsFromApi } from '../api/axiosInstance'; // <--- IMPORTAÇÃO DO SEU ARQUIVO axiosInstance.js

const PRODUCTS_PER_PAGE = 6; // Mantém o tamanho da página para a requisição da API

const ProductGrid = ({ addToCart, openProductModal }) => {
    const [products, setProducts] = useState([]); // Agora 'products' virá da API
    const [loading, setLoading] = useState(true); // Começa como true para mostrar loading inicial
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Página atual (0-indexed para a API Java)
    const [totalPages, setTotalPages] = useState(0); // Total de páginas da API

    // --- Efeito para buscar produtos da API ---
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchProductsFromApi(currentPage, PRODUCTS_PER_PAGE);
                // Sua API Java retorna um objeto com 'content' (array de produtos) e 'totalPages'
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
    }, [currentPage]); // Dependência: recarrega produtos quando a página muda

    // --- Lógica de Paginação ---
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPrecoPrincipal = (produto) => {
        if (!produto.variacoes || produto.variacoes.length === 0) return null;
        return produto.variacoes[0].preco; // ou alguma lógica para pegar o principal
    };

    // Verifica se há mais produtos para carregar (baseado no totalPages da API)

    return (
        <section id="shop" className="product-grid-section">
            <div className="container px-4">
                <h2 className="section-title">Nossa Loja</h2>

                {/* Filters (mantidos como estão, a funcionalidade de filtro viria depois, interagindo com a API) */}
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

                {/* Exibição de Loading, Erro ou Produtos */}
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
                                key={product.id} // Use product.id vindo da API
                                className="product-card"
                                onClick={() => openProductModal(product)}
                            >
                                <div className="product-image-wrapper">
                                    {/* Use product.imageUrl ou product.image da API. Ajuste conforme o nome do campo da sua API */}
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

                {/* Controles de Paginação (substitui "Ver mais produtos") */}
                {totalPages > 1 && (
                    <div className="pagination-controls view-more-products-btn-container"> {/* Reutiliza classe de container */}
                        <button
                            className="view-more-products-btn" // Reutiliza estilo de botão
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0 || loading}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage + 1} de {totalPages}</span>
                        <button
                            className="view-more-products-btn" // Reutiliza estilo de botão
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