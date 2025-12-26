import React from 'react';

const formatCurrency = (value) => (parseFloat(value) || 0).toFixed(2).replace('.', ',');

const OrderItemsCard = ({ items, subtotal, compact = false }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`checkout-order-items-card ${compact ? 'compact' : ''}`}>
      <div className="checkout-order-items-header">
        <span className="checkout-order-items-icon">🛒</span>
        <h3 className="checkout-order-items-title">Resumo do Pedido</h3>
      </div>
      
      <div className="checkout-order-items-list">
        {items.map((item) => (
          <div key={item.id} className="checkout-order-item">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.name} 
                className="checkout-order-item-img"
              />
            )}
            <div className="checkout-order-item-info">
              <span className="checkout-order-item-name">{item.name}</span>
              <span className="checkout-order-item-qty">Qtd: {item.quantity}</span>
            </div>
            <span className="checkout-order-item-price">
              R$ {formatCurrency(item.unitPrice * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="checkout-order-items-footer">
        <div className="checkout-order-items-row">
          <span>Subtotal</span>
          <span>R$ {formatCurrency(subtotal)}</span>
        </div>
        <div className="checkout-order-items-row">
          <span>Frete</span>
          <span className="checkout-free-shipping">Grátis</span>
        </div>
        <div className="checkout-order-items-row checkout-order-total">
          <span>Total</span>
          <span>R$ {formatCurrency(subtotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsCard;
