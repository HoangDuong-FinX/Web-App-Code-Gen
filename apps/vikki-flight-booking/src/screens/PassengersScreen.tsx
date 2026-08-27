import React, { useState, useCallback, useMemo } from 'react';
import { useI18n } from '../i18n';
import { useBooking, useHoldTimer } from '../context/BookingContext';
import { TopBar } from '../components/TopBar';
import { InputField } from '../components/shared';
import { ButtonBig } from '../components/shared';
import { InlineError } from '../components/shared';
import { DatePickerModal } from '../components/DatePickerModal';
import { submitPassengers } from '../api';
import type { PassengerInfo } from '../types';

interface PassengersScreenProps {
  onNavigate: (screen: 'services' | 'results' | 'results-return' | 'hold-expired') => void;
}

interface PassengerFormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  documentNumber: string;
  phone: string;
  type: 'adult' | 'child' | 'infant';
}

export function PassengersScreen({ onNavigate }: PassengersScreenProps) {
  const { t } = useI18n();
  const { state, dispatch } = useBooking();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dobPickerOpen, setDobPickerOpen] = useState(false);
  const [dobPickerIndex, setDobPickerIndex] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Build passenger slots based on count
  const passengerSlots = useMemo(() => {
    const slots: PassengerFormData[] = [];
    for (let i = 0; i < state.passengerCount.adults; i++) {
      slots.push({ fullName: '', dateOfBirth: '', gender: '', nationality: '', documentNumber: '', phone: '', type: 'adult' });
    }
    for (let i = 0; i < state.passengerCount.children; i++) {
      slots.push({ fullName: '', dateOfBirth: '', gender: '', nationality: '', documentNumber: '', phone: '', type: 'child' });
    }
    for (let i = 0; i < state.passengerCount.infants; i++) {
      slots.push({ fullName: '', dateOfBirth: '', gender: '', nationality: '', documentNumber: '', phone: '', type: 'infant' });
    }
    return slots;
  }, [state.passengerCount]);

  const [passengers, setPassengers] = useState<PassengerFormData[]>(
    state.passengers.length > 0
      ? state.passengers.map((p) => ({ ...p }))
      : passengerSlots
  );

  // Hold timer
  const outboundExpiry = state.outboundSession?.expiresAt ?? null;
  const returnExpiry = state.returnSession?.expiresAt ?? null;
  const earliestExpiry = (() => {
    if (!outboundExpiry) return returnExpiry;
    if (!returnExpiry) return outboundExpiry;
    return outboundExpiry < returnExpiry ? outboundExpiry : returnExpiry;
  })();

  const handleExpire = useCallback(() => {
    onNavigate('hold-expired');
  }, [onNavigate]);

  useHoldTimer(earliestExpiry, handleExpire);

  const handleBack = () => {
    if (state.tripType === 'round') {
      onNavigate('results-return');
    } else {
      onNavigate('results');
    }
  };

  const updatePassenger = (index: number, field: keyof PassengerFormData, value: string) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    // Clear field error on edit
    setFieldErrors((prev) => {
      const key = `${index}-${field}`;
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return prev;
    });
  };

  const openDobPicker = (index: number) => {
    setDobPickerIndex(index);
    setDobPickerOpen(true);
  };

  const handleDobSelect = (date: string) => {
    updatePassenger(dobPickerIndex, 'dateOfBirth', date);
  };

  const getTypeLabel = (type: 'adult' | 'child' | 'infant'): string => {
    switch (type) {
      case 'adult': return t('passengers.type.adult');
      case 'child': return t('passengers.type.child');
      case 'infant': return t('passengers.type.infant');
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    passengers.forEach((pax, i) => {
      if (!pax.fullName.trim()) errors[`${i}-fullName`] = t('error.requiredField');
      if (!pax.dateOfBirth) errors[`${i}-dateOfBirth`] = t('error.requiredField');
      if (!pax.gender) errors[`${i}-gender`] = t('error.requiredField');
      if (!pax.nationality) errors[`${i}-nationality`] = t('error.requiredField');
      // Phone required for first passenger (primary contact)
      if (i === 0 && !pax.phone.trim()) errors[`${i}-phone`] = t('error.requiredField');
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = async () => {
    setError('');
    if (!validate()) {
      setError(t('error.requiredField'));
      return;
    }

    const sessionId = state.outboundSession?.sessionId;
    if (!sessionId) {
      setError(t('error.generic'));
      return;
    }

    setLoading(true);
    try {
      const payload = passengers.map((p) => ({
        fullName: p.fullName.trim(),
        dateOfBirth: p.dateOfBirth,
        gender: p.gender,
        nationality: p.nationality,
        documentNumber: p.documentNumber || null,
        phone: p.phone,
      }));

      const response = await submitPassengers({ sessionId, passengers: payload });
      dispatch({ type: 'SET_PASSENGER_IDS', payload: response.passengers.map((p) => p.passenger_id) });
      dispatch({ type: 'SET_PASSENGERS', payload: passengers });

      // If round-trip, submit to return session as well
      if (state.tripType === 'round' && state.returnSession?.sessionId) {
        const returnResponse = await submitPassengers({
          sessionId: state.returnSession.sessionId,
          passengers: payload,
        });
        dispatch({ type: 'SET_RETURN_PASSENGER_IDS', payload: returnResponse.passengers.map((p) => p.passenger_id) });
      }

      onNavigate('services');
    } catch (err: unknown) {
      const errObj = err as Error & { status?: number };
      if (errObj.status === 500) {
        setError(t('error.invalidDob'));
      } else {
        setError(t('error.submitPassengersFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { value: 'Nam', label: t('passengers.gender.male') },
    { value: 'N\u1EEF', label: t('passengers.gender.female') },
    { value: 'Kh\u00E1c', label: t('passengers.gender.other') },
  ];

  return (
    <div className="screen screen--passengers">
      <TopBar
        title={t('topbar.passengers')}
        showBackArrow
        onBack={handleBack}
        ariaLabel={t('topbar.passengers')}
      />

      <div className="screen__content screen__scrollable">
        <p className="passengers__summary" aria-label={t('search.passengers.label')}>
          {t('passengers.countSummary', {
            adults: String(state.passengerCount.adults),
            childrenText: state.passengerCount.children > 0 ? t('passengers.children', { count: String(state.passengerCount.children) }) : '',
            infantsText: state.passengerCount.infants > 0 ? t('passengers.infants', { count: String(state.passengerCount.infants) }) : '',
          })}
        </p>

        {passengers.map((pax, index) => (
          <div key={index} className="passenger-card">
            <h3 className="passenger-card__title">
              {t('passengers.passengerLabel', { index: String(index + 1), type: getTypeLabel(pax.type) })}
            </h3>

            <InputField
              label={t('passengers.fullName.label')}
              value={pax.fullName}
              placeholder={t('passengers.fullName.placeholder')}
              type="text"
              required
              ariaLabel={`${t('passengers.fullName.label')} ${index + 1}`}
              error={fieldErrors[`${index}-fullName`]}
              onChange={(val) => updatePassenger(index, 'fullName', val)}
            />

            <InputField
              label={t('passengers.dob.label')}
              value={pax.dateOfBirth}
              placeholder={t('search.date.placeholder')}
              type="selector"
              required
              readOnly
              ariaLabel={`${t('passengers.dob.label')} ${index + 1}`}
              error={fieldErrors[`${index}-dateOfBirth`]}
              onTap={() => openDobPicker(index)}
            />

            <div className="passenger-card__gender">
              <label className="input-field__label">
                {t('passengers.gender.label')}
                <span className="input-field__required" aria-hidden="true">*</span>
              </label>
              <div className="gender-options" role="radiogroup" aria-label={`${t('passengers.gender.label')} ${index + 1}`}>
                {genderOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`gender-option ${pax.gender === opt.value ? 'gender-option--active' : ''}`}
                    role="radio"
                    aria-checked={pax.gender === opt.value}
                    onClick={() => updatePassenger(index, 'gender', opt.value)}
                    type="button"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {fieldErrors[`${index}-gender`] && (
                <span className="input-field__error" role="alert">{fieldErrors[`${index}-gender`]}</span>
              )}
            </div>

            <InputField
              label={t('passengers.nationality.label')}
              value={pax.nationality}
              placeholder={t('passengers.nationality.label')}
              type="selector"
              required
              readOnly
              ariaLabel={`${t('passengers.nationality.label')} ${index + 1}`}
              error={fieldErrors[`${index}-nationality`]}
              onTap={() => updatePassenger(index, 'nationality', 'VN')}
            />

            <InputField
              label={t('passengers.document.label')}
              value={pax.documentNumber}
              placeholder={t('passengers.document.label')}
              type="text"
              ariaLabel={`${t('passengers.document.label')} ${index + 1}`}
              onChange={(val) => updatePassenger(index, 'documentNumber', val)}
            />

            <InputField
              label={t('passengers.phone.label')}
              value={pax.phone}
              placeholder={t('passengers.phone.label')}
              type="phone"
              required={index === 0}
              ariaLabel={`${t('passengers.phone.label')} ${index + 1}`}
              helperText={index === 0 ? t('passengers.phone.helper') : undefined}
              error={fieldErrors[`${index}-phone`]}
              onChange={(val) => updatePassenger(index, 'phone', val)}
            />
          </div>
        ))}

        <InlineError visible={!!error}>{error}</InlineError>

        <ButtonBig
          variant={loading ? 'Disabled' : 'Active'}
          onClick={handleContinue}
          ariaLabel={t('passengers.continue.ariaLabel')}
          loading={loading}
        >
          {t('passengers.continue')}
        </ButtonBig>
      </div>

      <DatePickerModal
        open={dobPickerOpen}
        onClose={() => setDobPickerOpen(false)}
        onSelect={handleDobSelect}
        maxDate={new Date().toISOString().split('T')[0]}
        initialDate={passengers[dobPickerIndex]?.dateOfBirth}
      />
    </div>
  );
}
