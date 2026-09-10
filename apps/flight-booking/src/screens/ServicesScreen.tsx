import React, { useState, useEffect, useCallback } from 'react';
import type { TripType, AncillaryOption, AncillarySelection, SeatSelection, PassengerDetail } from '../types';
import { t } from '../i18n/vi';
import { useHoldTimer } from '../hooks/useHoldTimer';
import { loadAncillaryOptions, submitAncillarySelections } from '../fixtures/ancillaryOptions';
import { submitSeatSelections } from '../fixtures/seatOptions';

interface Props {
  tripType: TripType;
  outboundSessionId: string;
  returnSessionId: string | null;
  outboundOfferId: string;
  returnOfferId: string | null;
  outboundAncillaries: AncillarySelection[];
  returnAncillaries: AncillarySelection[];
  outboundSeat: SeatSelection | null;
  returnSeat: SeatSelection | null;
  passengers: PassengerDetail[];
  expiresAt: string | null;
  onAncillariesChange: (dir: 'outbound' | 'return', sels: AncillarySelection[]) => void;
  onSeatChange: (dir: 'outbound' | 'return', seat: SeatSelection | null) => void;
  onNavigateToSeatMap: () => void;
  onContinue: () => void;
  onBack: () => void;
  onExpired: () => void;
  onHoldExpiredSearch: () => void;
}

export function ServicesScreen({ tripType, outboundSessionId, returnSessionId, outboundAncillaries, returnAncillaries, outboundSeat, returnSeat, passengers, expiresAt, onAncillariesChange, onNavigateToSeatMap, onContinue, onBack, onExpired, onHoldExpiredSearch }: Props) {
  const { display, isExpired } = useHoldTimer(expiresAt);
  const [direction, setDirection] = useState<'outbound' | 'return'>('outbound');
  const [options, setOptions] = useState<AncillaryOption[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPicker, setShowPicker] = useState<'meal' | 'baggage' | null>(null);

  useEffect(() => { if (isExpired) onExpired(); }, [isExpired, onExpired]);

  const loadOptions = useCallback(async () => {
    setLoadError(false);
    try {
      const data = await loadAncillaryOptions();
      setOptions(data);
    } catch { setLoadError(true); }
  }, []);

  useEffect(() => { loadOptions(); }, [loadOptions, direction]);

  const currentAncillaries = direction === 'outbound' ? outboundAncillaries : returnAncillaries;
  const currentSeat = direction === 'outbound' ? outboundSeat : returnSeat;

  const handleQuantityChange = (option: AncillaryOption, delta: number) => {
    const existing = currentAncillaries.find((s) => s.optionId === option.optionId);
    const currentQty = existing?.quantity ?? 0;
    const newQty = Math.max(0, currentQty + delta);
    let updated: AncillarySelection[];
    if (newQty === 0) {
      updated = currentAncillaries.filter((s) => s.optionId !== option.optionId);
    } else if (existing) {
      updated = currentAncillaries.map((s) => s.optionId === option.optionId ? { ...s, quantity: newQty } : s);
    } else {
      updated = [...currentAncillaries, { optionId: option.optionId, name: option.name, quantity: newQty, priceAmount: option.priceAmount }];
    }
    onAncillariesChange(direction, updated);
  };

  const handleContinue = async () => {
    if (isExpired) return;
    setSubmitting(true);
    setSaveError(false);
    try {
      const expandSelections = (sels: AncillarySelection[]): Array<{ passengerId: string; optionId: string }> => {
        const result: Array<{ passengerId: string; optionId: string }> = [];
        for (const sel of sels) {
          for (let i = 0; i < sel.quantity; i++) {
            result.push({ passengerId: passengers[0]?.passengerId ?? 'pax_1', optionId: sel.optionId });
          }
        }
        return result;
      };
      const calls: Promise<void>[] = [];
      calls.push(submitAncillarySelections(outboundSessionId, expandSelections(outboundAncillaries)));
      if (outboundSeat) {
        calls.push(submitSeatSelections(outboundSessionId, [{ passengerIndex: 1, seatCode: outboundSeat.seatCode }]));
      }
      if (tripType === 'round-trip' && returnSessionId) {
        calls.push(submitAncillarySelections(returnSessionId, expandSelections(returnAncillaries)));
        if (returnSeat) {
          calls.push(submitSeatSelections(returnSessionId, [{ passengerIndex: 1, seatCode: returnSeat.seatCode }]));
        }
      }
      await Promise.all(calls);
      onContinue();
    } catch { setSaveError(true); } finally { setSubmitting(false); }
  };

  const formatPrice = (amount: number): string => amount.toLocaleString('vi-VN') + ' ' + t('common.currency');

  const disabledTiles = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center px-4 py-3 bg-[#F9FBF9]">
        <button type="button" className="w-10 h-10 flex items-center justify-center text-[#1A1A1A]" aria-label={t('services.back')} data-testid="back-action" onClick={onBack}>\u2190</button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[#1A1A1A]">{t('services.title')}</h1>
        <span className="text-sm font-semibold text-[#E12127]" aria-label={t('results.holdTimer.aria')} data-testid="hold-timer-display">{display}</span>
      </header>

      {tripType === 'round-trip' && (
        <div className="flex mx-4 mb-2 rounded-lg overflow-hidden border border-[#E6E8E7]" data-testid="direction-selector">
          <button type="button" className={`flex-1 py-2 text-sm font-semibold text-center ${direction === 'outbound' ? 'bg-[#E12127] text-white' : 'bg-white text-[#1A1A1A]'}`} aria-label={t('services.direction.outbound')} aria-pressed={direction === 'outbound'} onClick={() => setDirection('outbound')}>{t('services.direction.outbound')}</button>
          <button type="button" className={`flex-1 py-2 text-sm font-semibold text-center ${direction === 'return' ? 'bg-[#E12127] text-white' : 'bg-white text-[#1A1A1A]'}`} aria-label={t('services.direction.return')} aria-pressed={direction === 'return'} onClick={() => setDirection('return')}>{t('services.direction.return')}</button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 px-4 py-4">
        <button type="button" className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-[0px_5px_10px_rgba(89,27,27,0.05)] hover:bg-gray-50" aria-label={t('services.tile.seats')} data-testid="service-tile-seats" onClick={onNavigateToSeatMap}>
          <span className="text-2xl mb-1">\u1F4BA</span>
          <span className="text-sm font-semibold">{t('services.tile.seats')}</span>
          {currentSeat && <span className="text-xs text-[#E12127] mt-1">{currentSeat.seatCode}</span>}
        </button>
        <button type="button" className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-[0px_5px_10px_rgba(89,27,27,0.05)] hover:bg-gray-50" aria-label={t('services.tile.meals')} data-testid="service-tile-meals" onClick={() => setShowPicker('meal')}>
          <span className="text-2xl mb-1">\u1F35C</span>
          <span className="text-sm font-semibold">{t('services.tile.meals')}</span>
        </button>
        <button type="button" className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-[0px_5px_10px_rgba(89,27,27,0.05)] hover:bg-gray-50" aria-label={t('services.tile.baggage')} data-testid="service-tile-baggage" onClick={() => setShowPicker('baggage')}>
          <span className="text-2xl mb-1">\u1F9F3</span>
          <span className="text-sm font-semibold">{t('services.tile.baggage')}</span>
        </button>
        {disabledTiles.map((i) => (
          <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-2xl opacity-50" data-testid="service-tile-disabled">
            <span className="text-2xl mb-1">\u2B50</span>
            <span className="text-sm font-semibold text-[#6B7280]">{t('services.tile.comingSoon')}</span>
            <span className="text-xs text-[#9CA3AF] mt-1">{t('services.tile.comingSoon')}</span>
          </div>
        ))}
      </div>

      {currentAncillaries.length > 0 && (
        <div className="px-4 pb-4">
          <h2 className="font-semibold text-base mb-2" data-testid="selected-services-summary-title">{t('services.selectedTitle')}</h2>
          {currentAncillaries.map((sel) => (
            <div key={sel.optionId} className="flex justify-between py-1">
              <span data-testid="service-name">{sel.name}</span>
              <span data-testid="service-quantity">x{sel.quantity}</span>
              <span className="font-semibold" data-testid="service-price">{formatPrice(sel.priceAmount * sel.quantity)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto p-4">
        <button type="button" className={`w-full h-14 rounded-lg text-white font-semibold text-base transition-colors ${!submitting && !isExpired ? 'bg-[#E12127] hover:bg-[#c91d22]' : 'bg-gray-300 cursor-not-allowed'}`} disabled={submitting || isExpired} aria-label={t('services.continue.aria')} data-testid="services-continue" onClick={handleContinue}>
          {submitting ? t('common.loading') : t('services.continue')}
        </button>
      </div>

      {saveError && (<div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" data-testid="services-save-error-message"><p className="text-sm text-red-700">{t('services.saveError')}</p></div>)}
      {isExpired && (<div className="mx-4 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg" role="alert" data-testid="hold-expired-message"><p className="text-sm text-yellow-700">{t('services.holdExpired')}</p><button type="button" className="text-sm text-[#E12127] font-semibold mt-1" onClick={onHoldExpiredSearch} aria-label={t('passengers.searchAgain')}>{t('passengers.searchAgain')}</button></div>)}

      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-[480px] rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto" role="dialog" aria-label={t('services.ancillaryPicker.title')}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('services.ancillaryPicker.title')}</h3>
              <button type="button" className="text-[#6B7280] text-2xl" onClick={() => setShowPicker(null)} aria-label={t('common.close')}>\u00D7</button>
            </div>
            {options.filter((o) => o.category === showPicker).map((option) => {
              const sel = currentAncillaries.find((s) => s.optionId === option.optionId);
              const qty = sel?.quantity ?? 0;
              return (
                <div key={option.optionId} className="flex justify-between items-center py-3 border-b border-[#E6E8E7]">
                  <div>
                    <p className="font-semibold">{option.name}</p>
                    <p className="text-sm text-[#E12127]">{formatPrice(option.priceAmount)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" className="w-8 h-8 rounded-full border border-[#E6E8E7] flex items-center justify-center disabled:opacity-30" disabled={qty <= 0} aria-label={`${option.name} gi\u1EA3m`} onClick={() => handleQuantityChange(option, -1)}>\u2212</button>
                    <span className="w-8 text-center font-semibold">{qty}</span>
                    <button type="button" className="w-8 h-8 rounded-full border border-[#E6E8E7] flex items-center justify-center" aria-label={`${option.name} t\u0103ng`} onClick={() => handleQuantityChange(option, 1)}>+</button>
                  </div>
                </div>
              );
            })}
            <button type="button" className="w-full mt-4 h-12 bg-[#E12127] text-white rounded-lg font-semibold" aria-label={t('services.ancillaryPicker.confirm')} onClick={() => setShowPicker(null)}>{t('services.ancillaryPicker.confirm')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
