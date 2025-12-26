import React from 'react';

const PixHowItWorks = ({ compact = false }) => {
  if (compact) {
    // Versão compacta para desktop - sidebar esquerda
    return (
      <div className="pix-how-compact">
        <div className="pix-how-compact-header">
          <span className="pix-how-compact-badge">PIX</span>
          <div>
            <h4 className="pix-how-compact-title">Como pagar</h4>
            <p className="pix-how-compact-subtitle">Rápido e seguro</p>
          </div>
        </div>

        <div className="pix-how-compact-steps">
          <div className="pix-how-compact-step">
            <span className="pix-how-compact-number">1</span>
            <p>Abra o <strong>app do seu banco</strong></p>
          </div>
          <div className="pix-how-compact-step">
            <span className="pix-how-compact-number">2</span>
            <p>Escaneie o <strong>QR Code</strong> ao lado</p>
          </div>
          <div className="pix-how-compact-step">
            <span className="pix-how-compact-number">3</span>
            <p>Confirme e <strong>pronto!</strong></p>
          </div>
        </div>

        <div className="pix-how-compact-note">
          <span>✓</span>
          <span>Confirmação automática em segundos</span>
        </div>
      </div>
    );
  }

  // Versão mobile/tablet - empilhada
  return (
    <div className="pix-how-mobile">
      <div className="pix-how-mobile-steps">
        <div className="pix-how-mobile-step">
          <span className="pix-how-mobile-number">1</span>
          <span>Abra o app do banco</span>
        </div>
        <span className="pix-how-mobile-arrow">→</span>
        <div className="pix-how-mobile-step">
          <span className="pix-how-mobile-number">2</span>
          <span>Escaneie o QR Code</span>
        </div>
        <span className="pix-how-mobile-arrow">→</span>
        <div className="pix-how-mobile-step">
          <span className="pix-how-mobile-number">3</span>
          <span>Confirme o pagamento</span>
        </div>
      </div>
    </div>
  );
};

export default PixHowItWorks;
