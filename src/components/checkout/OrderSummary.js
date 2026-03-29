import React, { useState } from 'react';
import { API_BASE_URL } from '../../api/axiosInstance';
import { getThumbSrc } from '../../utils/productImage';
import FreteCalculator from './FreteCalculator';

const buildImageUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

const formatCurrency = (value) =>
  (parseFloat(value) || 0).toFixed(2).replace('.', ',');

const OrderSummary = ({
  cart,
  subtotal,
  onUpdateQuantity,
  isAccordion = false,
  defaultOpen,
  // Props do sistema de frete
  freteState,
  onCepChange,
  onServicoChange,
  onCalcularFrete,
  // Props legadas (mantidas para compatibilidade)
  onShippingChange,
  selectedShipping,
  shippingOptions = [],
  shippingError,
  cepValue = '',
  onCepSearch,
  loadingCep = false,
}) => {
  const initialOpen = defaultOpen ?? !isAccordion;
  const [isOpen, setIsOpen] = useState(initialOpen);

  // Usa o novo sistema de frete se disponível, senão usa o legado
  const usaNovoFrete = !!freteState;
  
  // Calcula total com frete
  const freteValor = usaNovoFrete 
    ? (freteState?.status === 'success' ? freteState.freteValor : 0)
    : (selectedShipping?.price || 0);
  const total = subtotal + freteValor;

  const renderItems = () => (
    <div className="checkout-summary-items">
      {cart.map((item) => {
        const price =
          parseFloat(item.price) ||
          parseFloat(item.variacoes?.[0]?.preco) ||
          0;
        const rawImage =
          item.image ||
          getThumbSrc(item.imagens?.[0] || item.variacoes?.[0]?.imagens?.[0]) ||
          '';
        const imageUrl =
          buildImageUrl(rawImage) ||
          'https://via.placeholder.com/64x64?text=Produto';
        const itemId = item.cartItemId || item.id;

        return (
          <div key={itemId} className="checkout-summary-item">
            <img
              src={imageUrl}
              alt={item.nome || item.name || 'Produto'}
              className="checkout-summary-item-img"
            />
            <div className="checkout-summary-item-info">
              <span className="checkout-summary-item-name">
                {item.nome || item.name || 'Produto'}
              </span>
              {(item.selectedSize || item.selectedColor) && (
                <span className="checkout-summary-item-variant">
                  {[item.selectedSize, item.selectedColor]
                    .filter(Boolean)
                    .join(' / ')}
                </span>
              )}
              {onUpdateQuantity ? (
                <div className="checkout-summary-stepper">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(itemId, item.quantity - 1)
                    }
                    className="checkout-stepper-btn"
                    aria-label="Diminuir quantidade"
                  >
                    −
                  </button>
                  <span className="checkout-stepper-value">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(itemId, item.quantity + 1)
                    }
                    className="checkout-stepper-btn"
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
              ) : (
                <span className="checkout-summary-item-qty">
                  Qtd: {item.quantity}
                </span>
              )}
            </div>
            <span className="checkout-summary-item-price">
              R$ {formatCurrency(price * item.quantity)}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderShippingSection = () => {
    // Novo sistema de frete com API
    if (usaNovoFrete) {
      return (
        <div className="checkout-shipping-section">
          <FreteCalculator
            cepDestino={freteState.cepDestino}
            servicoSelecionado={freteState.servicoSelecionado}
            freteValor={freteState.freteValor}
            prazoLabel={freteState.prazoLabel}
            prazoMin={freteState.prazoMin}
            prazoMax={freteState.prazoMax}
            status={freteState.status}
            errorMessage={freteState.errorMessage}
            opcoesFrete={freteState.opcoesFrete || []}
            shipmentsInfo={freteState.shipmentsInfo}
            onCepChange={onCepChange}
            onServicoChange={onServicoChange}
            onCalcular={onCalcularFrete}
          />
        </div>
      );
    }

    // Sistema legado (fallback)
    return (
      <div className="checkout-shipping-section">
        {shippingOptions.length > 0 && (
          <>
            <p className="checkout-shipping-title">Escolha a entrega:</p>
            <div className="checkout-shipping-options-inline">
              {shippingOptions.map(option => (
                <label 
                  key={option.id} 
                  className={`checkout-shipping-option-inline ${selectedShipping?.id === option.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={selectedShipping?.id === option.id}
                    onChange={() => onShippingChange?.(option)}
                  />
                  <div className="checkout-shipping-option-content">
                    <span className="checkout-shipping-option-name">
                      {option.name}
                    </span>
                    <span className="checkout-shipping-option-price">
                      {option.price === 0 ? 'Grátis' : `R$ ${formatCurrency(option.price)}`}
                    </span>
                    <span className="checkout-shipping-option-days">{option.days}</span>
                  </div>
                </label>
              ))}
            </div>
            
            {shippingError && !selectedShipping && (
              <p className="checkout-shipping-error">⚠ Selecione uma opção de entrega</p>
            )}
          </>
        )}
      </div>
    );
  };

  const renderTotals = () => (
    <div className="checkout-summary-totals">
      <div className="checkout-summary-row">
        <span>Subtotal</span>
        <span>R$ {formatCurrency(subtotal)}</span>
      </div>
      
      {renderShippingSection()}

      {/* Linha de frete no resumo */}
      {freteValor > 0 && (
        <div className="checkout-summary-row checkout-summary-frete">
          <span>Frete ({usaNovoFrete ? freteState?.servicoSelecionado : selectedShipping?.name})</span>
          <span>R$ {formatCurrency(freteValor)}</span>
        </div>
      )}

      <div className="checkout-summary-row checkout-summary-total">
        <span>Total</span>
        <span>R$ {formatCurrency(total)}</span>
      </div>
    </div>
  );

  if (isAccordion) {
    return (
      <div className="checkout-summary-accordion">
        <button
          type="button"
          className="checkout-summary-accordion-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span>
            {isOpen ? 'Ocultar resumo' : 'Ver resumo'}
            <span className="checkout-summary-accordion-total">
              R$ {formatCurrency(total)}
            </span>
          </span>
          <span className={`checkout-accordion-icon ${isOpen ? 'open' : ''}`}>
            ▼
          </span>
        </button>
        {isOpen && (
          <div className="checkout-summary-accordion-content">
            {renderItems()}
            {renderTotals()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="checkout-summary-card">
      <h3 className="checkout-summary-title">Resumo do Pedido</h3>
      {renderItems()}
      {renderTotals()}
    </div>
  );
};

export default OrderSummary;
