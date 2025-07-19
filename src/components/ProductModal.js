// src/components/ProductModal.js
import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, product, addToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    // Usaremos `selectedImageIndex` para controlar qual imagem de variação está ativa.
    const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Começa com a primeira imagem
    const [isZoomed, setIsZoomed] = useState(false); // Estado para o zoom
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 }); // Posição do mouse para o zoom

    // useEffect para resetar estados e definir a imagem inicial quando o modal abre ou o produto muda
    useEffect(() => {
        if (isOpen && product) {
            setQuantity(1);
            setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
            // Seleciona a primeira imagem como padrão ou a primeira imagem da variação
            setSelectedImageIndex(0);
            setIsZoomed(false); // Garante que o zoom esteja desativado ao abrir
        }
    }, [isOpen, product]);

    // Se o modal não estiver aberto ou não houver produto, não renderize nada
    if (!isOpen || !product) return null;

    // Determina a imagem principal a ser exibida
    // Se houver `product.images` (variações), usa a imagem selecionada, senão usa `product.image`
    const currentMainImage = product.images && product.images.length > 0
                             ? product.images[selectedImageIndex].src
                             : product.image;

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedSize, product.images?.[selectedImageIndex]?.colorName || 'N/A');
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === 'product-modal') {
            onClose();
        }
    };

    // --- Funções para a Lógica do Zoom ---
    const handleImageClick = () => {
        setIsZoomed(prev => !prev); // Alterna o estado de zoom
    };

    const handleImageMouseMove = (e) => {
        if (isZoomed) {
            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            setZoomPosition({ x, y });
        }
    };
    // --- Fim das Funções para a Lógica do Zoom ---

    return (
        <div id="product-modal" className={isOpen ? 'is-open' : ''} onClick={handleOverlayClick}>
            <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
                <button id="close-modal" className="modal-close-button" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>

                <div className="modal-product-layout md:flex-row">
                    {/* Área da Imagem Principal e Thumbnails */}
                    <div className="modal-product-image-area md:w-1/2">
                        {/* Imagem Principal com Lógica de Zoom e Lupa */}
                        <div
                            className="modal-main-image-container" // Novo container para a imagem principal
                            onClick={handleImageClick}
                            onMouseMove={handleImageMouseMove}
                            onMouseLeave={() => setIsZoomed(false)} // Desativa zoom ao sair
                        >
                            <img
                                id="modal-product-image"
                                src={currentMainImage} // Usa a imagem selecionada
                                alt={product.name}
                                className={`modal-product-image ${isZoomed ? 'zoomed' : ''}`}
                                style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                            />
                            <div className="modal-zoom-icon"> {/* Ícone de Lupa */}
                                <i className="fas fa-search-plus"></i>
                            </div>
                        </div>

                        {/* Thumbnails de Variação (se existirem) */}
                        {product.images && product.images.length > 1 && (
                            <div className="modal-thumbnail-grid">
                                {product.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`modal-thumbnail-item ${index === selectedImageIndex ? 'selected' : ''}`}
                                        onClick={() => setSelectedImageIndex(index)}
                                    >
                                        <img src={img.src} alt={img.alt} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Área de Detalhes do Produto (restante do modal) */}
                    <div className="modal-product-details-area md:w-1/2">
                        <h2 id="modal-product-name" className="modal-product-name">{product.name}</h2>
                        <p id="modal-product-price" className="modal-product-price">R$ {product.price.toFixed(2).replace('.', ',')}</p>

                        {/* Cores disponíveis (usando as cores do ProductGrid para simplificar, mas idealmente viriam do `product.images` ou `product.colors` do dado) */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-6">
                                <h3 className="modal-section-title">Cores disponíveis</h3>
                                <div className="modal-color-options">
                                    {product.colors.map((color, index) => ( // Usando o index para cores também
                                        <button
                                            key={index}
                                            className={`modal-color-swatch ${index === selectedImageIndex ? 'selected' : ''}`} /* Seleciona a bolinha de cor baseada na imagem ativa */
                                            // Você pode ajustar o style para usar `color.hex` ou `color.name` se o seu `product.colors` tiver mais detalhes
                                            style={color === 'pattern' ? {backgroundImage: `url(${product.image})`, backgroundSize: 'cover'} : {backgroundColor: color}}
                                            onClick={() => setSelectedImageIndex(index)} /* Ao clicar na cor, muda a imagem */
                                        ></button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <h3 className="modal-section-title">Tamanho</h3>
                                <div className="modal-size-grid">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`modal-size-button ${selectedSize === size ? 'selected' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="modal-section-title">Quantidade</h3>
                            <div className="modal-quantity-control">
                                <button
                                    className="modal-quantity-button rounded-l"
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    min="1"
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    className="modal-quantity-input"
                                />
                                <button
                                    className="modal-quantity-button rounded-r"
                                    onClick={() => setQuantity(prev => prev + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            id="modal-add-to-cart"
                            className="modal-add-to-cart-button"
                            onClick={handleAddToCart}
                        >
                            Adicionar ao Carrinho
                        </button>

                        <div className="modal-description-separator">
                            <h3 className="modal-section-title">Descrição</h3>
                            <p id="modal-product-description" className="modal-product-description">{product.description}</p>

                            <h3 className="modal-section-title">Tabela de Medidas</h3>
                            <div className="modal-table-container">
                                <table className="modal-table">
                                    <thead>
                                        <tr className="bg-sand-100">
                                            <th>Tamanho</th><th>Busto (cm)</th><th>Cintura (cm)</th><th>Quadril (cm)</th>
                                        </tr>
                                </thead>
                                    <tbody>
                                        <tr className="border-b"><td>PP</td><td>78-82</td><td>60-64</td><td>86-90</td></tr>
                                        <tr className="border-b"><td>P</td><td>82-86</td><td>64-68</td><td>90-94</td></tr>
                                        <tr className="border-b"><td>M</td><td>86-90</td><td>68-72</td><td>94-98</td></tr>
                                        <tr className="border-b"><td>G</td><td>90-94</td><td>72-76</td><td>98-102</td></tr>
                                        <tr><td>GG</td><td>94-98</td><td>76-80</td><td>102-106</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;