import React from 'react';

interface FlightSummaryCardProps {
  leg: 'outbound' | 'return';
  airline: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  duration: string;
  flightNumber: string;
  visible?: boolean;
  ariaLabel: string;
}

export function FlightSummaryCard({
  leg,
  airline,
  departureTime,
  arrivalTime,
  date,
  duration,
  flightNumber,
  visible = true,
  ariaLabel,
}: FlightSummaryCardProps) {
  if (!visible) return null;
  return (
    <div className={`flight-summary-card flight-summary-card--${leg}`} aria-label={ariaLabel}>
      <div className="flight-summary-card__header">
        <span className="flight-summary-card__airline">{airline}</span>
        <span className="flight-summary-card__flight-number">{flightNumber}</span>
      </div>
      <div className="flight-summary-card__times">
        <span className="flight-summary-card__departure">{departureTime}</span>
        <span className="flight-summary-card__separator" aria-hidden="true">→</span>
        <span className="flight-summary-card__arrival">{arrivalTime}</span>
      </div>
      <div className="flight-summary-card__meta">
        <span className="flight-summary-card__date">{date}</span>
        <span className="flight-summary-card__duration">{duration}</span>
      </div>
    </div>
  );
}

