import React, { useState, useCallback } from 'react';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { TextField } from '../components/TextField';
import { SegmentedControl } from '../components/SegmentedControl';
import { Checkbox } from '../components/Checkbox';
import { AlertNote } from '../components/AlertNote';
import { InlineError } from '../components/InlineError';
import { PriceHoldCountdown } from '../components/PriceHoldCountdown';
import { HoldExpiredNote } from '../components/HoldExpiredNote';
import { t } from '../i18n';
import { isExpired } from '../utils/date';
import { fixtureSubmitPassengers } from '../fixtures/flights';
import type { AppState, AppAction, ScreenId, PassengerInfo, PassengerForm } from '../types/state';

interface PassengersScreenProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (s: ScreenId) => void;
  hostRuntime?: { id?: { name?: string }; theme?: string; locale?: string };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emptyForm(): PassengerForm {
  return { lastName: '', firstName: '', gender: 'M', dob: '', phone: '', email: '', emailError: false };
}

export function PassengersScreen({
  state,
  dispatch,
  navigate,
  hostRuntime,
}: PassengersScreenProps): React.ReactElement {
  const totalPassengers = state.adults + state.children + state.infants;

  function buildInitialForms(): PassengerForm[] {
    if (state.passengers.length === totalPassengers) {
      return state.passengers.map(p => ({ ...p, emailError: false }));
    }
    return Array.from({ length: totalPassengers }, () => emptyForm());
  }

  const [forms, setForms] = useState<PassengerForm[]>(buildInitialForms);
  const [holdExpired, setHoldExpired] = useState(isExpired(state.expiresAt));

  function getPaxType(index: number): 'adult' | 'child' | 'infant' {
    if (index < state.adults) return 'adult';
    if (index < state.adults + state.children) return 'child';
    return 'infant';
  }

  function getPaxLabel(index: number): string {
    const type = getPaxType(index);
    const i = index + 1;
    if (type === 'adult') return t('passengers.paxLabel.adult', { i });
    if (type === 'child') return t('passengers.paxLabel.child', { i });
    return t('passengers.paxLabel.infant', { i });
  }

  function updateForm(index: number, partial: Partial<PassengerForm>) {
    setForms(prev => prev.map((f, i) => i === index ? { ...f, ...partial } : f));
  }

  function handleAutoFill(index: number, checked: boolean) {
    if (!checked) return;
    const name = hostRuntime?.id?.name;
    if (!name) {
      dispatch({ type: 'SET_PASSENGER_ERROR', error: t('passengers.autoFillError') });
      return;
    }
    const parts = name.trim().split(' ');
    const lastName = parts[parts.length - 1] ?? '';
    const firstName = parts.slice(0, -1).join(' ') || parts[0] || '';
    updateForm(index, { lastName, firstName });
  }

  function handleEmailBlur(index: number) {
    const email = forms[index].email;
    const emailError = email !== '' && !EMAIL_RE.test(email);
    updateForm(index, { emailError });
  }

  // DOB: only accept YYYY-MM-DD format (from <input type="date">); per BR-14 send null if invalid
  function normalizeDob(dob: string): string | null {
    if (!dob) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) return dob;
    return null; // Never auto-convert DD/MM/YYYY
  }

  const handleSubmit = useCallback(async () => {
    if (holdExpired) return;

    // Validate all passengers
    let firstInvalidIndex = -1;
    const validatedForms = forms.map((f, i) => {
      const emailError = f.email !== '' && !EMAIL_RE.test(f.email);
      const hasError = !f.lastName.trim() || !f.firstName.trim() || emailError;
      if (hasError && firstInvalidIndex === -1) firstInvalidIndex = i;
      return { ...f, emailError };
    });
    setForms(validatedForms);

    if (firstInvalidIndex !== -1) {
      dispatch({ type: 'SET_PASSENGER_ERROR', error: t('passengers.required') });
      // Scroll to first invalid passenger
      document.getElementById(`pax-form-${firstInvalidIndex}`)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    dispatch({ type: 'SET_SUBMITTING_PASSENGERS', value: true });
    try {
      const paxPayload = forms.map(f => ({
        lastName: f.lastName.trim(),
        firstName: f.firstName.trim(),
        gender: f.gender,
        date_of_birth: normalizeDob(f.dob),
        phone: f.phone || null,
        email: f.email || null,
      }));

      const result = await fixtureSubmitPassengers(state.sessionId, paxPayload);

      const passengers: PassengerInfo[] = forms.map((f, i) => ({
        ...f,
        passengerId: result.passengers[i]?.passengerId ?? `pax_${i + 1}`,
        type: getPaxType(i),
        index: i + 1,
      }));
      dispatch({ type: 'SET_PASSENGERS', passengers });
      navigate('services');
    } catch {
      dispatch({ type: 'SET_PASSENGER_ERROR', error: t('passengers.error') });
    }
  }, [holdExpired, forms, state.sessionId, dispatch, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text variant="title-1" semantic="h1">{t('passengers.title')}</Text>

      {state.expiresAt && (
        <PriceHoldCountdown
          expiresAt={state.expiresAt}
          onExpired={() => setHoldExpired(true)}
          data-testid="price-hold-countdown"
        />
      )}

      {holdExpired && <HoldExpiredNote onSearchAgain={() => navigate('search')} />}

      {forms.map((form, index) => (
        <div
          key={index}
          id={`pax-form-${index}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '12px',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-12)',
          }}
        >
          <Text variant="headline" semantic="h2">{getPaxLabel(index)}</Text>

          {index === 0 && (
            <Checkbox
              label={t('passengers.iAmPassenger')}
              ariaLabel={t('passengers.iAmPassenger.ariaLabel')}
              onChange={checked => handleAutoFill(index, checked)}
              data-testid="auto-fill-toggle"
            />
          )}

          <SegmentedControl
            options={[
              { label: t('passengers.gender.male'), value: 'M' },
              { label: t('passengers.gender.female'), value: 'F' },
            ]}
            value={form.gender}
            onChange={v => updateForm(index, { gender: v as 'M' | 'F' })}
            ariaLabel={`${getPaxLabel(index)} - giới tính`}
            data-testid="gender-selection"
          />

          <TextField
            label={t('passengers.lastName.label')}
            placeholder={t('passengers.lastName.placeholder')}
            value={form.lastName}
            onChange={v => updateForm(index, { lastName: v })}
            required
            ariaLabel={t('passengers.lastName.ariaLabel')}
            data-testid="last-name-input"
            error={!form.lastName.trim() && form.lastName !== ''}
          />

          <TextField
            label={t('passengers.firstName.label')}
            placeholder={t('passengers.firstName.placeholder')}
            value={form.firstName}
            onChange={v => updateForm(index, { firstName: v })}
            required
            ariaLabel={t('passengers.firstName.ariaLabel')}
            data-testid="first-name-input"
            error={!form.firstName.trim() && form.firstName !== ''}
          />

          <TextField
            label={t('passengers.dob.label')}
            type="date"
            value={form.dob}
            onChange={v => updateForm(index, { dob: v })}
            ariaLabel={t('passengers.dob.ariaLabel')}
            data-testid="date-of-birth-input"
          />

          <TextField
            label={t('passengers.phone.label')}
            type="tel"
            value={form.phone}
            onChange={v => updateForm(index, { phone: v })}
            ariaLabel={t('passengers.phone.ariaLabel')}
            data-testid="phone-input"
          />

          <TextField
            label={t('passengers.email.label')}
            type="email"
            value={form.email}
            onChange={v => updateForm(index, { email: v, emailError: false })}
            onBlur={() => handleEmailBlur(index)}
            ariaLabel={t('passengers.email.ariaLabel')}
            data-testid="email-input"
            error={form.emailError}
          />
          <InlineError
            visible={form.emailError}
            data-testid="passenger-validation-error"
          >
            {t('passengers.email.invalid')}
          </InlineError>
        </div>
      ))}

      {state.passengerError && (
        <AlertNote tone="critical" visible role="alert" data-testid="required-fields-error">
          {state.passengerError}
        </AlertNote>
      )}

      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={holdExpired || state.isSubmittingPassengers}
        ariaLabel={t('passengers.submit.ariaLabel')}
        data-testid="submit-button"
        fullWidth
      >
        {state.isSubmittingPassengers ? t('common.loading') : t('passengers.submit')}
      </Button>
    </div>
  );
}
