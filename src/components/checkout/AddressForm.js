import React, { useCallback, useEffect, useRef, useState } from 'react';
import FormInput from './FormInput';
import FormSection from './FormSection';

// Mapeamento UF -> Nome do Estado
const UF_PARA_ESTADO = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia',
  CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
  PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul',
  RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo',
  SE: 'Sergipe', TO: 'Tocantins',
};

const AddressForm = ({ data, onChange, onCepSearch, onShippingLoad, onCalcularFrete, errors = {} }) => {
  const [loadingCep, setLoadingCep] = useState(false);
  const lastCepRef = useRef('');

  // Simula busca de frete (substituir por API real dos Correios)
  const fetchShippingOptions = useCallback(async (cep) => {
    // Simulação - depois integrar com API real
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'sedex', name: 'SEDEX', price: 29.90, days: '2-3 dias úteis' },
          { id: 'pac', name: 'PAC', price: 0, days: '5-8 dias úteis' }
        ]);
      }, 300);
    });
  }, []);

  const fetchCep = useCallback(async (cep) => {
    if (cep.length !== 8 || cep === lastCepRef.current) return;
    lastCepRef.current = cep;
    setLoadingCep(true);
    try {
      // Busca endereço
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const result = await response.json();
      
      if (!result.erro) {
        onCepSearch({
          address: result.logradouro || '',
          neighborhood: result.bairro || '',
          city: result.localidade || '',
          state: result.uf || '',
        });
        
        // Busca opções de frete via API Lambda
        onCalcularFrete?.(cep);
        
        // Busca opções de frete legado (mantido para compatibilidade)
        const shippingOptions = await fetchShippingOptions(cep);
        onShippingLoad?.(shippingOptions);
      } else {
        lastCepRef.current = '';
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
      lastCepRef.current = '';
    } finally {
      setLoadingCep(false);
    }
  }, [onCepSearch, onShippingLoad, onCalcularFrete, fetchShippingOptions]);

  const handleCepSearch = async () => {
    const cep = data.zipCode.replace(/\D/g, '');
    await fetchCep(cep);
  };

  useEffect(() => {
    const cep = data.zipCode.replace(/\D/g, '');
    if (cep.length === 8) {
      fetchCep(cep);
    }
  }, [data.zipCode, fetchCep]);

  return (
    <FormSection title="Endereço de Entrega" description="Para onde devemos enviar seu pedido">
      <div className="checkout-grid checkout-grid-cep">
        <FormInput
          label="CEP"
          name="zipCode"
          value={data.zipCode}
          onChange={onChange}
          placeholder="00000-000"
          required
          mask="cep"
          error={errors.zipCode}
          className="checkout-cep-input"
        />
        <button
          type="button"
          onClick={handleCepSearch}
          disabled={loadingCep}
          className="checkout-cep-btn"
        >
          {loadingCep ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
      <div className="checkout-grid checkout-grid-1">
        <FormInput
          label="Endereço"
          name="address"
          value={data.address}
          onChange={onChange}
          placeholder="Rua, Avenida..."
          required
          error={errors.address}
        />
      </div>
      <div className="checkout-grid checkout-grid-2-uneven">
        <FormInput
          label="Número"
          name="number"
          value={data.number}
          onChange={onChange}
          placeholder="Nº"
          required
          error={errors.number}
          className="checkout-number-input"
        />
        <FormInput
          label="Complemento"
          name="complement"
          value={data.complement}
          onChange={onChange}
          placeholder="Apto, Bloco..."
          className="checkout-complement-input"
        />
      </div>
      <div className="checkout-grid checkout-grid-2">
        <FormInput
          label="Bairro"
          name="neighborhood"
          value={data.neighborhood}
          onChange={onChange}
          placeholder="Bairro"
          required
          error={errors.neighborhood}
        />
        <FormInput
          label="Cidade"
          name="city"
          value={data.city}
          onChange={onChange}
          placeholder="Cidade"
          required
          error={errors.city}
        />
      </div>
      <div className="checkout-grid checkout-grid-2-uneven-uf">
        <FormInput
          label="UF"
          name="state"
          value={data.state}
          onChange={onChange}
          placeholder="UF"
          required
          error={errors.state}
          readOnly
        />
        <FormInput
          label="Estado"
          name="stateName"
          value={UF_PARA_ESTADO[data.state] || ''}
          onChange={() => {}}
          placeholder="Estado"
          readOnly
        />
      </div>
    </FormSection>
  );
};

export default AddressForm;
