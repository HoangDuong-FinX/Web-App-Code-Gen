import React, { useState } from 'react';
import { useStore } from '../store';
import { submitPassengers } from '../fixtures';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Checkbox from '../components/Checkbox';
import SegmentedControl from '../components/SegmentedControl';
import InlineError from '../components/InlineError';
import AlertNote from '../components/AlertNote';
import PriceHoldCountdown from '../components/PriceHoldCountdown';

function Passengers() {
  const store = useStore();
  const [passengers, setPassengers] = useState<any[]>([
    { last_name: '', first_name: '', gender: 'M' },
    { last_name: '', first_name: '', gender: 'M' },
    { last_name: '', first_name: '', gender: 'M' },
  ]);
  const [autoFill, setAutoFill] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePassengerChange = (index: number, field: string, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const validateEmail = (email: string) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassengers = () => {
    for (const p of passengers) {
      if (!p.last_name || !p.first_name) return false;
      if (p.email && !validateEmail(p.email)) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePassengers()) {
      setError('validation');
      return;
    }
    setLoading(true);
    try {
      await submitPassengers();
      store.setCurrentScreen('services');
    } catch (err) {
      setError('submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Text variant="title-1" semantic="h1">
        {t('passengers.title')}
      </Text>
      <PriceHoldCountdown expiresAt={store.outboundSession?.expires_at} testId="price-hold-countdown" />
      <div className="mt-4 space-y-4">
        {passengers.map((p, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-3">
            <Text variant="headline" semantic="h2">
              Khách {i + 1} - {i === 0 ? 'Người lớn' : i === 1 ? 'Người lớn' : 'Trẻ em'}
            </Text>
            {i === 0 && (
              <Checkbox
                label={t('passengers.auto-fill')}
                checked={autoFill}
                onChange={(checked) => {
                  setAutoFill(checked);
                  if (checked && store.hostIdentity) {
                    const parts = store.hostIdentity.split(' ');
                    const lastName = parts[parts.length - 1];
                    const firstName = parts.slice(0, -1).join(' ');
                    handlePassengerChange(i, 'last_name', lastName);
                    handlePassengerChange(i, 'first_name', firstName);
                  }
                }}
                testId="auto-fill-toggle"
              />
            )}
            <SegmentedControl
              options={[
                { label: t('passengers.male'), value: 'M' },
                { label: t('passengers.female'), value: 'F' },
              ]}
              value={p.gender}
              onChange={(v) => handlePassengerChange(i, 'gender', v)}
              testId="gender-selection"
            />
            <TextField
              label={t('passengers.last-name')}
              placeholder="Theo giấy tờ tùy thân"
              value={p.last_name}
              onChange={(v) => handlePassengerChange(i, 'last_name', v)}
              required
              testId="last-name-input"
            />
            <TextField
              label={t('passengers.first-name')}
              placeholder="VD: Minh Hải"
              value={p.first_name}
              onChange={(v) => handlePassengerChange(i, 'first_name', v)}
              required
              testId="first-name-input"
            />
            <TextField
              label={t('passengers.dob')}
              type="date"
              value={p.date_of_birth || ''}
              onChange={(v) => handlePassengerChange(i, 'date_of_birth', v)}
              testId="date-of-birth-input"
            />
            <TextField
              label={t('passengers.phone')}
              type="tel"
              value={p.phone || ''}
              onChange={(v) => handlePassengerChange(i, 'phone', v)}
              testId="phone-input"
            />
            <TextField
              label={t('passengers.email')}
              type="email"
              value={p.email || ''}
              onChange={(v) => handlePassengerChange(i, 'email', v)}
              onBlur={() => {
                if (p.email && !validateEmail(p.email)) {
                  setError('email');
                }
              }}
              testId="email-input"
            />
            <InlineError visible={error === 'email'} testId="passenger-validation-error">
              Email không hợp lệ
            </InlineError>
          </div>
        ))}
      </div>
      <AlertNote visible={error === 'validation'} testId="required-fields-error">
        Vui lòng nhập thông tin cho tất cả hành khách.
      </AlertNote>
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={loading}
        testId="submit-button"
        className="w-full mt-4"
      >
        {t('passengers.button')}
      </Button>
      <AlertNote visible={error === 'submit'} testId="passenger-submit-error">
        {t('passengers.error')}
      </AlertNote>
    </div>
  );
}

export default Passengers;
