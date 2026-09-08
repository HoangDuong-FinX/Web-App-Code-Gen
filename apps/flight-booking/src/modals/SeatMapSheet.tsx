import React, { useState, useEffect, useMemo } from 'react';
import type { Seat, SeatSelection } from '../types';
import { t } from '../i18n/vi';
import { formatVND } from '../utils/formatCurrency';
import { loadSeatsFixture } from '../fixtures/seats';

interface SeatMapSheetProps {
  isRoundTrip: boolean;
  outboundSeatSelection: SeatSelection | null;
  returnSeatSelection: SeatSelection | null;
  onConfirm: (outbound: SeatSelection | null, returnSel: SeatSelection | null) => void;
  onClose: () => void;
}

export function SeatMapSheet({
  isRoundTrip,
  outboundSeatSelection,
  returnSeatSelection,
  onConfirm,
  onClose,
}: SeatMapSheetProps) {
  const [leg, setLeg] = useState<'outbound' | 'return'>('outbound');
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [outSel, setOutSel] = useState<SeatSelection | null>(outboundSeatSelection);
  const [retSel, setRetSel] = useState<SeatSelection | null>(returnSeatSelection);

  const currentSel = leg === 'outbound' ? outSel : retSel;
  const setCurrentSel = leg === 'outbound' ? setOutSel : setRetSel;

  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    loadSeatsFixture()
      .then((data) => {
        setSeats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoadError(true);
        setLoading(false);
      });
  }, []);

  const tierColors: Record<string, string> = {
    premium: 'bg-purple-200 text-purple-800',
    'extra-legroom': 'bg-blue-200 text-blue-800',
    standard: 'bg-green-200 text-green-800',
  };

  const legend = useMemo(() => {
    const tiers = new Set(seats.filter((s) => s.fare_tier).map((s) => s.fare_tier as string));
    return Array.from(tiers).map((tier) => {
      const sample = seats.find((s) => s.fare_tier === tier && s.price_amount !== null);
      return { tier, price: sample?.price_amount ?? 0 };
    });
  }, [seats]);

  const rows = useMemo(() => {
    const rowMap = new Map<number, Seat[]>();
    for (const seat of seats) {
      if (!rowMap.has(seat.row)) rowMap.set(seat.row, []);
      rowMap.get(seat.row)?.push(seat);
    }
    return Array.from(rowMap.entries()).sort(([a], [b]) => a - b);
  }, [seats]);

  const handleSeatClick = (seat: Seat) => {
    if (!seat.available || seat.price_amount === null) return;
    if (currentSel?.seat_id === seat.seat_id) {
      setCurrentSel(null);
    } else {
      setCurrentSel({
        passenger_index: 1,
        seat_id: seat.seat_id,
        seat_label: `${seat.row}${seat.column}`,
        price: seat.price_amount,
      });
    }
  };

  const isEmpty = seats.length === 0 && !loading && !loadError;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" aria-label={t('seatMap.title')}>
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-2xl bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('seatMap.title')}</h2>
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

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-500" />
            </div>
          )}

          {loadError && (
            <div className="rounded-lg bg-red-50 p-3 text-red-700" aria-label={t('seatMap.loadErrorLabel')} data-testid="seats-error-alert">
              <p>{t('seatMap.loadError')}</p>
            </div>
          )}

          {isEmpty && (
            <div className="flex flex-col items-center gap-2 py-8 text-gray-400" aria-label={t('seatMap.noMap')} data-testid="seats-empty-state">
              <p className="text-lg font-medium">{t('seatMap.noMap')}</p>
              <p className="text-sm">{t('seatMap.noMapDesc')}</p>
            </div>
          )}

          {!loading && !loadError && seats.length > 0 && (
            <>
              <div className="mb-3 flex flex-wrap gap-3">
                {legend.map(({ tier, price }) => (
                  <div key={tier} className="flex items-center gap-1">
                    <div
                      className={`h-4 w-4 rounded-sm ${tierColors[tier] ?? 'bg-gray-200'}`}
                      data-testid="legend-color"
                    />
                    <span className="text-xs text-gray-600" data-testid="legend-label">{tier}</span>
                    <span className="text-xs text-gray-500" data-testid="legend-price">{formatVND(price)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                {rows.map(([rowNum, rowSeats]) => (
                  <div key={rowNum} className="flex items-center gap-1">
                    <span className="w-6 text-right text-xs text-gray-400">{rowNum}</span>
                    {rowSeats.map((seat) => {
                      const isSelected = currentSel?.seat_id === seat.seat_id;
                      const colorClass = seat.fare_tier ? (tierColors[seat.fare_tier] ?? 'bg-gray-200') : 'bg-gray-200';
                      return (
                        <button
                          key={seat.seat_id}
                          type="button"
                          className={`flex h-8 w-8 items-center justify-center rounded text-xs transition-colors ${
                            !seat.available
                              ? 'cursor-not-allowed bg-gray-100 text-gray-300'
                              : isSelected
                              ? 'bg-red-500 font-bold text-white ring-2 ring-red-600'
                              : colorClass
                          }`}
                          disabled={!seat.available || seat.price_amount === null}
                          onClick={() => handleSeatClick(seat)}
                          aria-label={`${t('seatMap.seatLabel')} ${seat.row}${seat.column}${!seat.available ? ` ${t('seatMap.unavailable')}` : ''}`}
                          data-testid="seat-cell"
                        >
                          {seat.available ? seat.column : '\u00D7'}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {currentSel && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-gray-900" data-testid="selected-seat-label">
                    {t('seatMap.seatLabel')} {currentSel.seat_label}
                  </span>
                  <span className="font-bold text-gray-900" data-testid="selected-seat-price">
                    {formatVND(currentSel.price)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            className="w-full rounded-lg bg-red-500 py-3 text-center font-medium text-white hover:bg-red-600"
            onClick={() => onConfirm(outSel, retSel)}
            aria-label={t('seatMap.confirmLabel')}
            data-testid="confirm-action"
          >
            {t('seatMap.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}