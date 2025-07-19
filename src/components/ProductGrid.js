// src/components/ProductGrid.js
import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import biquiniLaranja from '../img/1swimswuit.png';
import biquinipreto from '../img/2.png';
import biquinivermelho from '../img/3.png';





// Essas constantes devem estar no topo do arquivo, fora de qualquer função ou componente.
const PRODUCTS_PER_LOAD = 6; // Quantos produtos carregar por vez

const ALL_PRODUCTS_DATA = [
     {
        id: '1',
        name: 'Biquíni Sol Dourado',
        price: 189.90,
        // AGORA COM VARIAÇÕES DE IMAGEM
        images: [ // Use um novo campo 'images' para as variações
            { src: biquinipreto, alt: 'Biquíni Laranja', colorName: 'Laranja' },
            { src: biquinivermelho, alt: 'Biquíni Roxo', colorName: 'Roxo' },
        ],
        // A imagem principal do card pode ser a primeira da lista de variações
        image: biquinivermelho,
        description: 'Biquíni de alta qualidade com tecido resistente ao cloro e sal, forro interno e alças ajustáveis. Ideal para dias de praia ou piscina.',
        category: 'Biquínis',
        sizes: ['PP', 'P', 'M', 'G', 'GG'],
        colors: ['black', 'purple'] // Cores para exibição (pode vir do .images)
    },
    {
        id: '2',
        name: 'Biquíni Vermelho Paixão',
        price: 169.90,
        image: biquinivermelho,
        description: 'Um clássico atemporal que exala paixão e estilo. Perfeito para qualquer ocasião na praia.',
        category: 'Biquínis',
        sizes: ['P', 'M', 'G'],
        colors: ['#DC2626']
    },
    {
        id: '3',
        name: 'Biquíni Tropical',
        price: 199.90,
        image: biquinipreto,
        description: 'Estampa vibrante inspirada na flora tropical brasileira. Conforto e beleza para seus dias de sol.',
        category: 'Biquínis',
        sizes: ['P', 'M', 'G'],
        colors: ['#000000']
    },
    {
        id: '4',
        name: 'Maiô Elegance',
        price: 249.90,
        image: 'https://images.unsplash.com/photo-1594916895315-e21e7d9b4009?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Elegância e sofisticação em um maiô que modela o corpo. Ideal para quem busca um visual clássico.',
        category: 'Maiôs',
        sizes: ['M', 'G', 'GG'],
        colors: ['black']
    },
    {
        id: '5',
        name: 'Biquíni Pureza',
        price: 179.90,
        image: 'https://images.unsplash.com/photo-1621376884615-5a7a7a13d2a7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Simplicidade e beleza em um biquíni branco que realça seu bronzeado.',
        category: 'Biquínis',
        sizes: ['PP', 'P', 'M', 'G'],
        colors: ['white']
    },
    {
        id: '6',
        name: 'Canga Tropical',
        price: 129.90,
        image: 'https://images.unsplash.com/photo-1588665793441-2b10a2f9b87b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Canga leve e versátil com estampa tropical, perfeita para complementar seu look praia.',
        category: 'Acessórios',
        sizes: ['Único'],
        colors: ['#000000']
    },
    {
        id: '7',
        name: 'Biquíni Verão Vibrante',
        price: 199.90,
        image: 'https://images.unsplash.com/photo-1616216447660-f463372c3d9a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Cores vibrantes para um verão inesquecível. Conforto e estilo.',
        category: 'Biquínis',
        sizes: ['P', 'M'],
        colors: ['orange']
    },
    {
        id: '8',
        name: 'Maiô Oceano',
        price: 259.90,
        image: 'biquiniLaranja',
        description: 'Maiô com estampa de oceano, ideal para um mergulho elegante.',
        category: 'Maiôs',
        sizes: ['M', 'G'],
        colors: ['blue']
    },
    {
        id: '9',
        name: 'Saída de Praia Aurora',
        price: 149.90,
        image: 'https://images.unsplash.com/photo-1588665793441-2b10a2f9b87b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Saída de praia leve e transparente, para um look sofisticado pós-praia.',
        category: 'Acessórios',
        sizes: ['Único'],
        colors: ['pink']
    }
];

const ProductGrid = ({ addToCart, openProductModal }) => {
    const [productsToShow, setProductsToShow] = useState(PRODUCTS_PER_LOAD);
    const [loadingMore, setLoadingMore] = useState(false);

    const displayedProducts = ALL_PRODUCTS_DATA.slice(0, productsToShow);
    const hasMoreProducts = productsToShow < ALL_PRODUCTS_DATA.length;

    const handleLoadMore = () => {
        setLoadingMore(true);
        // Simula um delay de carregamento (como se estivesse buscando da API)
        setTimeout(() => {
            setProductsToShow(prev => prev + PRODUCTS_PER_LOAD);
            setLoadingMore(false);
        }, 800); // 800ms de delay
    };

    return (
        <section id="shop" className="product-grid-section">
            <div className="container px-4">
                <h2 className="section-title">Nossa Loja</h2>

                {/* Filters */}
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

                    <div> {/* Div para o grupo de ordenar por */}
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

                {/* Products Grid */}
                <div className="products-grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {displayedProducts.map(product => (
                        <div
                            key={product.id}
                            className="product-card"
                            onClick={() => openProductModal(product)}
                        >
                            <div className="product-image-wrapper">
                                <img src={product.image} alt={product.name} className="product-image" />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-category">{product.category}</p>
                                <div className="product-price-add">
                                    <span className="product-price">R$ {product.price.toFixed(2).replace('.', ',')}</span>
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

                {/* Loading Spinner e Botão "Ver Mais Produtos" */}
                <div className="view-more-products-btn-container">
                    {loadingMore ? (
                        <LoadingSpinner />
                    ) : (
                        hasMoreProducts && (
                            <button
                                className="view-more-products-btn"
                                onClick={handleLoadMore}
                            >
                                Ver mais produtos
                            </button>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;