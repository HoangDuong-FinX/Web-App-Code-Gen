import { useState, useEffect } from 'react';
import type { SearchCriteria, PassengerForm } from '../types';
import { t } from '../i18n';
import { useHoldTimer } from '../useHoldTimer';
import { submitPassengers } from '../sdk';

interface Props {
  expiresAt: string | null;
  criteria: SearchCriteria;
  sessionId: string;
  onSubmitted: (forms: PassengerForm[]) => void;
  onBack: () => void;
  onHoldExpired: () => void;
}

function createEmptyForms(criteria: SearchCriteria): PassengerForm[] {
  const forms: PassengerForm[] = [];
  for (let i = 0; i < criteria.passengers.adults; i++) {
    forms.push({ passengerType: 'adult', lastName: '', firstMiddleName: '', gender: 'male', dob: '', phone: '', email: '' });
  }
  for (let i = 0; i < criteria.passengers.children; i++) {
    forms.push({ passengerType: 'child', lastName: '', firstMiddleName: '', gender: 'male', dob: '', phone: '', email: '' });
  }
  for (let i = 0; i < criteria.passengers.infants; i++) {
    forms.push({ passengerType: 'infant', lastName: '', firstMiddleName: '', gender: 'male', dob: '', phone: '', email: '' });
  }
  return forms;
}

export function PassengersScreen({ expiresAt, criteria, sessionId, onSubmitted, onBack, onHoldExpired }: Props) {
  const { display: timerDisplay, expired } = useHoldTimer(expiresAt);
  const [forms, setForms] = useState<PassengerForm[]>(() => createEmptyForms(criteria));
  const [iAmPassenger, setIAmPassenger] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (expired) onHoldExpired();
  }, [expired, onHoldExpired]);

  const updateForm = (index: number, field: keyof PassengerForm, value: string) => {
    setForms((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const validate = (): boolean => {
    for (let i = 0; i < forms.length; i++) {
      const f = forms[i];
      if (!f.lastName.trim() || !f.firstMiddleName.trim()) {
        setValidationError(t('passengers.passengerHeading', { i: String(i + 1), type: getTypeLabel(f.passengerType) }) + ': ' + t('passengers.lastName.label') + ' / ' + t('passengers.firstMiddleName.label'));
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'adult': return t('passengers.type.adult');
      case 'child': return t('passengers.type.child');
      case 'infant': return t('passengers.type.infant');
      default: return type;
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitError(false);
    setSubmitting(true);
    const res = await submitPassengers(sessionId, forms);
    setSubmitting(false);
    if (res.isSuccess) {
      onSubmitted(forms);
    } else {
      setSubmitError(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#F9FBF9] px-4 py-3 flex items-center gap-3">
        <button type="button" aria-label={t('passengers.back.aria')} className="w-8 h-8 flex items-center justify-center text-xl" onClick={onBack}>
          \u2190
        </button>
        <h1 className="flex-1 text-center text-xl font-medium text-[#191919]">{t('passengers.title')}</h1>
      </header>

      <p data-testid="hold-timer" aria-live="polite" className="text-sm text-[#E12127] text-center py-2">{timerDisplay}</p>

      <div className="px-4 flex flex-col gap-4 flex-1">
        {/* I am passenger toggle */}
        <label className="flex items-center gap-3 cursor-pointer" data-testid="i-am-passenger-toggle">
          <input
            type="checkbox"
            checked={iAmPassenger}
            onChange={(e) => setIAmPassenger(e.target.checked)}
            className="w-5 h-5 accent-[#E12127]"
            aria-label={t('passengers.iAmPassenger.aria')}
          />
          <span className="text-sm font-medium text-[#191919]">{t('passengers.iAmPassenger')}</span>
        </label>

        {/* Passenger forms */}
        {forms.map((form, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 shadow-[0_5px_10px_rgba(89,27,27,0.05)] flex flex-col gap-3">
            <h3 className="text-base font-semibold text-[#191919]">
              {t('passengers.passengerHeading', { i: String(idx + 1), type: getTypeLabel(form.passengerType) })}
            </h3>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#999999]">{t('passengers.lastName.label')}</label>
              <input
                type="text"
                data-testid="last-name-input"
                aria-label={t('passengers.lastName.aria', { i: String(idx + 1) })}
                required
                className="border border-[#E6E8E7] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E12127]"
                value={form.lastName}
                onChange={(e) => updateForm(idx, 'lastName', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#999999]">{t('passengers.firstMiddleName.label')}</label>
              <input
                type="text"
                data-testid="first-middle-name-input"
                aria-label={t('passengers.firstMiddleName.aria', { i: String(idx + 1) })}
                required
                className="border border-[#E6E8E7] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E12127]"
                value={form.firstMiddleName}
                onChange={(e) => updateForm(idx, 'firstMiddleName', e.target.value)}
              />
            </div>
            <div className="flex rounded-full border border-[#E6E8E7] overflow-hidden">
              <button
                type="button"
                aria-label={t('passengers.gender.aria', { i: String(idx + 1) })}
                data-testid="gender-selector"
                className={`flex-1 py-2 text-sm font-medium ${form.gender === 'male' ? 'bg-[#E12127] text-white' : 'text-[#999999]'}`}
                onClick={() => updateForm(idx, 'gender', 'male')}
              >
                {t('passengers.gender.male')}
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium ${form.gender === 'female' ? 'bg-[#E12127] text-white' : 'text-[#999999]'}`}
                onClick={() => updateForm(idx, 'gender', 'female')}
              >
                {t('passengers.gender.female')}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#999999]">{t('passengers.dob.label')}</label>
              <input
                type="date"
                data-testid="dob-input"
                aria-label={t('passengers.dob.aria', { i: String(idx + 1) })}
                className="border border-[#E6E8E7] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E12127]"
                value={form.dob}
                onChange={(e) => updateForm(idx, 'dob', e.target.value)}
              />
              <span className="text-xs text-[#999999]">{t('passengers.dob.helper')}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#999999]">{t('passengers.phone.label')}</label>
              <input
                type="tel"
                data-testid="phone-input"
                aria-label={t('passengers.phone.aria', { i: String(idx + 1) })}
                className="border border-[#E6E8E7] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E12127]"
                value={form.phone}
                onChange={(e) => updateForm(idx, 'phone', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#999999]">{t('passengers.email.label')}</label>
              <input
                type="email"
                data-testid="email-input"
                aria-label={t('passengers.email.aria', { i: String(idx + 1) })}
                className="border border-[#E6E8E7] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E12127]"
                value={form.email}
                onChange={(e) => updateForm(idx, 'email', e.target.value)}
              />
            </div>
          </div>
        ))}

        {/* Validation error */}
        {validationError && (
          <div data-testid="validation-error" aria-label={t('passengers.validationError.aria')} className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-[#555555]">{validationError}</p>
          </div>
        )}

        {/* Submit error */}
        {submitError && (
          <div data-testid="submit-error" aria-label={t('passengers.submitError.aria')} className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-[#555555]">{t('passengers.submitError')}</p>
          </div>
        )}

        {/* Hold expired */}
        {expired && (
          <div data-testid="hold-expired-alert" aria-label={t('passengers.holdExpired.aria')} className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm">{t('passengers.holdExpired')}</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <button
          type="button"
          data-testid="continue-action"
          aria-label={t('passengers.continue.aria')}
          disabled={expired || submitting}
          className="w-full h-14 bg-[#E12127] text-white rounded-lg text-lg font-medium disabled:opacity-50"
          onClick={handleSubmit}
        >
          {submitting ? t('common.loading') : t('passengers.continue')}
        </button>
      </div>
    </div>
  );
}
