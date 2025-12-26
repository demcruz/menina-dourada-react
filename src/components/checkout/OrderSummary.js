import React, { useState } from 'react';
import { API_BASE_URL } from '../../api/axiosInstance';

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
}) => {
  const [isOpen, setIsOpen] = useState(!isAccordion);

  const renderItems = () => (
    <div className="checkout-summary-items">
      {cart.map((item) => {
        const price =
          parseFloat(item.price) ||
          parseFloat(item.variacoes?.[0]?.preco) ||
          0;
        const rawImage =
          item.image ||
          item.imagens?.[0]?.url ||
          item.variacoes?.[0]?.imagens?.[0]?.url ||
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

  const renderTotals = () => (
    <div className="checkout-summary-totals">
      <div className="checkout-summary-row">
        <span>Subtotal</span>
        <span>R$ {formatCurrency(subtotal)}</span>
      </div>
      <div className="checkout-summary-row">
        <span>Frete</span>
        <span className="checkout-summary-free">Grátis</span>
      </div>
      <div className="checkout-summary-row checkout-summary-total">
        <span>Total</span>
        <span>R$ {formatCurrency(subtotal)}</span>
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
              R$ {formatCurrency(subtotal)}
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
