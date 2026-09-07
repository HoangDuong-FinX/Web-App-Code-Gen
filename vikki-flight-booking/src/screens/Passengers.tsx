import React, { useState, useCallback } from 'react';
import { t } from '../i18n';
import type { AppState, PassengerData } from '../types/state';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { TextField } from '../components/ui/TextField';
import { Checkbox } from '../components/ui/Checkbox';
import { AlertNote } from '../components/ui/AlertNote';
import { InlineError } from '../components/ui/InlineError';
import { PriceHoldCountdown } from '../components/ui/PriceHoldCountdown';
import { submitPassengers } from '../fixtures/ancillary';
import { FIXTURE_HOST_RUNTIME } from '../fixtures/hostRuntime';

interface PassengersProps {
  state: AppState;
  onNavigate: (screen: AppState['screen']) => void;
  onUpdateState: (updates: Partial<AppState>) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseName(fullName: string): { lastName: string; firstName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { lastName: parts[0], firstName: '' };
  const lastName = parts[parts.length - 1];
  const firstName = parts.slice(0, parts.length - 1).join(' ');
  return { lastName, firstName };
}

function paxLabel(index: number, adults: number, children: number): string {
  if (index < adults) return t('passengers.paxLabel.adult', { n: String(index + 1) });
  if (index < adults + children) return t('passengers.paxLabel.child', { n: String(index + 1) });
  return t('passengers.paxLabel.infant', { n: String(index + 1) });
}

export function PassengersScreen({ state, onNavigate, onUpdateState }: PassengersProps) {
  const session = state.outboundSession;
  const { searchCriteria } = state;

  const [passengers, setPassengers] = useState<PassengerData[]>(
    state.passengers.length > 0
      ? state.passengers
      : Array(searchCriteria.adults + searchCriteria.children + searchCriteria.infants)
          .fill(null)
          .map(() => ({ lastName: '', firstName: '', gender: 'M' as const, dob: '', phone: '', email: '' }))
  );
  const [emailErrors, setEmailErrors] = useState<boolean[]>(passengers.map(() => false));
  const [validationError, setValidationError] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [holdExpired, setHoldExpired] = useState(false);

  const updatePassenger = useCallback((index: number, updates: Partial<PassengerData>) => {
    setPassengers(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  }, []);

  const handleEmailBlur = (index: number) => {
    const email = passengers[index].email;
    if (email && !EMAIL_REGEX.test(email)) {
      setEmailErrors(prev => { const n = [...prev]; n[index] = true; return n; });
    } else {
      setEmailErrors(prev => { const n = [...prev]; n[index] = false; return n; });
    }
  };

  const handleAutoFill = (index: number, checked: boolean) => {
    if (!checked) return;
    const hostName = FIXTURE_HOST_RUNTIME.id.name;
    if (!hostName) return;
    const { lastName, firstName } = parseName(hostName);
    updatePassenger(index, { lastName, firstName });
  };

  const handleSubmit = async () => {
    if (holdExpired) return;
    setValidationError(false);
    setSubmitError(false);

    // Validate
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.lastName.trim() || !p.firstName.trim()) {
        setValidationError(true);
        return;
      }
      if (p.email && !EMAIL_REGEX.test(p.email)) {
        const errs = [...emailErrors];
        errs[i] = true;
        setEmailErrors(errs);
        setValidationError(true);
        return;
      }
    }

    setSubmitting(true);
    try {
      const ids = await submitPassengers();
      onUpdateState({ passengers, passengerIds: ids });
      onNavigate('services');
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) {
    onNavigate('search');
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-[28px] font-bold leading-[1.35] font-display">{t('passengers.title')}</h1>

      <PriceHoldCountdown
        expiresAt={session.expiresAt}
        onExpired={() => setHoldExpired(true)}
        data-testid="price-hold-countdown"
      />

      {holdExpired && (
        <AlertNote tone="error" role="alert">
          {t('passengers.holdExpired')}
          <Button variant="ghost" onClick={() => onNavigate('search')} className="ml-2 !py-0 !px-1 text-[12px]">
            {t('passengers.searchAgain')}
          </Button>
        </AlertNote>
      )}

      {passengers.map((pax, idx) => (
        <div key={idx} className="flex flex-col gap-3 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
          <h2 className="text-[17px] font-semibold leading-[1.4]">
            {paxLabel(idx, searchCriteria.adults, searchCriteria.children)}
          </h2>

          {idx === 0 && (
            <Checkbox
              label={t('passengers.autoFill')}
              aria-label={t('passengers.autoFill.aria')}
              data-testid="auto-fill-toggle"
              onChange={checked => handleAutoFill(idx, checked)}
            />
          )}

          <SegmentedControl
            options={[
              { label: t('passengers.gender.male'), value: 'M' },
              { label: t('passengers.gender.female'), value: 'F' },
            ]}
            value={pax.gender}
            onChange={v => updatePassenger(idx, { gender: v as 'M' | 'F' })}
            aria-label={t('passengers.gender.aria')}
            data-testid="gender-selection"
          />

          <TextField
            label={t('passengers.lastName.label')}
            placeholder={t('passengers.lastName.placeholder')}
            value={pax.lastName}
            onChange={v => updatePassenger(idx, { lastName: v })}
            required
            aria-label={t('passengers.lastName.aria')}
            data-testid="last-name-input"
          />

          <TextField
            label={t('passengers.firstName.label')}
            placeholder={t('passengers.firstName.placeholder')}
            value={pax.firstName}
            onChange={v => updatePassenger(idx, { firstName: v })}
            required
            aria-label={t('passengers.firstName.aria')}
            data-testid="first-name-input"
          />

          <TextField
            label={t('passengers.dob.label')}
            type="date"
            value={pax.dob}
            onChange={v => updatePassenger(idx, { dob: v })}
            aria-label={t('passengers.dob.aria')}
            data-testid="date-of-birth-input"
          />

          <TextField
            label={t('passengers.phone.label')}
            type="tel"
            value={pax.phone}
            onChange={v => updatePassenger(idx, { phone: v })}
            aria-label={t('passengers.phone.aria')}
            data-testid="phone-input"
          />

          <TextField
            label={t('passengers.email.label')}
            type="email"
            value={pax.email}
            onChange={v => updatePassenger(idx, { email: v })}
            onBlur={() => handleEmailBlur(idx)}
            error={emailErrors[idx]}
            aria-label={t('passengers.email.aria')}
            data-testid="email-input"
          />

          <InlineError visible={emailErrors[idx]} data-testid="passenger-validation-error">
            {t('passengers.email.error')}
          </InlineError>
        </div>
      ))}

      <AlertNote tone="error" visible={validationError} role="alert" data-testid="required-fields-error">
        {t('passengers.requiredFields.error')}
      </AlertNote>

      <Button
        variant="primary"
        fullWidth
        aria-label={t('passengers.continue.aria')}
        data-testid="submit-button"
        onClick={handleSubmit}
        disabled={holdExpired || submitting}
        loading={submitting}
      >
        {t('passengers.continue')}
      </Button>

      <AlertNote tone="error" visible={submitError} role="alert" data-testid="passenger-submit-error">
        {t('passengers.submit.error')}
      </AlertNote>
    </div>
  );
}
