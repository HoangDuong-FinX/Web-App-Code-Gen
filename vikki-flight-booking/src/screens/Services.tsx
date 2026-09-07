import React, { useState } from 'react';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { StatusNote } from '../components/StatusNote';
import { Layout } from '../components/Layout';
import { useStore } from '../store/store';

interface ServicesProps {
  navigate: (screen: string) => void;
  t: Record<string, string>;
}

const ServiceTile: React.FC<{
  icon: string;
  label: string;
  status?: string;
  disabled?: boolean;
  onClick?: () => void;
  testId?: string;
}> = ({ icon, label, status, disabled = false, onClick, testId }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-3 rounded border text-center transition-colors ${
      disabled
        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
        : 'border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100'
    }`}
    data-testid={testId}
  >
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-sm font-medium">{label}</div>
    {status && <div className="text-xs text-gray-500 mt-1">{status}</div>}
  </button>
);

export const Services: React.FC<ServicesProps> = ({ navigate, t }) => {
  const store = useStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const services = [
    { id: 'seat', icon: '🚉', label: t['services.preferredSeat'], enabled: true },
    { id: 'meals', icon: '🍱', label: t['services.meals'], enabled: true },
    { id: 'baggage', icon: '🧳', label: t['services.baggage'], enabled: true },
    { id: 'insurance', icon: '📄', label: t['services.insurance'], enabled: false },
    { id: 'dutyFree', icon: '🛍️', label: t['services.dutyFree'], enabled: false },
    { id: 'souvenirs', icon: '🎉', label: t['services.souvenirs'], enabled: false },
    { id: 'hotel', icon: '🏙️', label: t['services.hotel'], enabled: false },
    { id: 'activities', icon: '🎣', label: t['services.activities'], enabled: false },
    { id: 'transfers', icon: '🚗', label: t['services.transfers'], enabled: false },
  ];

  const handleServiceClick = (serviceId: string) => {
    // In a real app, would open modals for seat/meal/baggage selection
    console.log('Service clicked:', serviceId);
  };

  const handleContinue = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call for saving services
      navigate('payment');
    } catch (err) {
      setError(t['services.saveError']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Layout layoutType="stack" gap={16}>
        <Text variant="title-2" testId="services-step-header">
          {t['services.title']}
        </Text>

        <StatusNote
          tone="warning"
          visible={store.holdExpired}
          testId="hold-expired-alert"
        >
          {t['services.catalogError']}
        </StatusNote>

        <Layout layoutType="grid" columns="repeat(auto-fit, minmax(130px, 1fr))" gap={14}>
          {services.map((service) => (
            <ServiceTile
              key={service.id}
              icon={service.icon}
              label={service.label}
              disabled={!service.enabled}
              status={!service.enabled ? t['services.comingSoon'] : undefined}
              onClick={() => handleServiceClick(service.id)}
              testId="service-tile"
            />
          ))}
        </Layout>

        <StatusNote
          tone="error"
          visible={!!error}
          testId="save-error-alert"
        >
          {error}
        </StatusNote>

        <Button
          variant="primary"
          size="large"
          onClick={handleContinue}
          disabled={store.holdExpired || loading}
          testId="services-continue-button"
        >
          {loading ? 'Tải...' : t['services.continue']}
        </Button>
      </Layout>
    </div>
  );
};
