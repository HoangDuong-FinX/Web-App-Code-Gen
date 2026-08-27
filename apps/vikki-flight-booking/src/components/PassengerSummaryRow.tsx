import React from 'react';

interface PassengerSummaryRowProps {
  name: string;
  type: string;
  ariaLabel: string;
}

export function PassengerSummaryRow({ name, type, ariaLabel }: PassengerSummaryRowProps) {
  return (
    <div className="passenger-summary-row" aria-label={ariaLabel}>
      <span className="passenger-summary-row__name">{name}</span>
      <span className="passenger-summary-row__type">{type}</span>
    </div>
  );
}

