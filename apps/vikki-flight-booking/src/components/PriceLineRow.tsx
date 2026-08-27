import React from 'react';

interface PriceLineRowProps {
  label: string;
  amount: string;
  variant?: 'default' | 'total';
  ariaLabel: string;
}

export function PriceLineRow({ label, amount, variant = 'default', ariaLabel }: PriceLineRowProps) {
  return (
    <div className={`price-line-row ${variant === 'total' ? 'price-line-row--total' : ''}`} aria-label={ariaLabel}>
      <span className="price-line-row__label">{label}</span>
      <span className="price-line-row__amount">{amount}</span>
    </div>
  );
}

