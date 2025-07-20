// src/components/ProductModal.js
import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, product, addToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    // 👉 Função para pegar a variação principal (ou primeira)
    const getMainVariation = (produto) => {
        if (!produto?.variacoes || produto.variacoes.length === 0) return null;
        return produto.variacoes[0]; // ou lógica com .find(v => v.isPrincipal)
    };

    const variation = getMainVariation(product);
    const preco = variation?.preco;
    const imagem = variation?.imagens?.[selectedImageIndex]?.url;
    const altText = variation?.imagens?.[selectedImageIndex]?.altText || product?.nome;
    const imagens = variation?.imagens || [];

    useEffect(() => {
    if (isOpen && product) {
        setQuantity(1);
        setSelectedSize(variation?.tamanho || '');
        setSelectedImageIndex(0);
        setIsZoomed(false);
    }
}, [isOpen, product, variation?.tamanho]);

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedSize, variation?.cor || 'N/A');
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === 'product-modal') {
            onClose();
        }
    };

    const handleImageClick = () => {
        setIsZoomed(prev => !prev);
    };

    const handleImageMouseMove = (e) => {
        if (isZoomed) {
            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            setZoomPosition({ x, y });
        }
    };

    return (
        <div id="product-modal" className={isOpen ? 'is-open' : ''} onClick={handleOverlayClick}>
            <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
                <button id="close-modal" className="modal-close-button" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>

                <div className="modal-product-layout md:flex-row">
                    <div className="modal-product-image-area md:w-1/2">
                        <div
                            className="modal-main-image-container"
                            onClick={handleImageClick}
                            onMouseMove={handleImageMouseMove}
                            onMouseLeave={() => setIsZoomed(false)}
                        >
                            <img
                                id="modal-product-image"
                                src={imagem || '/placeholder.jpg'}
                                alt={altText}
                                className={`modal-product-image ${isZoomed ? 'zoomed' : ''}`}
                                style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                            />
                            <div className="modal-zoom-icon">
                                <i className="fas fa-search-plus"></i>
                            </div>
                        </div>

                        {imagens.length > 1 && (
                            <div className="modal-thumbnail-grid">
                                {imagens.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`modal-thumbnail-item ${index === selectedImageIndex ? 'selected' : ''}`}
                                        onClick={() => setSelectedImageIndex(index)}
                                    >
                                        <img src={img.url} alt={img.altText || `Variação ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-product-details-area md:w-1/2">
                        <h2 id="modal-product-name" className="modal-product-name">{product.nome}</h2>
                        <p>Preço: R$ {preco ? preco.toFixed(2).replace('.', ',') : '—'}</p>

                        {variation?.tamanho && (
                            <div className="mb-6">
                                <h3 className="modal-section-title">Tamanho</h3>
                                <div className="modal-size-grid">
                                    <button
                                        className={`modal-size-button selected`}
                                        onClick={() => setSelectedSize(variation.tamanho)}
                                    >
                                        {variation.tamanho}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="modal-section-title">Quantidade</h3>
                            <div className="modal-quantity-control">
                                <button
                                    className="modal-quantity-button rounded-l"
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                >-</button>
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
                                >+</button>
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
                            <p id="modal-product-description" className="modal-product-description">
                                {product.descricao}
                            </p>

                            <h3 className="modal-section-title">Tabela de Medidas</h3>
                            <div className="modal-table-container">
                                <table className="modal-table">
                                    <thead>
                                        <tr className="bg-sand-100">
                                            <th>Tamanho</th><th>Busto (cm)</th><th>Cintura (cm)</th><th>Quadril (cm)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>PP</td><td>78-82</td><td>60-64</td><td>86-90</td></tr>
                                        <tr><td>P</td><td>82-86</td><td>64-68</td><td>90-94</td></tr>
                                        <tr><td>M</td><td>86-90</td><td>68-72</td><td>94-98</td></tr>
                                        <tr><td>G</td><td>90-94</td><td>72-76</td><td>98-102</td></tr>
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
