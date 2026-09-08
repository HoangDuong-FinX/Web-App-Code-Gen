import React, { useState } from 'react';
import type { AncillaryItem, AncillarySelection } from '../types';
import { t } from '../i18n/vi';
import { formatVND } from '../utils/formatCurrency';

interface AncillaryDetailSheetProps {
  group: 'meal' | 'baggage';
  items: AncillaryItem[];
  outboundSelections: AncillarySelection[];
  returnSelections: AncillarySelection[];
  isRoundTrip: boolean;
  onConfirm: (outbound: AncillarySelection[], returnSel: AncillarySelection[]) => void;
  onClose: () => void;
}

export function AncillaryDetailSheet({
  group,
  items,
  outboundSelections,
  returnSelections,
  isRoundTrip,
  onConfirm,
  onClose,
}: AncillaryDetailSheetProps) {
  const [leg, setLeg] = useState<'outbound' | 'return'>('outbound');
  const [outbound, setOutbound] = useState<AncillarySelection[]>(
    outboundSelections.filter((s) => items.some((i) => i.option_id === s.option_id))
  );
  const [returnSel, setReturnSel] = useState<AncillarySelection[]>(
    returnSelections.filter((s) => items.some((i) => i.option_id === s.option_id))
  );

  const currentSelections = leg === 'outbound' ? outbound : returnSel;
  const setCurrentSelections = leg === 'outbound' ? setOutbound : setReturnSel;

  const getQty = (optionId: string): number => {
    return currentSelections.find((s) => s.option_id === optionId)?.quantity ?? 0;
  };

  const updateQty = (optionId: string, delta: number) => {
    const existing = currentSelections.find((s) => s.option_id === optionId);
    if (existing) {
      const newQty = Math.max(0, existing.quantity + delta);
      if (newQty === 0) {
        setCurrentSelections(currentSelections.filter((s) => s.option_id !== optionId));
      } else {
        setCurrentSelections(
          currentSelections.map((s) =>
            s.option_id === optionId ? { ...s, quantity: newQty } : s
          )
        );
      }
    } else if (delta > 0) {
      setCurrentSelections([...currentSelections, { option_id: optionId, quantity: 1 }]);
    }
  };

  const selectionTotal = currentSelections.reduce((sum, sel) => {
    const item = items.find((i) => i.option_id === sel.option_id);
    return sum + (item ? item.unit_price * sel.quantity : 0);
  }, 0);

  const title = group === 'meal' ? t('services.meals') : t('services.baggage');

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" aria-label={t('ancillary.title')}>
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-2xl bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900" data-testid="modal-title">{title}</h2>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label={t('common.close')}
            data-testid="close-action"
          >
            \u2715
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isRoundTrip && (
            <div className="mb-4 flex rounded-lg bg-gray-100 p-1" aria-label={t('ancillary.legLabel')}>
              <button
                type="button"
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  leg === 'outbound' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
                onClick={() => setLeg('outbound')}
                aria-label={t('ancillary.outbound')}
                data-testid="leg-selector"
              >
                {t('ancillary.outbound')}
              </button>
              <button
                type="button"
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  leg === 'return' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
                onClick={() => setLeg('return')}
                aria-label={t('ancillary.return')}
              >
                {t('ancillary.return')}
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.option_id} className="flex items-center justify-between rounded-lg border border-gray-200 p-2">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-gray-900" data-testid="item-name">{item.name}</span>
                  <span className="text-xs text-gray-500" data-testid="item-description">{item.description}</span>
                  <span className="text-sm text-gray-700" data-testid="item-unit-price">{formatVND(item.unit_price)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-500 disabled:opacity-30"
                    disabled={getQty(item.option_id) <= 0}
                    onClick={() => updateQty(item.option_id, -1)}
                    aria-label={t('ancillary.decreaseQty')}
                    data-testid="decrement-action"
                  >
                    \u2212
                  </button>
                  <span className="w-5 text-center text-sm font-bold" aria-live="polite" data-testid="quantity-display">
                    {getQty(item.option_id)}
                  </span>
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-500"
                    onClick={() => updateQty(item.option_id, 1)}
                    aria-label={t('ancillary.increaseQty')}
                    data-testid="increment-action"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 p-4">
          <span className="font-bold text-gray-900" data-testid="selection-total">{formatVND(selectionTotal)}</span>
          <button
            type="button"
            className="rounded-lg bg-red-500 px-6 py-2 text-sm font-medium text-white hover:bg-red-600"
            onClick={() => onConfirm(outbound, returnSel)}
            aria-label={t('ancillary.confirmLabel')}
            data-testid="confirm-action"
          >
            {t('ancillary.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}