import React, { useState, useEffect, useCallback } from 'react';
import type { Seat, SeatSelection } from '../types';
import { t } from '../i18n/vi';
import { loadSeatOptions, getSeatTiers } from '../fixtures/seatOptions';

interface Props {
  sessionId: string;
  currentSeat: SeatSelection | null;
  onConfirm: (seat: SeatSelection | null) => void;
  onBack: () => void;
}

export function SeatMapScreen({ currentSeat, onConfirm, onBack }: Props) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<Seat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const tiers = getSeatTiers();

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    setIsEmpty(false);
    try {
      const data = await loadSeatOptions();
      if (data.length === 0) { setIsEmpty(true); }
      else { setSeats(data); }
      if (currentSeat) {
        const found = data.find((s) => s.seatCode === currentSeat.seatCode);
        if (found) setSelected(found);
      }
    } catch { setError(true); } finally { setLoading(false); }
  }, [currentSeat]);

  useEffect(() => { load(); }, [load]);

  const handleSelectSeat = (seat: Seat) => {
    if (!seat.available || seat.priceAmount === null) return;
    setSelected(selected?.seatCode === seat.seatCode ? null : seat);
  };

  const handleConfirm = () => {
    if (selected && selected.priceAmount !== null) {
      onConfirm({ seatCode: selected.seatCode, priceAmount: selected.priceAmount });
    } else {
      onConfirm(null);
    }
  };

  const formatPrice = (amount: number): string => amount.toLocaleString('vi-VN') + ' ' + t('common.currency');

  const rows = Array.from(new Set(seats.map((s) => s.row))).sort((a, b) => a - b);
  const columns = ['A', 'B', 'C', '', 'D', 'E', 'F'];

  const getSeatColor = (seat: Seat): string => {
    if (!seat.available || seat.priceAmount === null) return '#D1D5DB';
    if (selected?.seatCode === seat.seatCode) return '#22C55E';
    const tier = tiers.find((ti) => ti.name === seat.priceTier);
    return tier?.color ?? '#3B82F6';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center px-4 py-3 bg-[#F9FBF9]">
        <button type="button" className="w-10 h-10 flex items-center justify-center text-[#1A1A1A]" aria-label={t('seatMap.back')} data-testid="back-action" onClick={onBack}>\u2190</button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[#1A1A1A]">{t('seatMap.title')}</h1>
      </header>

      {!loading && !error && !isEmpty && (
        <div className="flex flex-wrap gap-4 px-4 py-3">
          {tiers.map((tier) => (
            <div key={tier.name} className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: tier.color }} aria-hidden="true" data-testid="legend-color" />
              <span className="text-xs" data-testid="legend-label">{tier.name}</span>
              <span className="text-xs font-semibold" data-testid="legend-price">{formatPrice(tier.price)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading && <p className="text-center py-8 text-[#6B7280]">{t('common.loading')}</p>}

        {error && (
          <div className="text-center py-8" data-testid="seats-error-message" role="alert">
            <p className="text-red-700 mb-2">{t('seatMap.error')}</p>
            <button type="button" className="text-[#E12127] font-semibold" onClick={load} aria-label={t('seatMap.retry')}>{t('seatMap.retry')}</button>
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-16" data-testid="seats-empty-state">
            <p className="text-lg font-semibold">{t('seatMap.empty.title')}</p>
            <p className="text-sm text-[#6B7280] mt-2">{t('seatMap.empty.description')}</p>
          </div>
        )}

        {!loading && !error && !isEmpty && (
          <div className="flex flex-col items-center gap-1">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-1">
                <span className="w-6 text-xs text-[#6B7280] text-right">{row}</span>
                {columns.map((col, ci) => {
                  if (col === '') return <div key={ci} className="w-6" />;
                  const seat = seats.find((s) => s.row === row && s.column === col);
                  if (!seat) return <div key={ci} className="w-8 h-8" />;
                  return (
                    <button
                      key={seat.seatCode}
                      type="button"
                      className="w-8 h-8 rounded text-xs font-semibold text-white flex items-center justify-center transition-colors"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      disabled={!seat.available || seat.priceAmount === null}
                      aria-label={t('seatMap.seat.aria', { seatCode: seat.seatCode })}
                      data-testid="seat-cell"
                      onClick={() => handleSelectSeat(seat)}
                    >
                      {!seat.available ? '\u00D7' : col}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-white" data-testid="selected-seat-summary">
        <p className="font-semibold text-[#1A1A1A]" aria-label={t('seatMap.noSelection')}>
          {selected && selected.priceAmount !== null
            ? t('seatMap.selectedSeat', { seatCode: selected.seatCode, seatPrice: formatPrice(selected.priceAmount) })
            : t('seatMap.noSelection')}
        </p>
      </div>

      <div className="p-4">
        <button type="button" className="w-full h-14 bg-[#E12127] text-white rounded-lg font-semibold text-base hover:bg-[#c91d22]" aria-label={t('seatMap.confirm.aria')} data-testid="confirm-seat-action" onClick={handleConfirm}>{t('seatMap.confirm')}</button>
      </div>
    </div>
  );
}
