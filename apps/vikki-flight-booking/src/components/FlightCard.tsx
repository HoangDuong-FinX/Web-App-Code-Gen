import React from 'react';
import { useI18n } from '../i18n';

interface FlightCardProps {
  departureTime: string;
  arrivalTime: string;
  airline: string;
  airlineLogo: string;
  duration: string;
  stops: number;
  price: number;
  onSelect: () => void;
  ariaLabel?: string;
}

export function FlightCard({
  departureTime,
  arrivalTime,
  airline,
  duration,
  stops,
  price,
  onSelect,
  ariaLabel,
}: FlightCardProps) {
  const { t } = useI18n();
  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="flight-card" aria-label={ariaLabel}>
      <div className="flight-card__header">
        <span className="flight-card__airline">{airline}</span>
      </div>
      <div className="flight-card__body">
        <div className="flight-card__times">
          <span className="flight-card__time">{departureTime}</span>
          <div className="flight-card__route-line">
            <span className="flight-card__duration">{duration}</span>
            <div className="flight-card__line" />
            <span className="flight-card__stops">{stops === 0 ? 'Bay th\u1EB3ng' : `${stops} \u0111i\u1EC3m d\u1EEBng`}</span>
          </div>
          <span className="flight-card__time">{arrivalTime}</span>
        </div>
      </div>
      <div className="flight-card__footer">
        <span className="flight-card__price">{formattedPrice}</span>
        <button
          className="flight-card__select-btn"
          onClick={onSelect}
          aria-label={`${t('results.selectFlight')} ${airline} ${departureTime}`}
          type="button"
        >
          {t('results.selectFlight')}
        </button>
      </div>
    </div>
  );
}

