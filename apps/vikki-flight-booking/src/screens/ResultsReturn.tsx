import React, { useState, useCallback } from 'react';
import type { BookingState, Screen } from '../types';
import { vi } from '../i18n/vi';

interface ResultsReturnProps {
  bookingState: BookingState;
  onNavigate: (screen: Screen, state?: Partial<BookingState>) => void;
}

export const ResultsReturn: React.FC<ResultsReturnProps> = ({ bookingState, onNavigate }) => {
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectFlight = useCallback(
    async (flightId: string) => {
      setLoading(true);
      try {
        const selectedFlight = bookingState.returnOffers.find((o) => o.id === flightId);
        if (!selectedFlight) return;

        const newState: Partial<BookingState> = {
          selectedReturnFlight: selectedFlight,
        };

        // Proceed to passengers
        onNavigate('passengers', newState);
      } catch (err) {
        console.error('Error selecting return flight:', err);
      } finally {
        setLoading(false);
      }
    },
    [bookingState, onNavigate]
  );

  const handleBack = useCallback(() => {
    onNavigate('results');
  }, [onNavigate]);

  return (
    <div className="screen results-return-screen">
      <div className="top-bar">
        <button className="back-btn" onClick={handleBack} aria-label={vi.backButton}>
          ←
        </button>
        <h1>{vi.resultsReturnTitle}</h1>
      </div>

      <div className="trip-summary">
        <div className="summary-item">
          <strong>{bookingState.destination}</strong> → <strong>{bookingState.origin}</strong>
        </div>
        <div className="summary-item">{bookingState.returnDate}</div>
      </div>

      <div className="content-area">
        {bookingState.returnOffers.length === 0 ? (
          <div className="empty-state" role="status" aria-label={vi.noReturnResultsMessage}>
            {vi.noReturnResultsMessage}
          </div>
        ) : (
          <div className="flight-list">
            {bookingState.returnOffers.map((flight) => (
              <div key={flight.id} className="flight-card">
                <div className="flight-info">
                  <div className="airline">{flight.airline}</div>
                  <div className="times">
                    <span className="departure">{flight.departureTime}</span>
                    <span className="duration">{flight.duration}</span>
                    <span className="arrival">{flight.arrivalTime}</span>
                  </div>
                  <div className="stops">{flight.stops} {vi.stops}</div>
                </div>
                <div className="flight-price">
                  <div className="price">{flight.price.toLocaleString('vi-VN')} đ</div>
                  <button
                    className="select-btn"
                    onClick={() => handleSelectFlight(flight.id)}
                    disabled={loading}
                    aria-label={`${vi.selectButton} ${flight.airline} ${flight.departureTime}`}
                  >
                    {vi.selectButton}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};