import React from 'react';

interface ServiceSummaryRowProps {
  name: string;
  price: string;
  ariaLabel: string;
}

export function ServiceSummaryRow({ name, price, ariaLabel }: ServiceSummaryRowProps) {
  return (
    <div className="service-summary-row" aria-label={ariaLabel}>
      <span className="service-summary-row__name">{name}</span>
      <span className="service-summary-row__price">{price}</span>
    </div>
  );
}

