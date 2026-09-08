import React, { useState, useEffect } from 'react';
import type { BookingState, AncillaryItem, ScreenId } from '../types';
import type { BookingAction } from '../App';
import { t } from '../i18n/vi';
import { formatVND } from '../utils/formatCurrency';
import { useHoldTimer } from '../hooks/useHoldTimer';
import { loadAncillariesFixture } from '../fixtures/ancillaries';
import { AncillaryDetailSheet } from '../modals/AncillaryDetailSheet';
import { SeatMapSheet } from '../modals/SeatMapSheet';

interface ServicesScreenProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  expiresAt: string | null;
  onNavigate: (screen: ScreenId) => void;
}

const SERVICE_TILES = [
  { id: 'seat', labelKey: 'services.seat', icon: '\uD83D\uDCBA', active: true, group: null },
  { id: 'meals', labelKey: 'services.meals', icon: '\uD83C\uDF5C', active: true, group: 'meal' as const },
  { id: 'baggage', labelKey: 'services.baggage', icon: '\uD83E\uDDF3', active: true, group: 'baggage' as const },
  { id: 'insurance', labelKey: 'services.insurance', icon: '\uD83D\uDEE1\uFE0F', active: false, group: null },
  { id: 'dutyfree', labelKey: 'services.dutyFree', icon: '\uD83D\uDECD\uFE0F', active: false, group: null },
  { id: 'souvenirs', labelKey: 'services.souvenirs', icon: '\uD83C\uDF81', active: false, group: null },
  { id: 'hotel', labelKey: 'services.hotel', icon: '\uD83C\uDFE8', active: false, group: null },
  { id: 'activities', labelKey: 'services.activities', icon: '\uD83E\uDDED', active: false, group: null },
  { id: 'transfer', labelKey: 'services.transfer', icon: '\uD83D\uDE97', active: false, group: null },
] as const;

export function ServicesScreen({ state, dispatch, expiresAt, onNavigate }: ServicesScreenProps) {
  const { formattedTime, isExpired } = useHoldTimer(expiresAt);
  const [ancillaries, setAncillaries] = useState<AncillaryItem[]>([]);
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAncillary, setShowAncillary] = useState<'meal' | 'baggage' | null>(null);
  const [showSeatMap, setShowSeatMap] = useState(false);

  useEffect(() => {
    loadAncillariesFixture().then(setAncillaries).catch(() => { /* handled inline */ });
  }, []);

  const hasMeals = ancillaries.some((a) => a.group === 'meal');
  const hasBaggage = ancillaries.some((a) => a.group === 'baggage');

  const ancillaryCost = [...state.outboundAncillarySelections, ...state.returnAncillarySelections].reduce((sum, sel) => {
    const item = ancillaries.find((a) => a.option_id === sel.option_id);
    return sum + (item ? item.unit_price * sel.quantity : 0);
  }, 0);

  const seatsCost = (state.outboundSeatSelection?.price ?? 0) + (state.returnSeatSelection?.price ?? 0);

  const handleTileTap = (tileId: string) => {
    if (isExpired) return;
    if (tileId === 'seat') {
      setShowSeatMap(true);
    } else if (tileId === 'meals' && hasMeals) {
      setShowAncillary('meal');
    } else if (tileId === 'baggage' && hasBaggage) {
      setShowAncillary('baggage');
    }
  };

  const handleContinue = async () => {
    if (isExpired) return;
    setSaving(true);
    setSaveError(false);
    try {
      await Promise.resolve();
      onNavigate('payment-review');
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('services.title')}</h1>

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

      <div className="grid grid-cols-3 gap-3">
        {SERVICE_TILES.map((tile) => {
          const isActive = tile.active && (
            tile.id === 'seat' ||
            (tile.id === 'meals' && hasMeals) ||
            (tile.id === 'baggage' && hasBaggage)
          );
          return (
            <button
              key={tile.id}
              type="button"
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors ${
                isActive
                  ? 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                  : 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-50'
              }`}
              disabled={!isActive || isExpired}
              onClick={() => handleTileTap(tile.id)}
              aria-label={t(tile.labelKey)}
              data-testid={`service-tile-${tile.id}`}
            >
              <span className="text-2xl" aria-hidden="true">{tile.icon}</span>
              <span className="text-xs text-gray-700">{t(tile.labelKey)}</span>
              {!tile.active && (
                <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-500">
                  {t('services.comingSoon')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1">
        {ancillaryCost > 0 && (
          <p className="text-sm text-gray-700" data-testid="selected-services-summary">
            {t('services.selectedServices')}: {formatVND(ancillaryCost)}
          </p>
        )}
        {seatsCost > 0 && (
          <p className="text-sm text-gray-700" data-testid="selected-seat-summary">
            {t('services.selectedSeats')}: {formatVND(seatsCost)}
          </p>
        )}
      </div>

      {saveError && (
        <div className="rounded-lg bg-red-50 p-3 text-red-700" aria-label={t('services.saveErrorLabel')} data-testid="save-error-alert">
          <p>{t('services.saveError')}</p>
        </div>
      )}

      <button
        type="button"
        className={`w-full rounded-lg py-3 text-center font-medium text-white transition-colors ${
          !isExpired && !saving ? 'bg-red-500 hover:bg-red-600' : 'cursor-not-allowed bg-gray-300'
        }`}
        disabled={isExpired || saving}
        onClick={handleContinue}
        aria-label={t('services.continueLabel')}
        data-testid="continue-action"
      >
        {t('services.continue')}
      </button>

      {showAncillary !== null && (
        <AncillaryDetailSheet
          group={showAncillary}
          items={ancillaries.filter((a) => a.group === showAncillary)}
          outboundSelections={state.outboundAncillarySelections}
          returnSelections={state.returnAncillarySelections}
          isRoundTrip={state.tripType === 'round-trip'}
          onConfirm={(outbound, returnSel) => {
            dispatch({ type: 'SET_OUTBOUND_ANCILLARIES', payload: outbound });
            if (state.tripType === 'round-trip') {
              dispatch({ type: 'SET_RETURN_ANCILLARIES', payload: returnSel });
            }
            setShowAncillary(null);
          }}
          onClose={() => setShowAncillary(null)}
        />
      )}

      {showSeatMap && (
        <SeatMapSheet
          isRoundTrip={state.tripType === 'round-trip'}
          outboundSeatSelection={state.outboundSeatSelection}
          returnSeatSelection={state.returnSeatSelection}
          onConfirm={(outbound, returnSel) => {
            dispatch({ type: 'SET_OUTBOUND_SEAT', payload: outbound });
            if (state.tripType === 'round-trip') {
              dispatch({ type: 'SET_RETURN_SEAT', payload: returnSel });
            }
            setShowSeatMap(false);
          }}
          onClose={() => setShowSeatMap(false)}
        />
      )}
    </div>
  );
}