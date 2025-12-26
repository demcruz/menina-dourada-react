import React from 'react';
import FormInput from './FormInput';
import FormSection from './FormSection';

const CustomerForm = ({ data, onChange, errors = {} }) => {
  return (
    <FormSection title="Seus Dados" description="Informações para contato e nota fiscal">
      <div className="checkout-grid checkout-grid-1">
        <FormInput
          label="E-mail"
          name="email"
          type="email"
          value={data.email}
          onChange={onChange}
          placeholder="seu@email.com"
          required
          error={errors.email}
        />
      </div>
      <div className="checkout-grid checkout-grid-2">
        <FormInput
          label="Nome"
          name="firstName"
          value={data.firstName}
          onChange={onChange}
          placeholder="Nome"
          required
          error={errors.firstName}
        />
        <FormInput
          label="Sobrenome"
          name="lastName"
          value={data.lastName}
          onChange={onChange}
          placeholder="Sobrenome"
          required
          error={errors.lastName}
        />
      </div>
      <div className="checkout-grid checkout-grid-2">
        <FormInput
          label="CPF"
          name="cpf"
          value={data.cpf}
          onChange={onChange}
          placeholder="000.000.000-00"
          required
          mask="cpf"
          error={errors.cpf}
        />
        <FormInput
          label="Celular"
          name="phone"
          value={data.phone}
          onChange={onChange}
          placeholder="(00) 00000-0000"
          required
          mask="phone"
          error={errors.phone}
        />
      </div>
    </FormSection>
  );
};

export default CustomerForm;
