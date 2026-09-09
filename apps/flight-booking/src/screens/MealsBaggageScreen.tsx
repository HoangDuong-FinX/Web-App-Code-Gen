import React, { useEffect, useState } from 'react';
import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId, AncillaryOption, AncillarySelection } from '../types';
import type { NavigationState, MealsBaggageMode } from '../App';
import { sdk } from '../sdk';
import { formatPrice } from '../utils';

interface MealsBaggageScreenProps {
  navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void;
  mode: MealsBaggageMode;
}

export function MealsBaggageScreen({ navigate, mode }: MealsBaggageScreenProps) {
  const t = useT();
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [options, setOptions] = useState<AncillaryOption[]>([]);
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLeg, setActiveLeg] = useState<'outbound' | 'return'>('outbound');

  if (!state.outboundSession) {
    navigate('search');
    return null;
  }

  useEffect(() => {
    loadOptions();
  }, [activeLeg]);

  async function loadOptions() {
    setLoading(true);
    setError(null);
    const sessionId = activeLeg === 'outbound'
      ? state.outboundSession!.sessionId
      : state.returnSession?.sessionId ?? state.outboundSession!.sessionId;

    const res = await sdk.http.get<AncillaryOption[]>(
      `/sessions/${sessionId}/ancillary-options`
    );

    if (res.isSuccess && res.data) {
      const filtered = res.data.filter((o) =>
        mode === 'meals' ? o.category === 'meal' : (o.category === 'baggage' || o.category === 'transfer')
      );
      setOptions(filtered);

      const existingSelections = activeLeg === 'outbound' ? state.outboundAncillary : state.returnAncillary;
      const selMap: Record<string, number> = {};
      for (const s of existingSelections) {
        if (filtered.some((o) => o.optionId === s.optionId)) {
          selMap[s.optionId] = s.quantity;
        }
      }
      setSelections(selMap);
    } else {
      setError(t.services.error);
    }
    setLoading(false);
  }

  function updateQuantity(optionId: string, delta: number) {
    setSelections((prev) => {
      const current = prev[optionId] ?? 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[optionId];
        return copy;
      }
      return { ...prev, [optionId]: next };
    });
  }

  function handleDone() {
    const result: AncillarySelection[] = Object.entries(selections)
      .filter(([, qty]) => qty > 0)
      .map(([optionId, quantity]) => {
        const opt = options.find((o) => o.optionId === optionId);
        return {
          optionId,
          name: opt?.name ?? '',
          quantity,
          priceAmount: opt?.priceAmount ?? 0,
        };
      });

    if (activeLeg === 'outbound') {
      dispatch({ type: 'SET_OUTBOUND_ANCILLARY', payload: result });
    } else {
      dispatch({ type: 'SET_RETURN_ANCILLARY', payload: result });
    }
    navigate('services');
  }

  const totalItems = Object.values(selections).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(selections).reduce((sum, [optionId, qty]) => {
    const opt = options.find((o) => o.optionId === optionId);
    return sum + (opt?.priceAmount ?? 0) * qty;
  }, 0);

  const title = mode === 'meals' ? t.mealsBaggage.meals : t.mealsBaggage.baggageTransfer;

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      {state.tripType === 'roundTrip' && (
        <div className="flex gap-2" data-testid="leg-tab-selector">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              activeLeg === 'outbound' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveLeg('outbound')}
            aria-label={t.mealsBaggage.outbound}
            aria-pressed={activeLeg === 'outbound'}
          >
            {t.mealsBaggage.outbound}
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              activeLeg === 'return' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveLeg('return')}
            aria-label={t.mealsBaggage.return}
            aria-pressed={activeLeg === 'return'}
          >
            {t.mealsBaggage.return}
          </button>
        </div>
      )}

      {loading && <p className="text-sm text-gray-500">{t.common.loading}</p>}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
          <button className="text-sm text-red-600 font-medium underline mt-1" onClick={loadOptions} aria-label={t.common.retry}>
            {t.common.retry}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {options.map((opt) => (
            <div key={opt.optionId} className="border border-gray-200 rounded-lg p-3 flex items-center gap-3" data-testid="catalogue-item">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg" data-testid="item-image">
                {mode === 'meals' ? '\uD83C\uDF5C' : '\uD83C\uDF92'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900" data-testid="item-name">{opt.name}</p>
                <p className="text-xs text-gray-500" data-testid="item-price">{formatPrice(opt.priceAmount)}</p>
              </div>
              <div className="flex items-center gap-2" data-testid="quantity-counter">
                <button
                  className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold disabled:opacity-30"
                  disabled={(selections[opt.optionId] ?? 0) <= 0}
                  onClick={() => updateQuantity(opt.optionId, -1)}
                  aria-label={`Decrease ${opt.name}`}
                >
                  -
                </button>
                <span className="w-5 text-center text-sm font-medium">{selections[opt.optionId] ?? 0}</span>
                <button
                  className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold"
                  onClick={() => updateQuantity(opt.optionId, 1)}
                  aria-label={`Increase ${opt.name}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <span className="text-sm font-semibold" data-testid="selection-summary-count">
          {t.mealsBaggage.itemsSelected.replace('{count}', String(totalItems))}
        </span>
        <span className="text-sm font-semibold" data-testid="selection-summary-subtotal">
          {formatPrice(subtotal)}
        </span>
      </div>

      <button
        className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors"
        onClick={handleDone}
        aria-label={t.mealsBaggage.done}
        data-testid="meals-baggage-done"
      >
        {t.mealsBaggage.done}
      </button>
    </div>
  );
}
