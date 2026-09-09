import React from 'react';
import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId } from '../types';
import type { NavigationState } from '../App';

interface PassengerCountScreenProps {
  navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void;
}

function Counter({
  value,
  min,
  max,
  onChange,
  ariaLabel,
  testId,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  ariaLabel: string;
  testId: string;
}) {
  return (
    <div className="flex items-center gap-3" data-testid={testId}>
      <button
        className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-lg font-bold disabled:opacity-30"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        aria-label={`Decrease ${ariaLabel}`}
      >
        -
      </button>
      <span className="w-6 text-center font-semibold text-sm" aria-live="polite">{value}</span>
      <button
        className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-lg font-bold disabled:opacity-30"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`Increase ${ariaLabel}`}
      >
        +
      </button>
    </div>
  );
}

export function PassengerCountScreen({ navigate }: PassengerCountScreenProps) {
  const t = useT();
  const state = useAppState();
  const dispatch = useAppDispatch();

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-lg z-50 p-6" aria-label={t.passengerCount.heading}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">{t.passengerCount.heading}</h1>
        <button
          className="w-8 h-8 flex items-center justify-center text-gray-500 text-xl"
          onClick={() => navigate('search')}
          aria-label={t.passengerCount.close}
          data-testid="close-passenger-count"
        >
          &#10005;
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">{t.passengerCount.adults}</span>
          <Counter
            value={state.adults}
            min={1}
            max={4}
            onChange={(v) => dispatch({ type: 'SET_ADULTS', payload: v })}
            ariaLabel={t.passengerCount.adults}
            testId="adults-counter"
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">{t.passengerCount.children}</span>
          <Counter
            value={state.children}
            min={0}
            max={4}
            onChange={(v) => dispatch({ type: 'SET_CHILDREN', payload: v })}
            ariaLabel={t.passengerCount.children}
            testId="children-counter"
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">{t.passengerCount.infants}</span>
          <Counter
            value={state.infants}
            min={0}
            max={state.adults}
            onChange={(v) => dispatch({ type: 'SET_INFANTS', payload: v })}
            ariaLabel={t.passengerCount.infants}
            testId="infants-counter"
          />
        </div>
      </div>
    </div>
  );
}
