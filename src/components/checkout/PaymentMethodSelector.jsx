import React from 'react';

const METHODS = [
  {
    id: 'PIX',
    label: 'PIX',
    icon: '⚡',
    description: 'Aprovação instantânea',
    badge: null,
  },
  {
    id: 'CREDIT_CARD',
    label: 'Cartão de Crédito',
    icon: '💳',
    description: 'Visa, Mastercard, Elo',
    badge: null,
  },
];

const PaymentMethodSelector = ({ selected, onChange }) => {
  return (
    <div className="payment-method-selector">
      <h3 className="checkout-form-section-title">Forma de Pagamento</h3>
      <p className="checkout-form-section-desc">Escolha como deseja pagar</p>
      <div className="payment-method-options">
        {METHODS.map((method) => (
          <button
            key={method.id}
            type="button"
            className={`payment-method-option${selected === method.id ? ' payment-method-option--active' : ''}`}
            onClick={() => onChange(method.id)}
            aria-pressed={selected === method.id}
          >
            <span className="payment-method-icon">{method.icon}</span>
            <span className="payment-method-info">
              <span className="payment-method-label">{method.label}</span>
              <span className="payment-method-desc">{method.description}</span>
            </span>
            {method.badge && (
              <span className="payment-method-badge">{method.badge}</span>
            )}
            <span className="payment-method-radio">
              <span className={`payment-method-radio-dot${selected === method.id ? ' payment-method-radio-dot--checked' : ''}`} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
