import React from 'react';

const PixInfoCard = () => {
  return (
    <div className="checkout-pix-card">
      <div className="checkout-pix-header">
        <span className="checkout-pix-icon">
          <i className="fas fa-qrcode"></i>
        </span>
        <h3 className="checkout-pix-title">Pagamento exclusivo via PIX</h3>
      </div>
      <ul className="checkout-pix-benefits">
        <li>
          <span className="checkout-pix-benefit-icon">⚡</span>
          <span>Aprovação instantânea</span>
        </li>
        <li>
          <span className="checkout-pix-benefit-icon">✓</span>
          <span>Sem taxas adicionais</span>
        </li>
        <li>
          <span className="checkout-pix-benefit-icon">📱</span>
          <span>QR Code gerado ao finalizar</span>
        </li>
      </ul>
    </div>
  );
};

export default PixInfoCard;
