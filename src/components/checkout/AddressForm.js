import React, { useState } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormSection from './FormSection';

const ESTADOS_BR = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

const AddressForm = ({ data, onChange, onCepSearch, errors = {} }) => {
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepSearch = async () => {
    const cep = data.zipCode.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const result = await response.json();
      if (!result.erro) {
        onCepSearch({
          address: result.logradouro || '',
          neighborhood: result.bairro || '',
          city: result.localidade || '',
          state: result.uf || '',
        });
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    } finally {
      setLoadingCep(false);
    }
  };

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
      <div className="checkout-grid checkout-grid-1" style={{ maxWidth: '200px' }}>
        <FormSelect
          label="Estado"
          name="state"
          value={data.state}
          onChange={onChange}
          options={ESTADOS_BR}
          placeholder="UF"
          required
          error={errors.state}
        />
      </div>
    </FormSection>
  );
};

export default AddressForm;
