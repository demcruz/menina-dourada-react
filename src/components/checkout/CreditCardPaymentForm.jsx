import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';

const digitsOnly = (v = '') => (v ?? '').toString().replace(/\D/g, '');

const maskCardNumber = (value) => {
  return digitsOnly(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
};

const maskExpiry = (value) => {
  const d = digitsOnly(value).slice(0, 4);
  if (d.length >= 3) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
};

const maskCpf = (value) => {
  return digitsOnly(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const INITIAL = {
  cardName: '',
  cardNumber: '',
  expMonth: '',
  expYear: '',
  cvv: '',
  holderCpf: '',
};

const validateCard = (data) => {
  const errs = {};
  if (!data.cardName.trim()) errs.cardName = 'Nome no cartão obrigatório';
  const numDigits = digitsOnly(data.cardNumber);
  if (!numDigits) errs.cardNumber = 'Número do cartão obrigatório';
  else if (numDigits.length < 13) errs.cardNumber = 'Número do cartão inválido';
  if (!data.expMonth || !data.expYear) errs.expiry = 'Validade obrigatória';
  else if (digitsOnly(`${data.expMonth}${data.expYear}`).length < 4) errs.expiry = 'Validade inválida';
  const cvvDigits = digitsOnly(data.cvv);
  if (!cvvDigits) errs.cvv = 'CVV obrigatório';
  else if (cvvDigits.length < 3) errs.cvv = 'CVV inválido';
  const cpfDigits = digitsOnly(data.holderCpf);
  if (!cpfDigits) errs.holderCpf = 'CPF do titular obrigatório';
  else if (cpfDigits.length !== 11) errs.holderCpf = 'CPF inválido';
  return errs;
};

const CreditCardPaymentForm = forwardRef(({ loading }, ref) => {
  const [cardData, setCardData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [expiryDisplay, setExpiryDisplay] = useState('');

  const handleChange = useCallback((field, value) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }, [errors]);

  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleExpiryChange = useCallback((raw) => {
    const masked = maskExpiry(raw);
    const digits = digitsOnly(raw).slice(0, 4);
    setCardData((prev) => ({
      ...prev,
      expMonth: digits.slice(0, 2),
      expYear: digits.slice(2, 4),
    }));
    if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: '' }));
    return masked;
  }, [errors.expiry]);

  // Expose validate + getData to parent via ref
  useImperativeHandle(ref, () => ({
    validate: () => {
      const allTouched = {};
      Object.keys(INITIAL).forEach((k) => { allTouched[k] = true; });
      allTouched.expiry = true;
      setTouched(allTouched);
      const validationErrors = validateCard(cardData);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    },
    getData: () => cardData,
    setFieldError: (field, message) => {
      setErrors((prev) => ({ ...prev, [field]: message }));
      setTouched((prev) => ({ ...prev, [field]: true }));
    },
  }), [cardData]);

  const showErr = (field) => touched[field] && errors[field];

  return (
    <div className="cc-form">
      <div className="cc-form-header">
        <span className="cc-form-icon">💳</span>
        <div>
          <h3 className="cc-form-title">Dados do Cartão</h3>
          <p className="cc-form-subtitle">Visa, Mastercard, Elo</p>
        </div>
      </div>

      <div className="cc-form-fields">
        <div className="checkout-form-field">
          <label className="checkout-label" htmlFor="cc-cardName">
            Nome impresso no cartão <span className="checkout-required">*</span>
          </label>
          <input
            id="cc-cardName"
            className={`checkout-input${showErr('cardName') ? ' checkout-input-error' : ''}`}
            value={cardData.cardName}
            onChange={(e) => handleChange('cardName', e.target.value.toUpperCase())}
            onBlur={() => handleBlur('cardName')}
            placeholder="NOME COMO NO CARTÃO"
            autoComplete="cc-name"
            disabled={loading}
          />
          {showErr('cardName') && <span className="checkout-error-text">{errors.cardName}</span>}
        </div>

        <div className="checkout-form-field">
          <label className="checkout-label" htmlFor="cc-cardNumber">
            Número do cartão <span className="checkout-required">*</span>
          </label>
          <input
            id="cc-cardNumber"
            className={`checkout-input${showErr('cardNumber') ? ' checkout-input-error' : ''}`}
            value={maskCardNumber(cardData.cardNumber)}
            onChange={(e) => handleChange('cardNumber', digitsOnly(e.target.value))}
            onBlur={() => handleBlur('cardNumber')}
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            maxLength={19}
            autoComplete="cc-number"
            disabled={loading}
          />
          {showErr('cardNumber') && <span className="checkout-error-text">{errors.cardNumber}</span>}
        </div>

        <div className="cc-form-row">
          <div className="checkout-form-field cc-form-field-expiry">
            <label className="checkout-label" htmlFor="cc-expiry">
              Validade <span className="checkout-required">*</span>
            </label>
            <input
              id="cc-expiry"
              className={`checkout-input${showErr('expiry') ? ' checkout-input-error' : ''}`}
              value={expiryDisplay}
              onChange={(e) => {
                const masked = handleExpiryChange(e.target.value);
                setExpiryDisplay(masked);
              }}
              onBlur={() => handleBlur('expiry')}
              placeholder="MM/AA"
              inputMode="numeric"
              maxLength={5}
              autoComplete="cc-exp"
              disabled={loading}
            />
            {showErr('expiry') && <span className="checkout-error-text">{errors.expiry}</span>}
          </div>

          <div className="checkout-form-field cc-form-field-cvv">
            <label className="checkout-label" htmlFor="cc-cvv">
              CVV <span className="checkout-required">*</span>
            </label>
            <input
              id="cc-cvv"
              className={`checkout-input${showErr('cvv') ? ' checkout-input-error' : ''}`}
              value={cardData.cvv}
              onChange={(e) => handleChange('cvv', digitsOnly(e.target.value).slice(0, 4))}
              onBlur={() => handleBlur('cvv')}
              placeholder="000"
              inputMode="numeric"
              maxLength={4}
              autoComplete="cc-csc"
              disabled={loading}
            />
            {showErr('cvv') && <span className="checkout-error-text">{errors.cvv}</span>}
          </div>
        </div>

        <div className="checkout-form-field">
          <label className="checkout-label" htmlFor="cc-holderCpf">
            CPF do titular <span className="checkout-required">*</span>
          </label>
          <input
            id="cc-holderCpf"
            className={`checkout-input${showErr('holderCpf') ? ' checkout-input-error' : ''}`}
            value={maskCpf(cardData.holderCpf)}
            onChange={(e) => handleChange('holderCpf', digitsOnly(e.target.value))}
            onBlur={() => handleBlur('holderCpf')}
            placeholder="000.000.000-00"
            inputMode="numeric"
            maxLength={14}
            disabled={loading}
          />
          {showErr('holderCpf') && <span className="checkout-error-text">{errors.holderCpf}</span>}
        </div>
      </div>

      <div className="cc-form-footer">
        <div className="cc-form-trust">
          <span>🔒</span>
          <span>Seus dados estão protegidos</span>
        </div>
      </div>
    </div>
  );
});

CreditCardPaymentForm.displayName = 'CreditCardPaymentForm';

export default CreditCardPaymentForm;
