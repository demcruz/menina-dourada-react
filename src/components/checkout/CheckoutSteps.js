import React from 'react';

const STEPS = [
  { id: 'filling', label: 'Dados', icon: '1' },
  { id: 'payment', label: 'Pagamento', icon: '2' },
  { id: 'confirmed', label: 'Confirmado', icon: '3' },
];

const CheckoutSteps = ({ currentStep }) => {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="checkout-steps">
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        
        return (
          <React.Fragment key={step.id}>
            <div className={`checkout-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="checkout-step-icon">
                {isCompleted ? '✓' : step.icon}
              </div>
              <span className="checkout-step-label">{step.label}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`checkout-step-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
