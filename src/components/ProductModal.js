// src/components/ProductModal.js
import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, product, addToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    useEffect(() => {
        if (isOpen && product) {
            setQuantity(1);
            setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
            setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedSize, selectedColor);
        onClose();
    };

    // Função para lidar com o clique no overlay (fundo escuro)
    const handleOverlayClick = (e) => {
        // Se o clique foi diretamente no container do modal (o overlay), feche o modal
        if (e.target.id === 'product-modal') {
            onClose();
        }
    };

    return (
        // Adicione o onClick ao container principal do modal
        <div id="product-modal" className={isOpen ? 'is-open' : ''} onClick={handleOverlayClick}>
            <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}> {/* Impede que cliques dentro do conteúdo fechem o modal */}
                <button id="close-modal" className="modal-close-button" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>

                <div className="modal-product-layout md:flex-row">
                    <div className="modal-product-image-area md:w-1/2">
                        <img id="modal-product-image" src={product.image} alt={product.name} className="modal-product-image" />

                        <div className="modal-thumbnail-grid">
                            <div className="modal-thumbnail-item">
                                <img src={product.image} alt="Thumbnail" />
                            </div>
                            <div className="modal-thumbnail-item">
                                <img src={product.image} alt="Thumbnail" />
                            </div>
                        </div>
                    </div>

                    <div className="modal-product-details-area md:w-1/2">
                        <h2 id="modal-product-name" className="modal-product-name">{product.name}</h2>
                        <p id="modal-product-price" className="modal-product-price">R$ {product.price.toFixed(2).replace('.', ',')}</p>

                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-6">
                                <h3 className="modal-section-title">Cores disponíveis</h3>
                                <div className="modal-color-options">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            className={`modal-color-swatch ${selectedColor === color ? 'selected' : ''}`}
                                            style={color === 'pattern' ? {backgroundImage: `url(${product.image})`, backgroundSize: 'cover'} : {backgroundColor: color}}
                                            onClick={() => setSelectedColor(color)}
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