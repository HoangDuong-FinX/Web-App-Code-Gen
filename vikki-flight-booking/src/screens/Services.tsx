import React from 'react';
import { useStore } from '../store';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import ServiceTile from '../components/ServiceTile';
import AlertNote from '../components/AlertNote';
import PriceHoldCountdown from '../components/PriceHoldCountdown';

function Services() {
  const store = useStore();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      store.setCurrentScreen('payment');
    } catch (err) {
      setError('submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Text variant="title-1" semantic="h1">
        {t('services.title')}
      </Text>
      <PriceHoldCountdown expiresAt={store.outboundSession?.expires_at} testId="price-hold-countdown" />
      <div className="mt-4 space-y-4">
        <Text variant="headline" semantic="h2">
          Dịch vụ chuyến bay
        </Text>
        <div className="grid grid-cols-3 gap-3">
          <ServiceTile label={t('services.seat')} icon="airplane-seat" enabled testId="service-tile-seat" />
          <ServiceTile label={t('services.meals')} icon="utensils" enabled testId="service-tile-meals" />
          <ServiceTile label={t('services.baggage')} icon="luggage" enabled testId="service-tile-baggage" />
          <ServiceTile label="Bảo hiểm du lịch" icon="shield" enabled={false} badge="Sắp ra mắt" testId="service-tile-insurance" />
          <ServiceTile label="Hàng miễn thuế" icon="shopping-bag" enabled={false} badge="Sắp ra mắt" testId="service-tile-duty-free" />
          <ServiceTile label="Quà lưu niệm" icon="gift" enabled={false} badge="Sắp ra mắt" testId="service-tile-souvenirs" />
          <ServiceTile label="Khách sạn" icon="building" enabled={false} badge="Sắp ra mắt" testId="service-tile-hotel" />
          <ServiceTile label="Hoạt động" icon="activity" enabled={false} badge="Sắp ra mắt" testId="service-tile-activities" />
          <ServiceTile label="Di chuyển" icon="car" enabled={false} badge="Sắp ra mắt" testId="service-tile-transfers" />
        </div>
      </div>
      <AlertNote visible={error === 'submit'} testId="services-submit-error">
        {t('services.error')}
      </AlertNote>
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={loading}
        testId="submit-button"
        className="w-full mt-4"
      >
        {t('services.button')}
      </Button>
    </div>
  );
}

export default Services;
