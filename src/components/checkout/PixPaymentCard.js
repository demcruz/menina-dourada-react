import React, { useState } from 'react';

const formatCurrency = (value) => (parseFloat(value) || 0).toFixed(2).replace('.', ',');

const PixPaymentCard = ({ 
  pixQrCode, 
  paymentMeta, 
  paymentStatus, 
  onRetry,
  isLoading 
}) => {
  const [copyStatus, setCopyStatus] = useState('');

  const handleCopyPayload = async () => {
    if (!pixQrCode?.payload) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(pixQrCode.payload);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = pixQrCode.payload;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyStatus('✓ Copiado!');
      setTimeout(() => setCopyStatus(''), 2500);
    } catch {
      setCopyStatus('Erro ao copiar');
    }
  };

  const statusConfig = {
    PENDING: { text: 'Aguardando pagamento', color: '#BFA14A', icon: '⏳' },
    CONFIRMING: { text: 'Confirmando...', color: '#38A169', icon: '🔄' },
    PAID: { text: 'Pago!', color: '#38A169', icon: '✅' },
    TIMEOUT: { text: 'Tempo esgotado', color: '#E57373', icon: '⚠️' },
  };

  const status = statusConfig[paymentStatus] || statusConfig.PENDING;

  if (isLoading) {
    return (
      <div className="pix-card pix-card-loading">
        <div className="pix-card-spinner" />
        <p>Gerando QR Code...</p>
      </div>
    );
  }

  if (!pixQrCode) return null;

  return (
    <div className="pix-card">
      {/* QR Code Section */}
      <div className="pix-card-qr-section">
        {pixQrCode.encodedImage && (
          <div className="pix-card-qr-wrapper">
            <img
              src={pixQrCode.encodedImage}
              alt="QR Code PIX"
              className="pix-card-qr-image"
              width="200"
              height="200"
              loading="eager"
              decoding="sync"
            />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="pix-card-status" style={{ background: status.color }}>
          {status.icon} {status.text}
        </div>

        {/* Value */}
        <div className="pix-card-value">
          <span className="pix-card-value-label">Total</span>
          <span className="pix-card-value-amount">R$ {formatCurrency(paymentMeta?.value)}</span>
        </div>
      </div>

      {/* Copy Code Section */}
      <div className="pix-card-code-section">
        <div className="pix-card-code-header">
          <span className="pix-card-code-label">Código PIX</span>
          <button 
            type="button" 
            onClick={handleCopyPayload} 
            className={`pix-card-copy-btn ${copyStatus ? 'copied' : ''}`}
          >
            {copyStatus || '📋 Copiar'}
          </button>
        </div>
        <div className="pix-card-code-box">
          <code className="pix-card-code-text">{pixQrCode.payload}</code>
        </div>
      </div>

      {/* Footer */}
      <div className="pix-card-footer">
        {paymentMeta?.dueDate && (
          <span className="pix-card-expiry">Válido até {paymentMeta.dueDate}</span>
        )}
        <span className="pix-card-security">🔒 Pagamento seguro</span>
      </div>

      {paymentStatus === 'TIMEOUT' && onRetry && (
        <button type="button" onClick={onRetry} className="pix-card-retry-btn">
          Tentar novamente
        </button>
      )}
    </div>
  );
};

export default PixPaymentCard;
