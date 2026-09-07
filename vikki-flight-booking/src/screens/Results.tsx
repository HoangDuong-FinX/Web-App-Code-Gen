import React, { useState, useEffect } from 'react';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { StatusNote } from '../components/StatusNote';
import { Layout } from '../components/Layout';
import { useStore } from '../store/store';
import { searchResults } from '../fixtures/searchResults';

interface ResultsProps {
  navigate: (screen: string) => void;
  t: Record<string, string>;
}

export const Results: React.FC<ResultsProps> = ({ navigate, t }) => {
  const store = useStore();
  const [countdownText, setCountdownText] = useState('');
  const [selectedLeg, setSelectedLeg] = useState<'outbound' | 'return'>('outbound');
  const [isRoundTripReturnReady, setIsRoundTripReturnReady] = useState(false);

  // 15-minute countdown timer
  useEffect(() => {
    if (!store.outboundExpiresAt) return;

    const interval = setInterval(() => {
      const expiresAt = new Date(store.outboundExpiresAt!).getTime();
      const now = Date.now();
      const diff = expiresAt - now;

      if (diff <= 0) {
        store.setHoldExpired(true);
        setCountdownText(t['results.expired']);
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdownText(`${t['results.holdExpiring'].replace('{{minutes}}', minutes.toString()).replace('{{seconds}}', seconds.toString())}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [store.outboundExpiresAt, t]);

  const handleSelectFlight = (offerId: string) => {
    if (store.tripType === 'roundTrip' && selectedLeg === 'outbound') {
      store.setOutboundOffer(offerId);
      // Simulate fetching return flights
      const returnExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      store.setReturnSession('session_return_001', returnExpiresAt);
      setSelectedLeg('return');
      setIsRoundTripReturnReady(true);
    } else if (store.tripType === 'roundTrip' && selectedLeg === 'return') {
      store.setReturnOffer(offerId);
      navigate('passengers');
    } else {
      store.setOutboundOffer(offerId);
      navigate('passengers');
    }
  };

  const heading = selectedLeg === 'return' ? t['results.headingReturn'] : t['results.title'];
  const stepText = store.tripType === 'roundTrip' ? (selectedLeg === 'return' ? '1b. Chọn chuyến' : '1a. Chọn chuyến') : '1. Chọn chuyến';

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Layout layoutType="stack" gap={16}>
        <Text variant="title-2" testId="results-step-header">
          {heading}
        </Text>

        <StatusNote
          tone="warning"
          visible={store.holdExpired}
          ariaLabel="Thông báo: phiên giữ giá đã hết"
          testId="hold-expired-alert"
        >
          {t['results.expired']}
        </StatusNote>

        <Text variant="callout" testId="hold-expiry-timer">
          {countdownText}
        </Text>

        <Layout layoutType="stack" direction="row" gap={6}>
          {/* 7-day strip would go here */}
          <Text variant="body">7-day strip would display here</Text>
        </Layout>

        {searchResults.map((flight) => (
          <Layout key={flight.offer_id} layoutType="stack" gap={10}>
            <Text variant="body-semibold" testId="flight-header">
              {flight.flight_number} {flight.departure_time} → {flight.arrival_time}
            </Text>
            <Layout layoutType="stack" gap={6}>
              {flight.fare_classes.map((fareClass) => (
                <Button
                  key={fareClass.class_code}
                  variant="fareClassButton"
                  size="medium"
                  onClick={() => handleSelectFlight(flight.offer_id)}
                  disabled={!fareClass.available || store.holdExpired}
                  selected={store.outboundOfferId === flight.offer_id}
                  testId="fare-class-option"
                >
                  {fareClass.class_name} - {fareClass.available ? `${fareClass.price_amount.toLocaleString()} VND` : t['results.fareUnavailable']}
                </Button>
              ))}
            </Layout>
          </Layout>
        ))}

        <Button
          variant="primary"
          size="large"
          onClick={() => {
            if (store.tripType === 'roundTrip' && selectedLeg === 'outbound') {
              handleSelectFlight('');
            } else {
              navigate('passengers');
            }
          }}
          disabled={!store.outboundOfferId || store.holdExpired}
          testId="results-continue-button"
        >
          {t['results.continue']}
        </Button>
      </Layout>
    </div>
  );
};
