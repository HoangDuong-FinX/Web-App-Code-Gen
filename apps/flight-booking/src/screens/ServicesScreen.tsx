import { useState, useEffect } from 'react';
import type { SearchResult, PassengerForm, AncillaryOption, AncillarySelection, SeatSelection } from '../types';
import { t } from '../i18n';
import { formatPrice } from '../formatPrice';
import { useHoldTimer } from '../useHoldTimer';
import { loadAncillaryOptions, writeAncillarySelections, writeSeatSelections } from '../sdk';

interface Props {
  expiresAt: string | null;
  searchResult: SearchResult | null;
  passengerForms: PassengerForm[];
  onOpenSeatSelection: () => void;
  onServicesSaved: (ancillary: AncillarySelection[], seats: SeatSelection[], inboundSeats: SeatSelection[]) => void;
  onAncillaryLoaded: (options: AncillaryOption[]) => void;
  onBack: () => void;
  onHoldExpired: () => void;
}

export function ServicesScreen({
  expiresAt, searchResult, passengerForms,
  onOpenSeatSelection, onServicesSaved, onAncillaryLoaded, onBack, onHoldExpired,
}: Props) {
  const { display: timerDisplay, expired } = useHoldTimer(expiresAt);
  const [options, setOptions] = useState<AncillaryOption[]>([]);
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [catalogueError, setCatalogueError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);

  const sessionId = searchResult?.outbound?.sessionId ?? '';

  useEffect(() => {
    if (expired) onHoldExpired();
  }, [expired, onHoldExpired]);

  useEffect(() => {
    if (!sessionId) return;
    setCatalogueError(false);
    loadAncillaryOptions(sessionId).then((res) => {
      if (res.isSuccess && res.data) {
        setOptions(res.data);
        onAncillaryLoaded(res.data);
      } else {
        setCatalogueError(true);
      }
    });
  }, [sessionId, onAncillaryLoaded]);

  const hasMeals = options.some((o) => o.groupCode === 'MEAL');
  const hasBaggage = options.some((o) => o.groupCode === 'BAGGAGE');

  const updateQty = (optionId: string, delta: number, maxQty: number) => {
    setSelections((prev) => {
      const current = prev[optionId] ?? 0;
      const next = Math.max(0, Math.min(maxQty, current + delta));
      return { ...prev, [optionId]: next };
    });
  };

  const handleContinue = async () => {
    setSaveError(false);
    setSaving(true);

    const ancillarySelections: AncillarySelection[] = Object.entries(selections)
      .filter(([, qty]) => qty > 0)
      .map(([optionId, quantity]) => ({ optionId, quantity }));

    const results = await Promise.all([
      writeAncillarySelections(sessionId, ancillarySelections),
      writeSeatSelections(sessionId, []),
    ]);

    setSaving(false);

    if (results.every((r) => r.isSuccess)) {
      onServicesSaved(ancillarySelections, [], []);
    } else {
      setSaveError(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#F9FBF9] px-4 py-3 flex items-center gap-3">
        <button type="button" aria-label={t('services.back.aria')} className="w-8 h-8 flex items-center justify-center text-xl" onClick={onBack}>
          \u2190
        </button>
        <h1 className="flex-1 text-center text-xl font-medium text-[#191919]">{t('services.title')}</h1>
      </header>

      <p data-testid="hold-timer" aria-live="polite" className="text-sm text-[#E12127] text-center py-2">{timerDisplay}</p>

      <div className="px-4 flex flex-col gap-4 flex-1">
        {/* Service tiles grid */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            data-testid="service-tile-seat"
            aria-label={t('services.seat.aria')}
            className="p-4 rounded-2xl bg-white shadow-[0_5px_10px_rgba(89,27,27,0.05)] text-center"
            onClick={onOpenSeatSelection}
          >
            <span className="text-2xl block">\uD83D\uDCBA</span>
            <span className="text-xs font-medium">{t('services.seat.label')}</span>
          </button>
          <button
            type="button"
            data-testid="service-tile-meal"
            aria-label={t('services.meal.aria')}
            disabled={!hasMeals}
            className="p-4 rounded-2xl bg-white shadow-[0_5px_10px_rgba(89,27,27,0.05)] text-center disabled:opacity-50"
          >
            <span className="text-2xl block">\uD83C\uDF7D\uFE0F</span>
            <span className="text-xs font-medium">{t('services.meal.label')}</span>
          </button>
          <button
            type="button"
            data-testid="service-tile-baggage"
            aria-label={t('services.baggage.aria')}
            disabled={!hasBaggage}
            className="p-4 rounded-2xl bg-white shadow-[0_5px_10px_rgba(89,27,27,0.05)] text-center disabled:opacity-50"
          >
            <span className="text-2xl block">\uD83E\uDDF3</span>
            <span className="text-xs font-medium">{t('services.baggage.label')}</span>
          </button>
        </div>

        {/* Coming soon tiles */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 rounded-2xl bg-white opacity-50 text-center" aria-disabled="true">
              <span className="text-xs text-[#999999]">{t('services.comingSoon')}</span>
            </div>
          ))}
        </div>

        {/* Ancillary items */}
        {options.length > 0 && (
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <div key={opt.optionId} className="flex justify-between items-center py-3 border-b border-[#E6E8E7]">
                <div>
                  <span className="text-sm">{opt.name}</span>
                  <span className="text-sm text-[#E12127] ml-2">{formatPrice(opt.price)}</span>
                </div>
                <div className="flex items-center gap-2" aria-label={t('services.ancillaryQty.aria', { name: opt.name } as Record<string, string>)}>
                  <button
                    type="button"
                    aria-label={`${opt.name} - gi\u1EA3m`}
                    disabled={(selections[opt.optionId] ?? 0) <= 0}
                    className="w-7 h-7 rounded-full border border-[#E6E8E7] flex items-center justify-center text-sm disabled:opacity-30"
                    onClick={() => updateQty(opt.optionId, -1, opt.maxQty)}
                  >
                    \u2212
                  </button>
                  <span className="w-5 text-center text-sm">{selections[opt.optionId] ?? 0}</span>
                  <button
                    type="button"
                    aria-label={`${opt.name} - t\u0103ng`}
                    disabled={(selections[opt.optionId] ?? 0) >= opt.maxQty}
                    className="w-7 h-7 rounded-full border border-[#E6E8E7] flex items-center justify-center text-sm disabled:opacity-30"
                    onClick={() => updateQty(opt.optionId, 1, opt.maxQty)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {catalogueError && (
          <div data-testid="catalogue-error" aria-label={t('services.catalogueError.aria')} className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-[#555555]">{t('services.catalogueError')}</p>
          </div>
        )}
        {saveError && (
          <div data-testid="save-error" aria-label={t('services.saveError.aria')} className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-[#555555]">{t('services.saveError')}</p>
          </div>
        )}
        {expired && (
          <div data-testid="hold-expired-alert" aria-label={t('services.holdExpired.aria')} className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm">{t('services.holdExpired')}</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <button
          type="button"
          data-testid="continue-action"
          aria-label={t('services.continue.aria')}
          disabled={expired || saving}
          className="w-full h-14 bg-[#E12127] text-white rounded-lg text-lg font-medium disabled:opacity-50"
          onClick={handleContinue}
        >
          {saving ? t('common.loading') : t('services.continue')}
        </button>
      </div>
    </div>
  );
}
