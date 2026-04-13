import React, { useState, useEffect, useMemo } from 'react';
import './ProductModal.css';
import { getMediumSrc, getThumbSrc } from '../utils/productImage';

const ProductModal = ({ isOpen, onClose, product, addToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isTableExpanded, setIsTableExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getMainVariation = (produto) => {
        if (!produto?.variacoes || produto.variacoes.length === 0) return null;
        return produto.variacoes[0];
    };

    // Extrai cores únicas das variações
    const uniqueColors = useMemo(() => {
        if (!product?.variacoes) return [];
        const colors = [...new Set(product.variacoes.map(v => v.cor).filter(Boolean))];
        return colors;
    }, [product?.variacoes]);

    // Extrai tamanhos únicos das variações OU do campo tamanho (array)
    const uniqueSizes = useMemo(() => {
        const sizeOrder = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'];
        
        // Função para normalizar tamanho (uppercase)
        const normalizeSizes = (sizes) => {
            return sizes
                .map(s => s.toUpperCase()) // Normaliza para maiúsculo
                .sort((a, b) => {
                    const indexA = sizeOrder.indexOf(a);
                    const indexB = sizeOrder.indexOf(b);
                    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
                    if (indexA === -1) return 1;
                    if (indexB === -1) return -1;
                    return indexA - indexB;
                });
        };
        
        // Novo formato: tamanho é um array dentro da variação
        const variacaoTamanho = product?.variacoes?.[0]?.tamanho;
        if (variacaoTamanho && Array.isArray(variacaoTamanho)) {
            return normalizeSizes([...variacaoTamanho]);
        }
        
        // Formato alternativo: tamanho direto no produto
        if (product?.tamanho && Array.isArray(product.tamanho)) {
            return normalizeSizes([...product.tamanho]);
        }
        
        // Formato legado: extrai tamanhos únicos de múltiplas variações (string)
        if (!product?.variacoes) return [];
        const sizes = [...new Set(product.variacoes.map(v => v.tamanho).filter(t => t && typeof t === 'string'))];
        if (sizes.length === 0) return [];
        
        return normalizeSizes(sizes);
    }, [product?.variacoes, product?.tamanho]);

    // Encontra variação baseada na cor e tamanho selecionados
    const findVariation = (color, size) => {
        if (!product?.variacoes) return null;
        
        // Garante que size é uma string
        const sizeStr = typeof size === 'string' ? size : null;
        
        return product.variacoes.find(v => {
            const colorMatch = !color || v.cor === color;
            
            // Verifica tamanho - pode ser string ou array
            let sizeMatch = !sizeStr;
            if (sizeStr && v.tamanho) {
                if (Array.isArray(v.tamanho)) {
                    // Se tamanho é array, verifica se o size está incluído
                    sizeMatch = v.tamanho.some(t => 
                        typeof t === 'string' && t.toUpperCase() === sizeStr.toUpperCase()
                    );
                } else if (typeof v.tamanho === 'string') {
                    // Se tamanho é string, compara diretamente
                    sizeMatch = v.tamanho.toUpperCase() === sizeStr.toUpperCase();
                }
            }
            
            return colorMatch && sizeMatch;
        });
    };

    const initialVariation = getMainVariation(product);

    useEffect(() => {
        if (isOpen && product) {
            setQuantity(1);
            const initial = initialVariation;
            setSelectedVariation(initial);
            setSelectedColor(initial?.cor || uniqueColors[0] || null);
            // Não pré-seleciona tamanho - usuário deve escolher
            setSelectedSize(null);
            setSelectedImageIndex(0);
            setIsZoomed(false);
            setIsTableExpanded(false);
            setIsLoading(false);
            document.body.classList.add('modal-open');
            
            setTimeout(() => {
                const modal = document.querySelector('.modal-content-wrapper');
                if (modal) modal.focus();
            }, 100);
        } else {
            document.body.classList.remove('modal-open');
        }
        
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen, product, initialVariation, uniqueColors]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Atualiza variação quando cor ou tamanho mudam
    useEffect(() => {
        if (selectedColor || selectedSize) {
            const variation = findVariation(selectedColor, selectedSize);
            if (variation) {
                setSelectedVariation(variation);
                setSelectedImageIndex(0);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor, selectedSize]);

    if (!isOpen || !product) return null;

    const currentVariation = selectedVariation || initialVariation;
    // Suporta tanto 'precoVenda' (novo formato) quanto 'preco' (legado)
    const preco = currentVariation?.precoVenda ?? currentVariation?.preco;
    const imagem = getMediumSrc(currentVariation?.imagens?.[selectedImageIndex]);
    const altText = currentVariation?.imagens?.[selectedImageIndex]?.altText || product?.nome;
    const imagens = currentVariation?.imagens || [];

    const handleAddToCart = async () => {
        // Se tem tamanhos disponíveis e nenhum foi selecionado
        if (uniqueSizes.length > 0 && !selectedSize) {
            alert('Por favor, selecione um tamanho.');
            return;
        }

        if (!currentVariation && !product) {
            alert('Produto não disponível.');
            return;
        }

        setIsLoading(true);

        try {
            // Suporta tanto 'precoVenda' (novo formato) quanto 'preco' (legado)
            const precoFinal = currentVariation?.precoVenda ?? currentVariation?.preco ?? product?.precoVenda ?? product?.preco;
            
            const productWithPrice = {
                ...product,
                price: precoFinal,
            };

            // Usa o tamanho selecionado (do array ou da variação)
            const tamanhoFinal = selectedSize || currentVariation?.tamanho;
            const corFinal = currentVariation?.cor || selectedColor;

            await addToCart(productWithPrice, quantity, tamanhoFinal, corFinal);
            
            setTimeout(() => {
                onClose();
                setIsLoading(false);
            }, 500);
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            setIsLoading(false);
        }
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

    const formatPrice = (price) => {
        if (typeof price === 'number' && !isNaN(price)) {
            return `R$ ${price.toFixed(2).replace('.', ',')}`;
        }
        if (typeof price === 'string' && !isNaN(parseFloat(price.replace(',', '.')))) {
            return `R$ ${parseFloat(price.replace(',', '.')).toFixed(2).replace('.', ',')}`;
        }
        return 'Preço sob consulta';
    };

    // Tabela de medidas
    const MeasurementsTable = () => (
        <table className="modal-table">
            <thead>
                <tr>
                    <th>TAM.</th>
                    <th>BUSTO</th>
                    <th>CINTURA</th>
                    <th>QUADRIL</th>
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
    );

    return (
        <div 
            id="product-modal" 
            className={isOpen ? 'is-open' : ''} 
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-product-name"
        >
            <div 
                className="modal-content-wrapper" 
                onClick={(e) => e.stopPropagation()}
                tabIndex="-1"
            >
                <button 
                    className="modal-close-button" 
                    onClick={onClose}
                    aria-label="Fechar modal"
                >
                    <i className="fas fa-times"></i>
                </button>

                <div className="modal-product-layout">
                    {/* ESQUERDA: Imagem + Descrição */}
                    <div className="modal-product-image-area">
                        <div
                            className="modal-main-image-container"
                            onClick={handleImageClick}
                            onMouseMove={handleImageMouseMove}
                            onMouseLeave={() => setIsZoomed(false)}
                            role="button"
                            tabIndex="0"
                            aria-label={isZoomed ? "Diminuir zoom" : "Ampliar imagem"}
                        >
                            <img
                                src={imagem || '/placeholder.jpg'}
                                alt={altText}
                                className={isZoomed ? 'zoomed' : ''}
                                style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                                width="600"
                                height="600"
                                loading="eager"
                                fetchpriority="high"
                            />
                            <div className="modal-zoom-icon">
                                <i className={`fas ${isZoomed ? 'fa-search-minus' : 'fa-search-plus'}`}></i>
                            </div>
                        </div>

                        {imagens.length > 1 && (
                            <div className="modal-thumbnail-grid">
                                {imagens.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`modal-thumbnail-item ${index === selectedImageIndex ? 'selected' : ''}`}
                                        onClick={() => setSelectedImageIndex(index)}
                                        role="button"
                                        tabIndex="0"
                                        aria-label={`Imagem ${index + 1}`}
                                    >
                                        <img src={getThumbSrc(img)} alt={img.altText || product?.nome || `Foto ${index + 1}`} width="80" height="80" loading="lazy" decoding="async" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* DESCRIÇÃO - Desktop */}
                        {product.descricao && (
                            <div className="modal-description-desktop">
                                <h4>SOBRE O PRODUTO</h4>
                                <p>{product.descricao}</p>
                            </div>
                        )}
                    </div>

                    {/* DIREITA: Detalhes */}
                    <div className="modal-product-details-area">
                        <h2 id="modal-product-name" className="modal-product-name">
                            {product.nome}
                        </h2>
                        
                        <div className="modal-product-price">
                            {formatPrice(preco)}
                        </div>

                        {/* SELEÇÃO DE COR */}
                        {uniqueColors.length > 0 && (
                            <div className="modal-color-section">
                                <span className="modal-section-label">
                                    Cor: <strong>{selectedColor?.toUpperCase() || '—'}</strong>
                                </span>
                                {uniqueColors.length > 1 ? (
                                    <div className="modal-color-options">
                                        {uniqueColors.map((color, index) => (
                                            <button
                                                key={index}
                                                className={`modal-color-btn ${selectedColor === color ? 'selected' : ''}`}
                                                onClick={() => setSelectedColor(color)}
                                                aria-label={`Cor ${color}`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* SELEÇÃO DE TAMANHO */}
                        {uniqueSizes.length > 0 && (
                            <div className="modal-size-section">
                                <span className="modal-section-label">Selecione o tamanho</span>
                                <div className="modal-size-tabs">
                                    {uniqueSizes.map((size, index) => (
                                        <button
                                            key={index}
                                            className={`modal-size-tab ${selectedSize === size ? 'selected' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                            aria-label={`Tamanho ${size}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* QUANTIDADE */}
                        <div className="modal-quantity-section">
                            <span className="modal-section-label">Quantidade</span>
                            <div className="modal-quantity-control">
                                <button
                                    className="modal-quantity-button"
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    aria-label="Diminuir quantidade"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    min="1"
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    className="modal-quantity-input"
                                    aria-label="Quantidade"
                                />
                                <button
                                    className="modal-quantity-button"
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    aria-label="Aumentar quantidade"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="modal-cta-section">
                            <button
                                className="modal-add-to-cart-button"
                                onClick={handleAddToCart}
                                disabled={isLoading || (uniqueSizes.length > 0 && !selectedSize)}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Adicionando...
                                    </>
                                ) : (
                                    'ADICIONAR AO CARRINHO'
                                )}
                            </button>
                            
                            <div className="modal-trust-line">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                                </svg>
                                <span>Compra segura • PIX com aprovação imediata</span>
                            </div>
                        </div>

                        {/* MEDIDAS - Desktop */}
                        <div className="modal-measurements-desktop">
                            <h4>MEDIDAS</h4>
                            <MeasurementsTable />
                        </div>

                        {/* MOBILE: Descrição + Medidas */}
                        <div className="modal-mobile-extras">
                            {product.descricao && (
                                <div className="modal-description-box">
                                    <h4>SOBRE O PRODUTO</h4>
                                    <p>{product.descricao}</p>
                                </div>
                            )}

                            <button 
                                className="modal-table-toggle"
                                onClick={() => setIsTableExpanded(!isTableExpanded)}
                                aria-expanded={isTableExpanded}
                            >
                                <span>Ver tabela de medidas</span>
                                <i className={`fas fa-chevron-${isTableExpanded ? 'up' : 'down'}`}></i>
                            </button>
                            
                            {isTableExpanded && <MeasurementsTable />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;

