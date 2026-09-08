import React, { useState, useCallback } from 'react';
import type { BookingState, Traveller, ScreenId } from '../types';
import type { BookingAction } from '../App';
import { t } from '../i18n/vi';
import { useHoldTimer } from '../hooks/useHoldTimer';
import { TravellerDetailSheet } from '../modals/TravellerDetailSheet';

interface PassengersScreenProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  expiresAt: string | null;
  onNavigate: (screen: ScreenId) => void;
}

function createEmptyTravellers(adults: number, childCount: number, infantCount: number): Traveller[] {
  const travellers: Traveller[] = [];
  for (let i = 0; i < adults; i++) {
    travellers.push({ last_name: '', first_middle_name: '', gender: 'Male', date_of_birth: '', phone: '', email: '' });
  }
  for (let i = 0; i < childCount; i++) {
    travellers.push({ last_name: '', first_middle_name: '', gender: 'Male', date_of_birth: '', phone: '', email: '' });
  }
  for (let i = 0; i < infantCount; i++) {
    travellers.push({ last_name: '', first_middle_name: '', gender: 'Male', date_of_birth: '', phone: '', email: '' });
  }
  return travellers;
}

function getTravellerType(index: number, adults: number, childCount: number): string {
  if (index < adults) return t('passengers.adult');
  if (index < adults + childCount) return t('passengers.child');
  return t('passengers.infant');
}

export function PassengersScreen({ state, dispatch, expiresAt, onNavigate }: PassengersScreenProps) {
  const { formattedTime, isExpired } = useHoldTimer(expiresAt);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [iAmPassenger, setIAmPassenger] = useState(false);

  const travellers = state.travellers.length > 0
    ? state.travellers
    : createEmptyTravellers(state.adults, state.children, state.infants);

  if (state.travellers.length === 0 && travellers.length > 0) {
    dispatch({ type: 'SET_TRAVELLERS', payload: travellers });
  }

  const handleIAmPassengerToggle = () => {
    const next = !iAmPassenger;
    setIAmPassenger(next);
    if (next && travellers.length > 0) {
      const updated = [...travellers];
      updated[0] = { ...updated[0], last_name: 'Nguyen', first_middle_name: 'Van A' };
      dispatch({ type: 'SET_TRAVELLERS', payload: updated });
    }
  };

  const handleTravellerUpdate = useCallback(
    (index: number, data: Traveller) => {
      const updated = [...travellers];
      updated[index] = data;
      dispatch({ type: 'SET_TRAVELLERS', payload: updated });
      setEditingIndex(null);
    },
    [travellers, dispatch]
  );

  const validateTravellers = (): number => {
    for (let i = 0; i < travellers.length; i++) {
      const tr = travellers[i];
      if (!tr.last_name.trim() || !tr.first_middle_name.trim()) {
        return i;
      }
      if (tr.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tr.email)) {
        return i;
      }
    }
    return -1;
  };

  const handleSubmit = async () => {
    if (isExpired) return;
    const invalidIdx = validateTravellers();
    if (invalidIdx >= 0) {
      setEditingIndex(invalidIdx);
      return;
    }
    setSubmitting(true);
    setSubmitError(false);
    try {
      const withIds = travellers.map((tr, i) => ({
        ...tr,
        passenger_id: `pax_${i + 1}`,
        date_of_birth: /^\d{4}-\d{2}-\d{2}$/.test(tr.date_of_birth) ? tr.date_of_birth : '',
      }));
      dispatch({ type: 'SET_TRAVELLERS', payload: withIds });
      onNavigate('services');
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('passengers.title')}</h1>

      <p className="text-sm text-gray-500" aria-label={t('common.holdTimerLabel')} data-testid="hold-timer-display">
        {t('common.holdTimerLabel')}: {formattedTime}
      </p>

      {isExpired && (
        <div className="rounded-lg bg-yellow-50 p-3 text-yellow-700" aria-label={t('common.holdExpired')} data-testid="hold-expired-alert">
          <p>{t('common.holdExpired')}</p>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-yellow-700 underline"
            onClick={() => onNavigate('search')}
            aria-label={t('common.backToSearchLabel')}
          >
            {t('common.backToSearch')}
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={iAmPassenger}
            onChange={handleIAmPassengerToggle}
            aria-label={t('passengers.iAmPassengerLabel')}
            data-testid="i-am-passenger-toggle"
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-red-500 peer-checked:after:translate-x-full" />
        </label>
        <span className="text-sm text-gray-700">{t('passengers.iAmPassenger')}</span>
      </div>

      {travellers.map((tr, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-gray-900" data-testid="traveller-label">
              {`${t('passengers.title')} ${idx + 1} - ${getTravellerType(idx, state.adults, state.children)}`}
            </span>
            <span className="text-sm text-gray-500" data-testid="traveller-name-summary">
              {tr.last_name && tr.first_middle_name
                ? `${tr.last_name} ${tr.first_middle_name}`
                : t('passengers.noName')}
            </span>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            onClick={() => setEditingIndex(idx)}
            aria-label={t('passengers.editLabel')}
            data-testid="traveller-edit-action"
          >
            ✏️
          </button>
        </div>
      ))}

      {submitError && (
        <div className="rounded-lg bg-red-50 p-3 text-red-700" aria-label={t('passengers.submitErrorLabel')} data-testid="submit-error-alert">
          <p>{t('passengers.submitError')}</p>
        </div>
      )}

      <button
        type="button"
        className={`w-full rounded-lg py-3 text-center font-medium text-white transition-colors ${
          !isExpired && !submitting ? 'bg-red-500 hover:bg-red-600' : 'cursor-not-allowed bg-gray-300'
        }`}
        disabled={isExpired || submitting}
        onClick={handleSubmit}
        aria-label={t('passengers.continueLabel')}
        data-testid="continue-action"
      >
        {t('passengers.continue')}
      </button>

      {editingIndex !== null && (
        <TravellerDetailSheet
          index={editingIndex}
          traveller={travellers[editingIndex]}
          travellerType={getTravellerType(editingIndex, state.adults, state.children)}
          onConfirm={(data) => handleTravellerUpdate(editingIndex, data)}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </div>
  );
}