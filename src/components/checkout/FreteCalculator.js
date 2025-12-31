import React, { useEffect, useRef, useState } from 'react';
import './FreteCalculator.css';

// Logos padrão para cada transportadora
const DEFAULT_LOGOS = {
  PAC: 'https://melhorenvio.com.br/images/shipping-companies/correios.png',
  SEDEX: 'https://melhorenvio.com.br/images/shipping-companies/correios.png',
  Jadlog: 'https://melhorenvio.com.br/images/shipping-companies/jadlog.png',
};

const formatCep = (value) => {
  const digits = (value || '').replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const formatCurrency = (value) =>
  (parseFloat(value) || 0).toFixed(2).replace('.', ',');

const FreteCalculator = ({
  cepDestino,
  servicoSelecionado,
  freteValor,
  prazoLabel,
  prazoMin,
  prazoMax,
  status,
  errorMessage,
  opcoesFrete = [],
  shipmentsInfo,
  onCepChange,
  onServicoChange,
  onCalcular,
}) => {
  const [localCep, setLocalCep] = useState(formatCep(cepDestino));
  const [isEditing, setIsEditing] = useState(status !== 'success' || opcoesFrete.length === 0);
  const [ignoreSync, setIgnoreSync] = useState(false);
  const [shouldScrollToOptions, setShouldScrollToOptions] = useState(false);
  const optionsRef = useRef(null);

  // Sincroniza CEP externo (apenas se não estiver ignorando)
  useEffect(() => {
    if (cepDestino && !ignoreSync) {
      setLocalCep(formatCep(cepDestino));
    }
  }, [cepDestino, ignoreSync]);

  const handleCepInputChange = (e) => {
    const formatted = formatCep(e.target.value);
    setLocalCep(formatted);
    
    const cleanCep = formatted.replace(/\D/g, '');
    onCepChange?.(cleanCep);
  };

  const handleCepKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cleanCep = localCep.replace(/\D/g, '');
      if (cleanCep.length === 8) {
        setIgnoreSync(false); // Volta a sincronizar
        setShouldScrollToOptions(true);
        onCalcular?.(cleanCep);
        setIsEditing(false);
      }
    }
  };

  const handleServicoChange = (servicoKey) => {
    onServicoChange?.(servicoKey);
  };

  const handleCalcularClick = () => {
    const cleanCep = localCep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIgnoreSync(false); // Volta a sincronizar
      setShouldScrollToOptions(true);
      onCalcular?.(cleanCep);
      setIsEditing(false);
    }
  };

  const handleEditarCep = () => {
    setIsEditing(true);
    setIgnoreSync(true); // Ignora sincronização externa
    setLocalCep(''); // Limpa o campo local
  };

  const cepCompleto = localCep.replace(/\D/g, '').length === 8;

  useEffect(() => {
    if (!shouldScrollToOptions) return;
    if (status !== 'success' || opcoesFrete.length === 0) return;
    if (optionsRef.current) {
      optionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShouldScrollToOptions(false);
  }, [shouldScrollToOptions, status, opcoesFrete.length]);

  // Formata prazo para exibição
  const getPrazoDisplay = (opcao) => {
    if (opcao.prazoLabel) return opcao.prazoLabel;
    if (opcao.delivery_range?.min && opcao.delivery_range?.max) {
      if (opcao.delivery_range.min === opcao.delivery_range.max) {
        return `${opcao.delivery_range.min} ${opcao.delivery_range.min === 1 ? 'dia útil' : 'dias úteis'}`;
      }
      return `${opcao.delivery_range.min}-${opcao.delivery_range.max} dias úteis`;
    }
    if (opcao.delivery_time) {
      return `${opcao.delivery_time} ${opcao.delivery_time === 1 ? 'dia útil' : 'dias úteis'}`;
    }
    return 'Consultar prazo';
  };

  // Obtém logo da transportadora
  const getLogo = (opcao) => {
    if (opcao.picture) return opcao.picture;
    return DEFAULT_LOGOS[opcao.key] || null;
  };

  return (
    <div className="frete-calculator">
      {/* Campo de CEP - Modo Edição */}
      {isEditing && (
        <div className="frete-cep-section">
          <label className="frete-cep-label">Calcular frete:</label>
          <div className="frete-cep-row">
            <input
              type="text"
              value={localCep}
              onChange={handleCepInputChange}
              onKeyDown={handleCepKeyDown}
              placeholder="00000-000"
              className="frete-cep-input"
              maxLength={9}
              autoFocus={status === 'success'}
            />
            <button
              type="button"
              onClick={handleCalcularClick}
              disabled={!cepCompleto || status === 'loading'}
              className="frete-cep-btn"
            >
              {status === 'loading' ? '...' : 'OK'}
            </button>
          </div>
        </div>
      )}

      {/* CEP já calculado - Modo Visualização */}
      {!isEditing && status === 'success' && (
        <div className="frete-cep-section">
          <label className="frete-cep-label">Frete para:</label>
          <div className="frete-cep-display">
            <span className="frete-cep-value">{localCep}</span>
            <button
              type="button"
              onClick={handleEditarCep}
              className="frete-cep-edit-btn"
            >
              Alterar
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {status === 'loading' && (
        <div className="frete-resultado frete-loading">
          <div className="frete-loading-spinner"></div>
          <span className="frete-loading-text">Calculando frete…</span>
        </div>
      )}

      {/* Erro */}
      {status === 'error' && (
        <div className="frete-resultado frete-error">
          <span className="frete-error-icon">⚠</span>
          <span className="frete-error-text">{errorMessage}</span>
        </div>
      )}

      {/* Aviso de múltiplas origens */}
      {status === 'success' && shipmentsInfo && (
        <div className="frete-shipments-info">
          <span className="frete-shipments-icon">📦</span>
          <span>{shipmentsInfo}</span>
        </div>
      )}

      {/* Opções de frete */}
      {status === 'success' && opcoesFrete.length > 0 && (
        <div className="frete-opcoes-section" ref={optionsRef}>
          <p className="frete-opcoes-title">Escolha a entrega:</p>
          <div className="frete-opcoes-list">
            {opcoesFrete.map((opcao) => {
              const logo = getLogo(opcao);
              const prazo = getPrazoDisplay(opcao);
              const isSelected = servicoSelecionado === opcao.key;
              
              return (
                <label 
                  key={opcao.key} 
                  className={`frete-opcao ${isSelected ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="freteOpcao"
                    value={opcao.key}
                    checked={isSelected}
                    onChange={() => handleServicoChange(opcao.key)}
                  />
                  <div className="frete-opcao-content">
                    <div className="frete-opcao-header">
                      <div className="frete-opcao-info">
                        {logo && (
                          <img 
                            src={logo} 
                            alt={opcao.key} 
                            className="frete-opcao-logo"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <span className="frete-opcao-name">{opcao.key}</span>
                      </div>
                      <span className="frete-opcao-preco">R$ {formatCurrency(opcao.price)}</span>
                    </div>
                    <span className="frete-opcao-prazo">{prazo}</span>
                    
                    {/* Tooltip para múltiplas origens */}
                    {opcao.meta?.parts && (
                      <span className="frete-opcao-parts">
                        {Object.entries(opcao.meta.parts).map(([uf, info]) => (
                          <span key={uf} className="frete-part">
                            {uf}: R$ {formatCurrency(info.price)}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreteCalculator;
