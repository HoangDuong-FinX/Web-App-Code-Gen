import React from 'react';
import { useStore } from '../store';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import Divider from '../components/Divider';
import PriceHoldCountdown from '../components/PriceHoldCountdown';

function Payment() {
  const store = useStore();
  const outbound = store.outboundOffer;

  const handleContinue = () => {
    store.setCurrentScreen('checkout');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Text variant="title-1" semantic="h1">
        {t('payment.title')}
      </Text>
      <PriceHoldCountdown expiresAt={store.outboundSession?.expires_at} testId="price-hold-countdown" />
      <div className="mt-4 space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <Text variant="headline">{store.searchCriteria?.origin}</Text>
            <Text variant="body">→</Text>
            <Text variant="headline">{store.searchCriteria?.destination}</Text>
          </div>
          <Text variant="body">
            Khứ hồi · {store.searchCriteria?.adult_count} Người lớn, {store.searchCriteria?.child_count} Trẻ em
          </Text>
        </div>

        {outbound && (
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <Text variant="body-semibold">Chuyến đi</Text>
            <Text variant="body">
              {store.searchCriteria?.origin} → {store.searchCriteria?.destination}
            </Text>
            <Text variant="body">
              {outbound.departure_time} — {outbound.arrival_time}
            </Text>
            <Text variant="body">{outbound.duration_minutes / 60}h {outbound.duration_minutes % 60}m</Text>
            <Text variant="footnote">{outbound.flight_number} · {outbound.aircraft_type}</Text>
            <Divider />
            <div className="flex justify-between">
              <Text variant="body">Giá vé</Text>
              <Text variant="body-semibold">{(outbound.price_amount * (store.searchCriteria?.adult_count || 1)).toLocaleString('vi-VN')} VND</Text>
            </div>
          </div>
        )}

        <div className="p-3 bg-blue-50 rounded-lg flex justify-between">
          <Text variant="body-semibold">Tổng cộng</Text>
          <Text variant="headline">10.500.000 VND</Text>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={handleContinue}
        testId="continue-button"
        className="w-full mt-4"
      >
        {t('payment.button')}
      </Button>
    </div>
  );
}

export default Payment;
