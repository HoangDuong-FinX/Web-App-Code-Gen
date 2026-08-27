import React from 'react';

interface TripSummaryBannerProps {
  origin: string;
  destination: string;
  date: string;
  passengers: string;
  ariaLabel?: string;
}

export function TripSummaryBanner({ origin, destination, date, passengers, ariaLabel }: TripSummaryBannerProps) {
  return (
    <div className="trip-summary-banner" aria-label={ariaLabel}>
      <div className="trip-summary-banner__route">
        <span className="trip-summary-banner__city">{origin}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="trip-summary-banner__city">{destination}</span>
      </div>
      <div className="trip-summary-banner__details">
        <span>{date}</span>
        <span className="trip-summary-banner__dot">•</span>
        <span>{passengers}</span>
      </div>
    </div>
  );
}

