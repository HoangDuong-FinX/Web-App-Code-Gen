import React, { useState } from 'react';
import { vi } from '../i18n/vi';
import type { AppState, AppAction, PassengerInfo } from '../types';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { Checkbox } from '../components/ui/Checkbox';
import { AlertNote } from '../components/ui/AlertNote';
import { InlineError } from '../components/ui/InlineError';
import { PriceHoldCountdown } from '../components/ui/PriceHoldCountdown';
import { isHoldExpired } from '../utils/holdExpiry';
import { fixtureSubmitPassengers } from '../fixtures';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function typeLabel(type: PassengerInfo['type']): string {
  if (type === 'adult') return vi.passengers.adult;
  if (type === 'child') return vi.passengers.child;
  return vi.passengers.infant;
}

interface PassengerFormState {
  emailError: boolean;
  requiredError: boolean;
}

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const PassengersScreen: React.FC<Props> = ({ state, dispatch }) => {
  const { passengers, outboundSession } = state;
  const expiresAt = outboundSession?.expiresAt ?? new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const [formErrors, setFormErrors] = useState<PassengerFormState[]>(
    () => passengers.map(() => ({ emailError: false, requiredError: false })),
  );
  const [loading, setLoading] = useState(false);

  const expired = isHoldExpired(expiresAt);

  const handleUpdate = (idx: number, partial: Partial<PassengerInfo>) => {
    dispatch({ type: 'UPDATE_PASSENGER', index: idx, passenger: partial });
  };

  const handleEmailBlur = (idx: number) => {
    const email = passengers[idx]?.email ?? '';
    if (email && !EMAIL_REGEX.test(email)) {
      setFormErrors((prev) =>
        prev.map((e, i) => (i === idx ? { ...e, emailError: true } : e)),
      );
    } else {
      setFormErrors((prev) =>
        prev.map((e, i) => (i === idx ? { ...e, emailError: false } : e)),
      );
    }
  };

  const handleAutoFill = (idx: number, checked: boolean) => {
    if (!checked) return;
    // hostRuntime.id.name is not available in standalone mode — fixture: use placeholder
    const name = 'Nguyễn Văn A';
    const parts = name.trim().split(' ');
    const lastName = parts[parts.length - 1] ?? '';
    const firstName = parts.slice(0, -1).join(' ');
    handleUpdate(idx, { lastName, firstName });
  };

  const handleSubmit = async () => {
    if (expired) return;
    // Validate
    let firstInvalidIdx = -1;
    const newErrors = passengers.map((p, i) => {
      const requiredError = !p.lastName.trim() || !p.firstName.trim();
      const emailError = !!p.email && !EMAIL_REGEX.test(p.email);
      if ((requiredError || emailError) && firstInvalidIdx === -1) {
        firstInvalidIdx = i;
      }
      return { requiredError, emailError };
    });
    setFormErrors(newErrors);
    if (firstInvalidIdx !== -1) {
      const el = document.querySelector(`[data-pax-idx="${firstInvalidIdx}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setLoading(true);
    dispatch({ type: 'SET_PASSENGER_ERROR', error: null });
    try {
      const sessionId = outboundSession?.sessionId ?? 'sess_fixture';
      const updated = await fixtureSubmitPassengers(sessionId, passengers);
      dispatch({ type: 'SET_PASSENGERS', passengers: updated });
      dispatch({ type: 'NAVIGATE', screen: 'services' });
    } catch {
      dispatch({ type: 'SET_PASSENGER_ERROR', error: vi.passengers.submitError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-[var(--text-title-1)] text-[var(--color-text-primary)]">
        {vi.passengers.title}
      </h1>

      <PriceHoldCountdown expiresAt={expiresAt} data-testid="price-hold-countdown" />

      {expired && (
        <AlertNote visible tone="error">
          {vi.passengers.holdExpired}
          <Button variant="ghost" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'search' })}>
            {vi.passengers.searchAgain}
          </Button>
        </AlertNote>
      )}

      {passengers.map((pax, idx) => (
        <div
          key={idx}
          data-pax-idx={idx}
          className="flex flex-col gap-3 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]"
        >
          <h2 className="text-[var(--text-headline)] text-[var(--color-text-primary)]">
            {vi.passengers.guestLabel} {pax.passengerIndex} - {typeLabel(pax.type)}
          </h2>

          {idx === 0 && (
            <Checkbox
              label={vi.passengers.selfToggle}
              ariaLabel={vi.passengers.selfToggleLabel}
              data-testid="auto-fill-toggle"
              onChange={(checked) => handleAutoFill(idx, checked)}
            />
          )}

          <SegmentedControl
            options={[
              { label: vi.passengers.male, value: 'M' },
              { label: vi.passengers.female, value: 'F' },
            ]}
            value={pax.gender}
            onChange={(v) => handleUpdate(idx, { gender: v as 'M' | 'F' })}
            ariaLabel={vi.passengers.genderLabel}
            data-testid="gender-selection"
          />

          <TextField
            label={vi.passengers.lastNameLabel}
            placeholder={vi.passengers.lastNamePlaceholder}
            value={pax.lastName}
            onChange={(v) => handleUpdate(idx, { lastName: v })}
            required
            ariaLabel={vi.passengers.lastNameAriaLabel}
            data-testid="last-name-input"
            error={formErrors[idx]?.requiredError && !pax.lastName.trim() ? vi.passengers.requiredError : undefined}
          />

          <TextField
            label={vi.passengers.firstNameLabel}
            placeholder={vi.passengers.firstNamePlaceholder}
            value={pax.firstName}
            onChange={(v) => handleUpdate(idx, { firstName: v })}
            required
            ariaLabel={vi.passengers.firstNameAriaLabel}
            data-testid="first-name-input"
            error={formErrors[idx]?.requiredError && !pax.firstName.trim() ? vi.passengers.requiredError : undefined}
          />

          <TextField
            label={vi.passengers.dobLabel}
            type="date"
            value={pax.dateOfBirth ?? ''}
            onChange={(v) => {
              // Only accept ISO YYYY-MM-DD; send null otherwise (BR-14)
              const isIso = /^\d{4}-\d{2}-\d{2}$/.test(v);
              handleUpdate(idx, { dateOfBirth: isIso ? v : null });
            }}
            ariaLabel={vi.passengers.dobAriaLabel}
            data-testid="date-of-birth-input"
          />

          <TextField
            label={vi.passengers.phoneLabel}
            type="tel"
            value={pax.phone}
            onChange={(v) => handleUpdate(idx, { phone: v })}
            ariaLabel={vi.passengers.phoneAriaLabel}
            data-testid="phone-input"
          />

          <TextField
            label={vi.passengers.emailLabel}
            type="email"
            value={pax.email}
            onChange={(v) => handleUpdate(idx, { email: v })}
            onBlur={() => handleEmailBlur(idx)}
            ariaLabel={vi.passengers.emailAriaLabel}
            data-testid="email-input"
            error={formErrors[idx]?.emailError ? vi.passengers.emailError : undefined}
          />

          <InlineError
            visible={formErrors[idx]?.requiredError ?? false}
            data-testid="passenger-validation-error"
          >
            {vi.passengers.requiredError}
          </InlineError>
        </div>
      ))}

      {state.passengerError && (
        <AlertNote visible tone="error" data-testid="passenger-submit-error">
          {state.passengerError}
        </AlertNote>
      )}

      <Button
        variant="primary"
        ariaLabel={vi.passengers.continueLabel}
        data-testid="submit-button"
        onClick={handleSubmit}
        disabled={loading || expired}
        fullWidth
      >
        {loading ? vi.common.loading : vi.passengers.continueButton}
      </Button>
    </div>
  );
};
