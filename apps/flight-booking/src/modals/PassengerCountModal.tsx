import React, { useState } from 'react';
import { t } from '../i18n/vi';

interface PassengerCountModalProps {
  adults: number;
  childCount: number;
  infants: number;
  onConfirm: (adults: number, children: number, infants: number) => void;
  onClose: () => void;
}

export function PassengerCountModal({ adults, childCount, infants, onConfirm, onClose }: PassengerCountModalProps) {
  const [a, setA] = useState(adults);
  const [c, setC] = useState(childCount);
  const [inf, setInf] = useState(infants);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" aria-label={t('passengerCount.title')}>
      <div className="w-full max-w-lg rounded-t-2xl bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('passengerCount.title')}</h2>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label={t('passengerCount.close')}
            data-testid="close-action"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">{t('passengerCount.adult')}</span>
              <span className="text-xs text-gray-500">{t('passengerCount.adultAge')}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 disabled:opacity-30"
                disabled={a <= 1}
                onClick={() => setA((v) => Math.max(1, v - 1))}
                aria-label={t('passengerCount.decreaseAdult')}
                data-testid="adult-decrement"
              >
                −
              </button>
              <span className="w-6 text-center font-bold" aria-live="polite" data-testid="adult-count-display">{a}</span>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 disabled:opacity-30"
                disabled={a >= 4}
                onClick={() => setA((v) => Math.min(4, v + 1))}
                aria-label={t('passengerCount.increaseAdult')}
                data-testid="adult-increment"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">{t('passengerCount.child')}</span>
              <span className="text-xs text-gray-500">{t('passengerCount.childAge')}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 disabled:opacity-30"
                disabled={c <= 0}
                onClick={() => setC((v) => Math.max(0, v - 1))}
                aria-label={t('passengerCount.decreaseChild')}
                data-testid="child-decrement"
              >
                −
              </button>
              <span className="w-6 text-center font-bold" aria-live="polite" data-testid="child-count-display">{c}</span>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 disabled:opacity-30"
                disabled={c >= 4}
                onClick={() => setC((v) => Math.min(4, v + 1))}
                aria-label={t('passengerCount.increaseChild')}
                data-testid="child-increment"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">{t('passengerCount.infant')}</span>
              <span className="text-xs text-gray-500">{t('passengerCount.infantAge')}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 disabled:opacity-30"
                disabled={inf <= 0}
                onClick={() => setInf((v) => Math.max(0, v - 1))}
                aria-label={t('passengerCount.decreaseInfant')}
                data-testid="infant-decrement"
              >
                −
              </button>
              <span className="w-6 text-center font-bold" aria-live="polite" data-testid="infant-count-display">{inf}</span>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 disabled:opacity-30"
                disabled={inf >= a}
                onClick={() => setInf((v) => Math.min(a, v + 1))}
                aria-label={t('passengerCount.increaseInfant')}
                data-testid="infant-increment"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            className="w-full rounded-lg bg-red-500 py-3 text-center font-medium text-white hover:bg-red-600"
            onClick={() => onConfirm(a, c, inf)}
            aria-label={t('passengerCount.confirmLabel')}
            data-testid="confirm-action"
          >
            {t('passengerCount.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}