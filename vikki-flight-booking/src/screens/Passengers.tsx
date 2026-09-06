import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { t } from '../i18n';
import { fixturePassengersSubmit } from '../fixtures';
import { Passenger } from '../types';

interface PassengersProps {
  airports: any[];
  cityPairs: any[];
  masterDataError: string | null;
  masterDataLoading: boolean;
}

const Passengers: React.FC<PassengersProps> = () => {
  const { navigateTo, updateBooking, booking } = useStore();
  const [passengers, setPassengers] = useState<Passenger[]>(booking.passengers || []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailErrors, setEmailErrors] = useState<Record<number, string>>({});

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePassengerChange = (index: number, field: string, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);

    if (field === 'email') {
      const errors = { ...emailErrors };
      if (!validateEmail(value)) {
        errors[index] = t('passengers.invalidEmail');
      } else {
        delete errors[index];
      }
      setEmailErrors(errors);
    }
  };

  const handleSubmit = async () => {
    // Validate
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].last_name || !passengers[i].first_name) {
        setError(t('passengers.requiredFields'));
        return;
      }
      if (passengers[i].email && !validateEmail(passengers[i].email)) {
        setError(t('passengers.invalidEmail'));
        return;
      }
    }

    setSubmitting(true);
    try {
      await fixturePassengersSubmit();
      updateBooking({ passengers });
      navigateTo('services');
    } catch (err) {
      setError(t('passengers.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('passengers.title')}</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {passengers.map((passenger, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-lg border">
            <h2 className="font-semibold mb-4">Passenger {idx + 1}</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">{t('passengers.lastName')}</label>
                <input
                  type="text"
                  value={passenger.last_name}
                  onChange={(e) => handlePassengerChange(idx, 'last_name', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('passengers.firstName')}</label>
                <input
                  type="text"
                  value={passenger.first_name}
                  onChange={(e) => handlePassengerChange(idx, 'first_name', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('passengers.gender')}</label>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      value="M"
                      checked={passenger.gender === 'M'}
                      onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                    />
                    {' '}
                    {t('passengers.male')}
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="F"
                      checked={passenger.gender === 'F'}
                      onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                    />
                    {' '}
                    {t('passengers.female')}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('passengers.dob')}</label>
                <input
                  type="date"
                  value={passenger.date_of_birth || ''}
                  onChange={(e) => handlePassengerChange(idx, 'date_of_birth', e.target.value || null)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('passengers.phone')}</label>
                <input
                  type="tel"
                  value={passenger.phone || ''}
                  onChange={(e) => handlePassengerChange(idx, 'phone', e.target.value || null)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('passengers.email')}</label>
                <input
                  type="email"
                  value={passenger.email || ''}
                  onChange={(e) => handlePassengerChange(idx, 'email', e.target.value || null)}
                  onBlur={() => {}}
                  className="w-full p-2 border rounded"
                />
                {emailErrors[idx] && (
                  <div className="text-red-600 text-sm mt-1">{emailErrors[idx]}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full mt-6 p-3 bg-blue-600 text-white rounded font-medium disabled:opacity-50"
        aria-label={t('passengers.continue')}
      >
        {submitting ? 'Submitting...' : t('passengers.continue')}
      </button>
    </div>
  );
};

export default Passengers;
