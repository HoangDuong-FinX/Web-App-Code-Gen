import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { t } from '../i18n';
import { fixtureSearch } from '../fixtures';
import { Airport, CityPair, FlightOffer } from '../types';

interface ResultsProps {
  airports: Airport[];
  cityPairs: CityPair[];
  masterDataError: string | null;
  masterDataLoading: boolean;
  isReturn?: boolean;
}

const Results: React.FC<ResultsProps> = ({
  airports,
  cityPairs,
  masterDataError,
  masterDataLoading,
  isReturn = false,
}) => {
  const { navigateTo, updateBooking, booking } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<FlightOffer[]>([]);

  const session = isReturn ? booking.returnSession : booking.outboundSession;
  const expiresAt = session?.expires_at ? new Date(session.expires_at).getTime() : 0;
  const now = Date.now();
  const isExpired = expiresAt < now;
  const timeLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));

  useEffect(() => {
    if (session?.offers) {
      setOffers(session.offers);
    }
  }, [session]);

  const handleSelectOffer = (offer: FlightOffer) => {
    if (isReturn) {
      updateBooking({ selectedReturnOffer: offer });
      navigateTo('passengers');
    } else {
      updateBooking({ selectedOutboundOffer: offer });
      if (booking.searchCriteria?.trip_type === 'round-trip') {
        // Need to fetch return flights
        navigateTo('results-return');
      } else {
        navigateTo('passengers');
      }
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        {isReturn ? t('results.titleReturn') : t('results.title')}
      </h1>

      {isExpired && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded" role="alert">
          {t('results.expired')}
          <button
            onClick={() => navigateTo('search')}
            className="ml-2 px-3 py-1 bg-yellow-600 text-white rounded text-sm"
          >
            {t('results.searchAgain')}
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}

      <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        Price hold expires in: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
      </div>

      <div className="space-y-3">
        {offers.map((offer) => (
          <div key={offer.offer_id} className="border rounded-lg p-4 bg-gray-50">
            {offer.flights.map((flight, idx) => (
              <div key={idx} className="mb-2">
                <div className="font-semibold">{flight.flight_number}</div>
                <div className="text-sm text-gray-600">
                  {flight.departure_time} — {flight.arrival_time} · {flight.aircraft_type}
                </div>
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              {offer.fare_classes.map((fare) => (
                <div key={fare.cabin_class} className="flex justify-between items-center mb-2 p-2 bg-blue-50 rounded">
                  <div>
                    <div className="font-medium">{fare.cabin_class}</div>
                    <div className="text-sm text-gray-600">{fare.price_amount.toLocaleString()} VND</div>
                  </div>
                  <button
                    onClick={() => handleSelectOffer(offer)}
                    disabled={isExpired}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                    aria-label={t('results.selectFare')}
                  >
                    {t('results.selectFare')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
