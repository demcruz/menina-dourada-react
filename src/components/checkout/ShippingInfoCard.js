import React from 'react';

const ShippingInfoCard = ({ deliveryInfo }) => {
  if (!deliveryInfo) return null;

  const fullName = deliveryInfo.fullName || `${deliveryInfo.firstName || ''} ${deliveryInfo.lastName || ''}`.trim();
  const addressLine = [
    deliveryInfo.address,
    deliveryInfo.number,
    deliveryInfo.complement,
  ].filter(Boolean).join(', ');
  
  const cityLine = [
    deliveryInfo.neighborhood,
    deliveryInfo.city,
    deliveryInfo.state,
  ].filter(Boolean).join(' - ');

  return (
    <div className="checkout-shipping-card">
      <div className="checkout-shipping-header">
        <span className="checkout-shipping-icon">📦</span>
        <h3 className="checkout-shipping-title">Dados de Envio</h3>
      </div>
      <div className="checkout-shipping-content">
        <p className="checkout-shipping-name">{fullName}</p>
        {deliveryInfo.email && (
          <p className="checkout-shipping-detail">{deliveryInfo.email}</p>
        )}
        {deliveryInfo.phone && (
          <p className="checkout-shipping-detail">{deliveryInfo.phone}</p>
        )}
        <div className="checkout-shipping-address">
          <p>{addressLine}</p>
          <p>{cityLine}</p>
          {deliveryInfo.zipCode && <p>CEP: {deliveryInfo.zipCode}</p>}
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoCard;
