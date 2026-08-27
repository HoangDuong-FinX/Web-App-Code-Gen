import React, { useState, useCallback } from 'react';
import type { BookingState, Screen } from '../types';
import { vi } from '../i18n/vi';
import { mockFlightOffers } from '../fixtures/flightOffers';

interface SearchProps {
  bookingState: BookingState;
  onNavigate: (screen: Screen, state?: Partial<BookingState>) => void;
}

export const Search: React.FC<SearchProps> = ({ bookingState, onNavigate }) => {
  const [tripType, setTripType] = useState<'oneway' | 'round'>(bookingState.tripType as 'oneway' | 'round');
  const [origin, setOrigin] = useState<string | null>(bookingState.origin);
  const [destination, setDestination] = useState<string | null>(bookingState.destination);
  const [departureDate, setDepartureDate] = useState<string | null>(bookingState.departureDate);
  const [returnDate, setReturnDate] = useState<string | null>(bookingState.returnDate);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateSearch = useCallback((): boolean => {
    if (!origin || !destination) {
      setError(vi.searchValidationOriginDestination);
      return false;
    }
    if (!departureDate) {
      setError(vi.searchValidationDepartureDate);
      return false;
    }
    if (tripType === 'round' && !returnDate) {
      setError(vi.searchValidationReturnDate);
      return false;
    }
    return true;
  }, [origin, destination, departureDate, returnDate, tripType]);

  const handleSearch = useCallback(async () => {
    setError(null);
    if (!validateSearch()) return;

    setLoading(true);
    try {
      // Simulate API call to POST /search
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock success response
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      const newState: Partial<BookingState> = {
        tripType: tripType as 'oneway' | 'round',
        origin,
        destination,
        departureDate,
        returnDate: tripType === 'round' ? returnDate : null,
        sessionId: 'mock_session_' + Date.now(),
        expiresAt,
        offers: mockFlightOffers,
      };
      
      onNavigate('results', newState);
    } catch (err) {
      setError(vi.searchErrorGeneric);
    } finally {
      setLoading(false);
    }
  }, [validateSearch, tripType, origin, destination, departureDate, returnDate, onNavigate]);

  return (
    <div className="screen search-screen">
      <div className="top-bar">
        <h1>{vi.searchTitle}</h1>
      </div>
      
      <div className="content-area">
        <div className="form-group">
          <label>{vi.tripTypeLabel}</label>
          <div className="trip-type-toggle">
            <button
              className={`toggle-btn ${tripType === 'oneway' ? 'active' : ''}`}
              onClick={() => setTripType('oneway')}
              aria-label={vi.tripTypeOneWay}
            >
              {vi.tripTypeOneWay}
            </button>
            <button
              className={`toggle-btn ${tripType === 'round' ? 'active' : ''}`}
              onClick={() => setTripType('round')}
              aria-label={vi.tripTypeRound}
            >
              {vi.tripTypeRound}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="origin">{vi.originLabel}</label>
          <input
            id="origin"
            type="text"
            placeholder={vi.originPlaceholder}
            value={origin || ''}
            onChange={(e) => setOrigin(e.target.value)}
            readOnly={false}
            aria-label={vi.originLabel}
          />
        </div>

        <div className="form-group">
          <label htmlFor="destination">{vi.destinationLabel}</label>
          <input
            id="destination"
            type="text"
            placeholder={vi.destinationPlaceholder}
            value={destination || ''}
            onChange={(e) => setDestination(e.target.value)}
            readOnly={false}
            aria-label={vi.destinationLabel}
          />
        </div>

        <div className="form-group">
          <label htmlFor="departure-date">{vi.departureDateLabel}</label>
          <input
            id="departure-date"
            type="date"
            value={departureDate || ''}
            onChange={(e) => setDepartureDate(e.target.value)}
            aria-label={vi.departureDateLabel}
          />
        </div>

        {tripType === 'round' && (
          <div className="form-group">
            <label htmlFor="return-date">{vi.returnDateLabel}</label>
            <input
              id="return-date"
              type="date"
              value={returnDate || ''}
              onChange={(e) => setReturnDate(e.target.value)}
              aria-label={vi.returnDateLabel}
            />
          </div>
        )}

        {error && (
          <div className="inline-error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading}
          aria-label={vi.searchButtonLabel}
        >
          {loading ? vi.searchLoading : vi.searchButton}
        </button>
      </div>
    </div>
  );
};