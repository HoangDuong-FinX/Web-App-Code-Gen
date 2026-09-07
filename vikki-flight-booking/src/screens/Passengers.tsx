import React, { useState } from 'react';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Checkbox } from '../components/Checkbox';
import { SegmentedControl } from '../components/SegmentedControl';
import { StatusNote } from '../components/StatusNote';
import { Layout } from '../components/Layout';
import { useStore } from '../store/store';
import { PassengerWithId } from '../types';

interface PassengersProps {
  navigate: (screen: string) => void;
  t: Record<string, string>;
}

export const Passengers: React.FC<PassengersProps> = ({ navigate, t }) => {
  const store = useStore();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalPassengers = store.adultCount + store.childCount + store.infantCount;

  // Initialize passengers array if empty
  React.useEffect(() => {
    if (store.passengers.length === 0) {
      const newPassengers: PassengerWithId[] = [];
      for (let i = 0; i < store.adultCount; i++) {
        newPassengers.push({
          last_name: '',
          first_name: '',
          gender: 'm',
          date_of_birth: null,
          phone: '',
          email: '',
        });
      }
      for (let i = 0; i < store.childCount; i++) {
        newPassengers.push({
          last_name: '',
          first_name: '',
          gender: 'm',
          date_of_birth: null,
          phone: '',
          email: '',
        });
      }
      for (let i = 0; i < store.infantCount; i++) {
        newPassengers.push({
          last_name: '',
          first_name: '',
          gender: 'm',
          date_of_birth: null,
          phone: '',
          email: '',
        });
      }
      store.setPassengers(newPassengers);
    }
  }, []);

  const updatePassenger = (index: number, field: keyof PassengerWithId, value: any) => {
    const updated = [...store.passengers];
    updated[index] = { ...updated[index], [field]: value };
    store.setPassengers(updated);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassengers = () => {
    for (let i = 0; i < store.passengers.length; i++) {
      const p = store.passengers[i];
      if (!p.last_name || !p.first_name) {
        setValidationError(t['passengers.validation']);
        return false;
      }
      if (p.email && !validateEmail(p.email)) {
        setValidationError(t['passengers.invalidEmail']);
        return false;
      }
      if (p.date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(p.date_of_birth)) {
        setValidationError(t['passengers.invalidDob']);
        return false;
      }
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validatePassengers()) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      store.setOutboundPassengers(store.passengers);
      if (store.tripType === 'roundTrip') {
        store.setReturnPassengers(store.passengers);
      }
      navigate('services');
    } catch (err) {
      setError(t['passengers.error']);
    } finally {
      setLoading(false);
    }
  };

  const handleFillSampleData = () => {
    const samplePassengers = store.passengers.map((p, idx) => ({
      ...p,
      last_name: 'Nguyễn',
      first_name: `Hành khách ${idx + 1}`,
      date_of_birth: '1990-01-01',
      email: `passenger${idx + 1}@example.com`,
    }));
    store.setPassengers(samplePassengers);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Layout layoutType="stack" gap={16}>
        <Text variant="title-2" testId="passengers-step-header">
          {t['passengers.title']}
        </Text>

        <StatusNote
          tone="warning"
          visible={store.holdExpired}
          testId="hold-expired-alert"
        >
          {t['passengers.validation']}
        </StatusNote>

        <Button
          variant="tertiary"
          size="small"
          onClick={handleFillSampleData}
          testId="fill-sample-data-button"
        >
          {t['passengers.fillSampleData']}
        </Button>

        {store.passengers.map((passenger, idx) => (
          <Layout key={idx} layoutType="stack" gap={14}>
            <Text variant="headline" testId="passenger-row-header">
              Hành khách {idx + 1}
            </Text>

            {idx === 0 && (
              <Checkbox
                label={t['passengers.isMe']}
                checked={false}
                testId="is-me-checkbox"
              />
            )}

            <SegmentedControl
              options={[
                { label: t['passengers.male'], value: 'm' },
                { label: t['passengers.female'], value: 'f' },
                { label: t['passengers.other'], value: 'o' },
              ]}
              value={passenger.gender}
              onChange={(v) => updatePassenger(idx, 'gender', v)}
              testId="gender-selector"
            />

            <Layout layoutType="grid" columns="repeat(auto-fit, minmax(220px, 1fr))" gap={14}>
              <Input
                type="text"
                label={t['passengers.lastName']}
                labelVariant="subheadline"
                placeholder={t['passengers.lastNamePlaceholder']}
                value={passenger.last_name}
                onChange={(v) => updatePassenger(idx, 'last_name', v)}
                required
                testId="last-name-input"
              />
              <Input
                type="text"
                label={t['passengers.firstName']}
                labelVariant="subheadline"
                placeholder={t['passengers.firstNamePlaceholder']}
                value={passenger.first_name}
                onChange={(v) => updatePassenger(idx, 'first_name', v)}
                required
                testId="first-name-input"
              />
              <Input
                type="date"
                label={t['passengers.dob']}
                labelVariant="subheadline"
                value={passenger.date_of_birth || ''}
                onChange={(v) => updatePassenger(idx, 'date_of_birth', v)}
                testId="dob-input"
              />
            </Layout>
          </Layout>
        ))}

        <StatusNote
          tone="error"
          visible={!!validationError}
          testId="validation-error-alert"
        >
          {validationError}
        </StatusNote>

        <StatusNote
          tone="error"
          visible={!!error}
          testId="passenger-error-alert"
        >
          {error}
        </StatusNote>

        <Button
          variant="primary"
          size="large"
          onClick={handleContinue}
          disabled={store.holdExpired || loading}
          testId="passengers-continue-button"
        >
          {loading ? 'Tải...' : t['passengers.continue']}
        </Button>
      </Layout>
    </div>
  );
};
