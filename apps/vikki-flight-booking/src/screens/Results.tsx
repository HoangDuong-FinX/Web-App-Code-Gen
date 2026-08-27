import React, { useState, useCallback } from 'react';
import type { BookingState, Screen } from '../types';
import { vi } from '../i18n/vi';

interface ResultsProps {
  bookingState: BookingState;
  onNavigate: (screen: Screen, state?: Partial<BookingState>) => void;
}

export const Results: React.FC<ResultsProps> = ({ bookingState, onNavigate }) => {
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectFlight = useCallback(
    async (flightId: string) => {
      setLoading(true);
      try {
        const selectedFlight = bookingState.offers.find((o) => o.id === flightId);
        if (!selectedFlight) return;

        const newState: Partial<BookingState> = {
          selectedOutboundFlight: selectedFlight,
        };

        // For round-trip, fetch return flights
        if (bookingState.tripType === 'round') {
          await new Promise((resolve) => setTimeout(resolve, 500));
          // Mock return offers (same as outbound for demo)
          newState.returnOffers = bookingState.offers;
          newState.returnSessionId = 'mock_return_session_' + Date.now();
          onNavigate('results-return', newState);
        } else {
          // One-way: proceed to passengers
          onNavigate('passengers', newState);
        }
      } catch (err) {
        console.error('Error selecting flight:', err);
      } finally {
        setLoading(false);
      }
    },
    [bookingState, onNavigate]
  );

  const handleBack = useCallback(() => {
    onNavigate('search');
  }, [onNavigate]);

  return (
    <div className="screen results-screen">
      <div className="top-bar">
        <button className="back-btn" onClick={handleBack} aria-label={vi.backButton}>
          ←
        </button>
        <h1>{vi.resultsTitle}</h1>
      </div>

      <div className="trip-summary">
        <div className="summary-item">
          <strong>{bookingState.origin}</strong> → <strong>{bookingState.destination}</strong>
        </div>
        <div className="summary-item">{bookingState.departureDate}</div>
      </div>

      <div className="content-area">
        {bookingState.offers.length === 0 ? (
          <div className="empty-state" role="status" aria-label={vi.noResultsMessage}>
            {vi.noResultsMessage}
          </div>
        ) : (
          <div className="flight-list">
            {bookingState.offers.map((flight) => (
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