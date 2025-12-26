import React from 'react';

const FormSection = ({ title, description, children, className = '' }) => {
  return (
    <div className={`checkout-form-section ${className}`}>
      {title && <h3 className="checkout-form-section-title">{title}</h3>}
      {description && <p className="checkout-form-section-desc">{description}</p>}
      <div className="checkout-form-section-content">{children}</div>
    </div>
  );
};

export default FormSection;
