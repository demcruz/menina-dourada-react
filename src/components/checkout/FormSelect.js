import React, { useState } from 'react';

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Selecione',
  required,
  error,
  disabled,
  className = '',
}) => {
  const [touched, setTouched] = useState(false);

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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        className={`checkout-select ${showError ? 'checkout-input-error' : ''}`}
        aria-invalid={showError}
        aria-describedby={showError ? `${name}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {showError && (
        <span id={`${name}-error`} className="checkout-error-text">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormSelect;
