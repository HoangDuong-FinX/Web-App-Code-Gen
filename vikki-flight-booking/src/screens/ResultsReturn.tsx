import React from 'react';
import { useStore } from '../store';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';

function ResultsReturn() {
  const store = useStore();
  const session = store.returnSession;

  if (!session) {
    return <div>{t('results.title-return')}</div>;
  }

  const handleSelectFare = (offer: any) => {
    store.setReturnOffer(offer);
    store.setCurrentScreen('passengers');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Text variant="title-1" semantic="h1">
        {t('results.title-return')}
      </Text>
      <div className="mt-4 space-y-4">
        {session.offers.map((offer) => (
          <div
            key={offer.offer_id}
            className="p-3 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <Text variant="body-semibold">{offer.flight_number}</Text>
              <Text variant="body">
                {offer.departure_time} — {offer.arrival_time}
              </Text>
            </div>
            <Text variant="footnote">{offer.aircraft_type}</Text>
            <div className="mt-2 p-2 bg-blue-50 rounded">
              <Text variant="body-semibold">Eco</Text>
              <Text variant="body">{offer.price_amount.toLocaleString('vi-VN')} VND</Text>
              <Button
                variant="primary"
                onClick={() => handleSelectFare(offer)}
                testId="select-fare-button"
                className="mt-2 w-full"
              >
                {t('results.select-fare')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsReturn;
