import React, { useState, useEffect } from 'react';
import { useAppContext, isHoldExpired, buildInitialPassengers } from '../store';
import { t } from '../i18n/vi';
import {
  Text, Button, SegmentedControl, TextField, Checkbox, InlineError, AlertNote,
} from '../components/ui';
import { PriceHoldCountdown } from '../components/PriceHoldCountdown';
import { submitPassengers } from '../fixtures/bookingService';
import type { Passenger } from '../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPassengerTypeLabel(type: Passenger['type']): string {
  switch (type) {
    case 'adult': return t('passengers.type.adult');
    case 'child': return t('passengers.type.child');
    case 'infant': return t('passengers.type.infant');
  }
}

function parseDob(raw: string): string | null {
  // Accept ISO YYYY-MM-DD only; send null otherwise (BR-14)
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return raw;
  }
  return null;
}

export function PassengersScreen() {
  const { state, setState, navigate } = useAppContext();
  const { expiresAt, passengers, searchCriteria, outboundSessionId, returnSessionId, hostName } = state;

  const [localPassengers, setLocalPassengers] = useState<Passenger[]>(() =>
    passengers.length > 0 ? passengers : buildInitialPassengers(searchCriteria)
  );
  const [emailErrors, setEmailErrors] = useState<Record<number, string>>({});
  const [requiredErrors, setRequiredErrors] = useState<Record<number, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [holdExpired, setHoldExpired] = useState(isHoldExpired(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setHoldExpired(isHoldExpired(expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const updatePassenger = (idx: number, patch: Partial<Passenger>) => {
    setLocalPassengers(ps => ps.map((p, i) => i === idx ? { ...p, ...patch } : p));
  };

  const handleAutoFill = (idx: number, checked: boolean) => {
    if (!checked) return;
    const name = hostName ?? '';
    if (!name) {
      // No host identity available
      return;
    }
    const parts = name.trim().split(/\s+/);
    const lastName = parts[parts.length - 1] ?? '';
    const firstName = parts.slice(0, -1).join(' ') || lastName;
    updatePassenger(idx, { lastName, firstName });
  };

  const handleEmailBlur = (idx: number, value: string) => {
    if (value && !EMAIL_REGEX.test(value)) {
      setEmailErrors(e => ({ ...e, [idx]: t('passengers.emailError') }));
    } else {
      setEmailErrors(e => { const next = { ...e }; delete next[idx]; return next; });
    }
  };

  const validate = (): number | null => {
    const errors: Record<number, boolean> = {};
    let firstInvalid: number | null = null;
    for (let i = 0; i < localPassengers.length; i++) {
      const p = localPassengers[i];
      const hasRequired = p.lastName.trim() && p.firstName.trim();
      const emailOk = !p.email || EMAIL_REGEX.test(p.email);
      if (!hasRequired || !emailOk) {
        errors[i] = true;
        if (firstInvalid === null) firstInvalid = i;
      }
    }
    setRequiredErrors(errors);
    return firstInvalid;
  };

  const handleSubmit = async () => {
    if (holdExpired || loading) return;
    const firstInvalid = validate();
    if (firstInvalid !== null) return;

    setSubmitError(null);
    setLoading(true);
    try {
      const paxPayload = localPassengers.map(p => ({
        ...p,
        dateOfBirth: parseDob(p.dateOfBirth ?? ''),
      }));

      const result = await submitPassengers(outboundSessionId!, paxPayload);
      const withIds = localPassengers.map((p, i) => ({
        ...p,
        passengerId: result.passengers[i]?.passengerId,
      }));

      // For round-trip, submit to return session too
      if (searchCriteria.tripType === 'round-trip' && returnSessionId) {
        await submitPassengers(returnSessionId, paxPayload);
      }

      setState(s => ({ ...s, passengers: withIds, currentScreen: 'services' }));
    } catch {
      setSubmitError(t('passengers.submitError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen passengers-screen">
      <div className="screen__content">
        <h1 className="text-title-1">{t('passengers.title')}</h1>

        <PriceHoldCountdown expiresAt={expiresAt} data-testid="price-hold-countdown" />

        {holdExpired && (
          <AlertNote visible tone="warning">
            {t('passengers.holdExpired')}
            <button type="button" className="btn btn-ghost" onClick={() => navigate('search')}>
              {t('search.searchAgain')}
            </button>
          </AlertNote>
        )}

        {localPassengers.map((pax, idx) => (
          <div key={idx} className="passenger-card">
            <h2 className="text-headline">
              {t('passengers.guest')} {idx + 1} - {getPassengerTypeLabel(pax.type)}
            </h2>

            {idx === 0 && (
              <Checkbox
                label={t('passengers.autoFill')}
                checked={false}
                onChange={checked => handleAutoFill(idx, checked)}
                ariaLabel={t('passengers.autoFill.ariaLabel')}
                data-testid="auto-fill-toggle"
              />
            )}

            <SegmentedControl
              options={[
                { label: t('passengers.gender.male'), value: 'M' },
                { label: t('passengers.gender.female'), value: 'F' },
              ]}
              value={pax.gender}
              onChange={v => updatePassenger(idx, { gender: v as 'M' | 'F' })}
              ariaLabel={t('passengers.gender.ariaLabel')}
              data-testid="gender-selection"
            />

            <TextField
              label={t('passengers.lastName.label')}
              placeholder={t('passengers.lastName.placeholder')}
              aria-label={t('passengers.lastName.ariaLabel')}
              value={pax.lastName}
              onChange={e => updatePassenger(idx, { lastName: e.target.value })}
              required
              data-testid="last-name-input"
              error={requiredErrors[idx] && !pax.lastName.trim() ? t('passengers.requiredError') : undefined}
            />

            <TextField
              label={t('passengers.firstName.label')}
              placeholder={t('passengers.firstName.placeholder')}
              aria-label={t('passengers.firstName.ariaLabel')}
              value={pax.firstName}
              onChange={e => updatePassenger(idx, { firstName: e.target.value })}
              required
              data-testid="first-name-input"
              error={requiredErrors[idx] && !pax.firstName.trim() ? t('passengers.requiredError') : undefined}
            />

            <TextField
              label={t('passengers.dob.label')}
              type="date"
              aria-label={t('passengers.dob.ariaLabel')}
              value={pax.dateOfBirth ?? ''}
              onChange={e => updatePassenger(idx, { dateOfBirth: e.target.value || null })}
              data-testid="date-of-birth-input"
            />

            {pax.type !== 'infant' && (
              <TextField
                label={t('passengers.phone.label')}
                type="tel"
                aria-label={t('passengers.phone.ariaLabel')}
                value={pax.phone}
                onChange={e => updatePassenger(idx, { phone: e.target.value })}
                data-testid="phone-input"
              />
            )}

            {pax.type !== 'infant' && (
              <TextField
                label={t('passengers.email.label')}
                type="email"
                aria-label={t('passengers.email.ariaLabel')}
                value={pax.email}
                onChange={e => updatePassenger(idx, { email: e.target.value })}
                onBlur={e => handleEmailBlur(idx, e.target.value)}
                data-testid="email-input"
                error={emailErrors[idx]}
              />
            )}

            <InlineError visible={!!requiredErrors[idx]} data-testid="passenger-validation-error">
              {t('passengers.requiredError')}
            </InlineError>
          </div>
        ))}

        <AlertNote visible={!!submitError} tone="error" data-testid="passenger-submit-error">
          {submitError}
        </AlertNote>

        <button
          type="button"
          className="btn btn-primary"
          aria-label={t('passengers.continue.ariaLabel')}
          data-testid="submit-button"
          disabled={holdExpired || loading}
          onClick={handleSubmit}
        >
          {loading ? t('common.loading') : t('passengers.continue')}
        </button>
      </div>
    </div>
  );
}
