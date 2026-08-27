import React from 'react';

interface AmountDisplayProps {
  amount: string;
  currency: string;
  variant?: 'prominent' | 'subtle';
  ariaLabel: string;
}

export function AmountDisplay({ amount, currency, variant = 'prominent', ariaLabel }: AmountDisplayProps) {
  return (
    <div className={`amount-display amount-display--${variant}`} aria-label={ariaLabel}>
      <span className="amount-display__value">{amount}</span>
      <span className="amount-display__currency">{currency}</span>
    </div>
  );
}

