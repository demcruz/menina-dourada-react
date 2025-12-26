import React, { useState } from 'react';

const masks = {
  cpf: (value) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  },
  phone: (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  },
  cep: (value) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, '$1-$2');
  },
};

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  mask,
  error,
  disabled,
  className = '',
}) => {
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    let newValue = e.target.value;
    if (mask && masks[mask]) {
      newValue = masks[mask](newValue);
    }
    onChange({ target: { name, value: newValue } });
  };

  const handleBlur = () => setTouched(true);

  const showError = touched && error;

  return (
    <div className={`checkout-form-field ${className}`}>
      {label && (
        <label className="checkout-label" htmlFor={name}>
          {label}
          {required && <span className="checkout-required">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`checkout-input ${showError ? 'checkout-input-error' : ''}`}
        aria-invalid={showError}
        aria-describedby={showError ? `${name}-error` : undefined}
      />
      {showError && (
        <span id={`${name}-error`} className="checkout-error-text">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
