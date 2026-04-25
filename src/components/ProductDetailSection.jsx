import React, { useState, useEffect, useMemo, memo } from 'react';
import './ProductDetailSection.css';
import { getMediumSrc, getThumbSrc } from '../utils/productImage';
import { trackEvent } from '../utils/analytics';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const ProductDetailSection = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sizeWarning, setSizeWarning] = useState(false);

  const { toast, showToast, dismissToast } = useToast();

  const getMainVariation = (produto) => {
    if (!produto?.variacoes || produto.variacoes.length === 0) return null;
    return produto.variacoes[0];
  };

  const uniqueColors = useMemo(() => {
    if (!product?.variacoes) return [];
    return [...new Set(product.variacoes.map(v => v.cor).filter(Boolean))];
  }, [product?.variacoes]);

  const uniqueSizes = useMemo(() => {
    const sizeOrder = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'];
    const normalizeSizes = (sizes) =>
      sizes.map(s => s.toUpperCase()).sort((a, b) => {
        const iA = sizeOrder.indexOf(a);
        const iB = sizeOrder.indexOf(b);
        if (iA === -1 && iB === -1) return a.localeCompare(b);
        if (iA === -1) return 1;
        if (iB === -1) return -1;
        return iA - iB;
      });

    const variacaoTamanho = product?.variacoes?.[0]?.tamanho;
    if (variacaoTamanho && Array.isArray(variacaoTamanho)) {
      return normalizeSizes([...variacaoTamanho]);
    }
    if (product?.tamanho && Array.isArray(product.tamanho)) {
      return normalizeSizes([...product.tamanho]);
    }
    if (!product?.variacoes) return [];
    const sizes = [...new Set(product.variacoes.map(v => v.tamanho).filter(t => t && typeof t === 'string'))];
    return sizes.length === 0 ? [] : normalizeSizes(sizes);
  }, [product?.variacoes, product?.tamanho]);

  const findVariation = (color, size) => {
    if (!product?.variacoes) return null;
    const sizeStr = typeof size === 'string' ? size : null;
    return product.variacoes.find(v => {
      const colorMatch = !color || v.cor === color;
      let sizeMatch = !sizeStr;
      if (sizeStr && v.tamanho) {
        if (Array.isArray(v.tamanho)) {
          sizeMatch = v.tamanho.some(t => typeof t === 'string' && t.toUpperCase() === sizeStr.toUpperCase());
        } else if (typeof v.tamanho === 'string') {
          sizeMatch = v.tamanho.toUpperCase() === sizeStr.toUpperCase();
        }
      }
      return colorMatch && sizeMatch;
    });
  };

  const initialVariation = getMainVariation(product);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      const initial = getMainVariation(product);
      setSelectedVariation(initial);
      setSelectedColor(initial?.cor || null);
      setSelectedSize(null);
      setSelectedImageIndex(0);
      setIsZoomed(false);
      setIsTableExpanded(false);
      setIsLoading(false);
      setSizeWarning(false);

      // GA4: view_item
      const price = initial?.precoVenda ?? initial?.preco;
      trackEvent('view_item', {
        currency: 'BRL',
        value: typeof price === 'number' ? price : parseFloat(price) || 0,
        items: [{
          item_id: product._id?.timestamp || product.id || '',
          item_name: product.nome || '',
          price: typeof price === 'number' ? price : parseFloat(price) || 0,
        }],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

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

  if (!product) return null;

  const currentVariation = selectedVariation || initialVariation;
  const preco = currentVariation?.precoVenda ?? currentVariation?.preco;
  const imagem = getMediumSrc(currentVariation?.imagens?.[selectedImageIndex]);
  const altText = currentVariation?.imagens?.[selectedImageIndex]?.altText || product?.nome;
  const imagens = currentVariation?.imagens || [];

  const handleAddToCart = async () => {
    // Validação de tamanho
    if (uniqueSizes.length > 0 && !selectedSize) {
      setSizeWarning(true);
      showToast(
        'Por favor, selecione a(s) opção(ões) de cor e tamanho do seu produto',
        'warning'
      );
      return;
    }
    // Validação de cor (quando há múltiplas cores e nenhuma selecionada)
    if (uniqueColors.length > 1 && !selectedColor) {
      showToast(
        'Por favor, selecione a cor do produto antes de comprar',
        'warning'
      );
      return;
    }
    if (!currentVariation && !product) {
      showToast('Produto não disponível no momento.', 'error');
      return;
    }
    setIsLoading(true);
    setSizeWarning(false);
    try {
      const precoFinal = currentVariation?.precoVenda ?? currentVariation?.preco ?? product?.precoVenda ?? product?.preco;
      const productWithPrice = { ...product, price: precoFinal };
      const tamanhoFinal = selectedSize || currentVariation?.tamanho;
      const corFinal = currentVariation?.cor || selectedColor;

      // GA4: add_to_cart
      const priceNum = typeof precoFinal === 'number' ? precoFinal : parseFloat(precoFinal) || 0;
      trackEvent('add_to_cart', {
        currency: 'BRL',
        value: priceNum * quantity,
        items: [{
          item_id: product._id?.timestamp || product.id || '',
          item_name: product.nome || '',
          price: priceNum,
          quantity,
        }],
      });

      await addToCart(productWithPrice, quantity, tamanhoFinal, corFinal);
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      setIsLoading(false);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeWarning(false);
  };

  const handleImageClick = () => setIsZoomed(prev => !prev);

  const handleImageMouseMove = (e) => {
    if (isZoomed) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      setZoomPosition({
        x: ((e.clientX - left) / width) * 100,
        y: ((e.clientY - top) / height) * 100,
      });
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number' && !isNaN(price))
      return `R$ ${price.toFixed(2).replace('.', ',')}`;
    if (typeof price === 'string' && !isNaN(parseFloat(price.replace(',', '.'))))
      return `R$ ${parseFloat(price.replace(',', '.')).toFixed(2).replace('.', ',')}`;
    return 'Preço sob consulta';
  };

  const MeasurementsTable = () => (
    <table className="pdp-table">
      <thead>
        <tr><th>TAM.</th><th>BUSTO</th><th>CINTURA</th><th>QUADRIL</th></tr>
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

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="pdp-layout">
      {/* Toast de validação */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={dismissToast}
        />
      )}
      {/* ═══ LEFT: Images ═══ */}
      <div className="pdp-image-area">
        <div
          className="pdp-main-image-container"
          onClick={handleImageClick}
          onMouseMove={handleImageMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
          role="button"
          tabIndex="0"
          aria-label={isZoomed ? 'Diminuir zoom' : 'Ampliar imagem'}
        >
          <img
            src={imagem || '/placeholder.jpg'}
            srcSet={imagem ? `${getThumbSrc(currentVariation?.imagens?.[selectedImageIndex])} 400w, ${imagem} 800w` : undefined}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={altText}
            className={isZoomed ? 'zoomed' : ''}
            style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
            width="600"
            height="600"
            fetchPriority="high"
            decoding="sync"
          />
          <div className="pdp-zoom-icon">
            {isZoomed ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            )}
          </div>
        </div>

        {imagens.length > 1 && (
          <div className="pdp-thumbnail-grid">
            {imagens.map((img, index) => (
              <div
                key={index}
                className={`pdp-thumbnail-item ${index === selectedImageIndex ? 'selected' : ''}`}
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

        {/* Description — Desktop (below image, uses H2 for SEO) */}
        {product.descricao && (
          <div className="pdp-description-desktop">
            <h2>Descrição do Produto</h2>
            <p>{product.descricao}</p>
          </div>
        )}
      </div>

      {/* ═══ RIGHT: Details ═══ */}
      <div className="pdp-details-area">
        <h1 className="pdp-product-name">{product.nome}</h1>

        {/* Price + Scarcity */}
        <div className="pdp-price-block">
          <div className="pdp-product-price">{formatPrice(preco)}</div>
          {currentVariation?.estoque > 0 && currentVariation?.estoque <= 5 && (
            <div className="pdp-scarcity">
              <span className="pdp-scarcity-dot"></span>
              Apenas {currentVariation.estoque} unidade{currentVariation.estoque > 1 ? 's' : ''} disponível{currentVariation.estoque > 1 ? 'is' : ''}
            </div>
          )}
        </div>

        {/* Color selection */}
        {uniqueColors.length > 0 && (
          <div className="pdp-color-section">
            <span className="pdp-section-label">
              Cor: <strong>{selectedColor?.toUpperCase() || '—'}</strong>
            </span>
            {uniqueColors.length > 1 && (
              <div className="pdp-color-options">
                {uniqueColors.map((color, index) => (
                  <button
                    key={index}
                    className={`pdp-color-btn ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Cor ${color}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Size selection */}
        {uniqueSizes.length > 0 && (
          <div className="pdp-size-section">
            <span className="pdp-section-label">Escolha seu tamanho</span>
            <div className="pdp-size-tabs">
              {uniqueSizes.map((size, index) => (
                <button
                  key={index}
                  className={`pdp-size-tab ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                  aria-label={`Tamanho ${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeWarning && (
              <p className="pdp-size-warning" role="alert">
                ⚠ Por favor, selecione um tamanho antes de comprar.
              </p>
            )}
          </div>
        )}

        {/* Quantity */}
        <div className="pdp-quantity-section">
          <span className="pdp-section-label">Quantidade</span>
          <div className="pdp-quantity-control">
            <button
              className="pdp-quantity-button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              aria-label="Diminuir quantidade"
              disabled={quantity <= 1}
            >−</button>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="pdp-quantity-input"
              aria-label="Quantidade"
            />
            <button
              className="pdp-quantity-button"
              onClick={() => setQuantity(prev => prev + 1)}
              aria-label="Aumentar quantidade"
            >+</button>
          </div>
        </div>

        {/* CTA + Benefits + Trust */}
        <div className="pdp-cta-section">
          <button
            className="pdp-add-to-cart-button"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="pdp-spinner">⟳</span> Adicionando...</>
            ) : (
              'COMPRAR AGORA'
            )}
          </button>

          {/* Amazon button — renderiza SOMENTE se amazonUrl for string HTTP válida */}
          {(() => {
            const hasAmazon =
              typeof product.amazonUrl === 'string' &&
              product.amazonUrl.startsWith('http');
            if (!hasAmazon) return null;
            return (
              <>
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdp-amazon-button"
                  data-testid="amazon-button"
                  aria-label="Comprar este produto na Amazon"
                  onClick={() => {
                    try {
                      trackEvent('click_amazon', {
                        // Identificação do produto
                        item_id:       product.id || product._id?.timestamp || '',
                        item_name:     product.nome || product.name || '',
                        item_category: product.categoria || '',
                        // Preço no momento do clique
                        price: (() => {
                          const v = currentVariation || product?.variacoes?.[0];
                          const p = v?.precoVenda ?? v?.preco;
                          return typeof p === 'number' ? p : parseFloat(p) || 0;
                        })(),
                        currency: 'BRL',
                        // Contexto
                        event_label: 'amazon_button_pdp',
                        event_category: 'ecommerce',
                      });
                    } catch { /* analytics indisponível — falha silenciosa */ }
                  }}
                >
                  {/* Ícone de carrinho — sem SVG de texto que corta em flex */}
                  <svg className="pdp-amazon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
                    <circle cx="9" cy="21" r="1" fill="currentColor" stroke="none"/>
                    <circle cx="20" cy="21" r="1" fill="currentColor" stroke="none"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <span className="pdp-amazon-btn-text">
                    <span className="pdp-amazon-btn-main">Comprar na Amazon</span>
                    <span className="pdp-amazon-btn-sub">✔ Mais uma opção de compra segura</span>
                  </span>
                </a>
                <p className="pdp-amazon-trust">
                  🔒 Pagamento seguro no site (PIX e cartão) · também disponível na Amazon
                </p>
              </>
            );
          })()}

          <ul className="pdp-benefits">
            <li className="pdp-benefit-item">
              <span className="pdp-benefit-icon">🔥</span>
              Frete rápido para todo Brasil
            </li>
            <li className="pdp-benefit-item">
              <span className="pdp-benefit-icon">🔒</span>
              Compra segura via PIX
            </li>
            <li className="pdp-benefit-item">
              <span className="pdp-benefit-icon">⚡</span>
              Aprovação imediata
            </li>
          </ul>

          <div className="pdp-trust-badges">
            <div className="pdp-trust-badge">
              <CheckIcon />
              <span>🔒 Compra 100% segura</span>
            </div>
            <div className="pdp-trust-badge">
              <CheckIcon />
              <span>🚚 Envio rápido com código de rastreio</span>
            </div>
            <div className="pdp-trust-badge">
              <CheckIcon />
              <span>🔁 Troca fácil em até 7 dias</span>
            </div>
            <div className="pdp-trust-badge">
              <CheckIcon />
              <span>⭐ Clientes amam esse produto</span>
            </div>
          </div>
        </div>

        {/* Measurements — Desktop */}
        <div className="pdp-measurements-desktop">
          <h4>MEDIDAS</h4>
          <MeasurementsTable />
        </div>

        {/* Mobile: Description + Measurements */}
        <div className="pdp-mobile-extras">
          {product.descricao && (
            <div className="pdp-description-box">
              <h4>SOBRE O PRODUTO</h4>
              <p>{product.descricao}</p>
            </div>
          )}
          <button
            className="pdp-table-toggle"
            onClick={() => setIsTableExpanded(!isTableExpanded)}
            aria-expanded={isTableExpanded}
          >
            <span>Ver tabela de medidas</span>
            <i className={`fas fa-chevron-${isTableExpanded ? 'up' : 'down'}`}></i>
          </button>
          {isTableExpanded && <MeasurementsTable />}
        </div>
      </div>

      {/* ═══ Sticky mobile CTA bar: [Price] [COMPRAR AGORA] ═══ */}
      <div className="pdp-sticky-cta">
        <span className="pdp-sticky-price">{formatPrice(preco)}</span>
        <button
          className="pdp-add-to-cart-button"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          {isLoading ? 'Adicionando...' : 'COMPRAR AGORA'}
        </button>
      </div>
    </div>
  );
};

export default memo(ProductDetailSection);
