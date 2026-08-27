import React from 'react';

interface PaymentMethod {
  id: string;
  name: string;
  icon?: string;
}

interface PaymentMethodSelectorProps {
  options: PaymentMethod[];
  selectedMethod: string;
  onSelect: (id: string) => void;
  ariaLabel: string;
}

export function PaymentMethodSelector({ options, selectedMethod, onSelect, ariaLabel }: PaymentMethodSelectorProps) {
  return (
    <div className="payment-method-selector" role="radiogroup" aria-label={ariaLabel}>
      {options.map((method) => (
        <button
          key={method.id}
          className={`payment-method-selector__option ${selectedMethod === method.id ? 'payment-method-selector__option--selected' : ''}`}
          role="radio"
          aria-checked={selectedMethod === method.id}
          onClick={() => onSelect(method.id)}
          type="button"
        >
          {method.icon && <span className="payment-method-selector__icon" aria-hidden="true">{method.icon}</span>}
          <span className="payment-method-selector__name">{method.name}</span>
        </button>
      ))}
    </div>
  );
}

