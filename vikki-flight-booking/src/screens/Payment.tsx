import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { t } from '../i18n';

interface PaymentProps {
  airports: any[];
  cityPairs: any[];
  masterDataError: string | null;
  masterDataLoading: boolean;
}

const Payment: React.FC<PaymentProps> = () => {
  const { navigateTo, booking } = useStore();
  const [totalPrice] = useState(6000000);

  const handleContinue = () => {
    navigateTo('checkout');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('payment.title')}</h1>

      <div className="space-y-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Journey Summary</h2>
          <div className="text-sm text-gray-600">
            {booking.searchCriteria?.origin} → {booking.searchCriteria?.destination}
          </div>
          <div className="text-sm text-gray-600">
            {booking.searchCriteria?.trip_type === 'round-trip' ? 'Round-trip' : 'One-way'}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Outbound Flight</h2>
          {booking.selectedOutboundOffer?.flights.map((flight, idx) => (
            <div key={idx} className="text-sm text-gray-600">
              {flight.flight_number}: {flight.departure_time} — {flight.arrival_time}
            </div>
          ))}
        </div>

        {booking.searchCriteria?.trip_type === 'round-trip' && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold mb-2">Return Flight</h2>
            {booking.selectedReturnOffer?.flights.map((flight, idx) => (
              <div key={idx} className="text-sm text-gray-600">
                {flight.flight_number}: {flight.departure_time} — {flight.arrival_time}
              </div>
            ))}
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-lg border-t-2 border-blue-500">
          <div className="flex justify-between items-center">
            <div className="font-semibold">Total</div>
            <div className="text-lg font-bold">{totalPrice.toLocaleString()} VND</div>
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full p-3 bg-blue-600 text-white rounded font-medium"
        aria-label={t('payment.continue')}
      >
        {t('payment.continue')}
      </button>
    </div>
  );
};

export default Payment;
