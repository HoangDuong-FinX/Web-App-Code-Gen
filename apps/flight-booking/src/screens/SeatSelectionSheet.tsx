import { useState, useEffect } from 'react';
import type { SearchResult, SeatRow, SeatSelection } from '../types';
import { t } from '../i18n';
import { formatPrice } from '../formatPrice';
import { loadSeatOptions } from '../sdk';

interface Props {
  searchResult: SearchResult | null;
  passengerCount: number;
  existingSelections: SeatSelection[];
  existingInboundSelections: SeatSelection[];
  onConfirm: (outbound: SeatSelection[], inbound: SeatSelection[]) => void;
  onClose: () => void;
}

export function SeatSelectionSheet({
  searchResult, passengerCount, existingSelections, existingInboundSelections,
  onConfirm, onClose,
}: Props) {
  const isRoundTrip = !!searchResult?.inbound;
  const [activeLeg, setActiveLeg] = useState<'outbound' | 'inbound'>('outbound');
  const [seatRows, setSeatRows] = useState<SeatRow[]>([]);
  const [inboundSeatRows, setInboundSeatRows] = useState<SeatRow[]>([]);
  const [outboundSelections, setOutboundSelections] = useState<SeatSelection[]>(existingSelections);
  const [inboundSelectionsState, setInboundSelections] = useState<SeatSelection[]>(existingInboundSelections);
  const [seatmapError, setSeatmapError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeats = async () => {
      setLoading(true);
      setSeatmapError(false);
      const outSession = searchResult?.outbound?.sessionId;
      if (outSession) {
        const res = await loadSeatOptions(outSession);
        if (res.isSuccess && res.data) {
          setSeatRows(res.data);
        } else {
          setSeatmapError(true);
        }
      }
      const inSession = searchResult?.inbound?.sessionId;
      if (inSession) {
        const res = await loadSeatOptions(inSession);
        if (res.isSuccess && res.data) {
          setInboundSeatRows(res.data);
        }
      }
      setLoading(false);
    };
    loadSeats();
  }, [searchResult]);

  const currentRows = activeLeg === 'outbound' ? seatRows : inboundSeatRows;
  const currentSelections = activeLeg === 'outbound' ? outboundSelections : inboundSelectionsState;
  const setCurrentSelections = activeLeg === 'outbound' ? setOutboundSelections : setInboundSelections;

  const toggleSeat = (code: string, price: number) => {
    const existing = currentSelections.find((s) => s.seatCode === code);
    if (existing) {
      setCurrentSelections(currentSelections.filter((s) => s.seatCode !== code));
    } else if (currentSelections.length < passengerCount) {
      setCurrentSelections([...currentSelections, { passengerIndex: currentSelections.length, seatCode: code, price }]);
    }
  };

  const selectedCodes = new Set(currentSelections.map((s) => s.seatCode));

  const getSeatBg = (seat: { code: string; price: number | null; unavailable: boolean; isEmergency: boolean }): string => {
    if (selectedCodes.has(seat.code)) return 'bg-[#E12127] text-white';
    if (seat.unavailable || seat.price === null) return 'bg-[#D9D9D9] cursor-not-allowed';
    if (seat.isEmergency) return 'bg-[#7C7270] text-white hover:bg-[#E12127]/60';
    return 'bg-blue-50 hover:bg-[#E12127]/20';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-[#F9FBF9] w-full max-w-md max-h-[90vh] rounded-t-2xl flex flex-col overflow-hidden"
        aria-label={t('seatSelection.title')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-medium text-[#191919]">{t('seatSelection.title')}</h2>
          <button type="button" aria-label={t('seatSelection.close.aria')} data-testid="close-action" className="w-8 h-8 flex items-center justify-center text-xl" onClick={onClose}>
            \u2715
          </button>
        </div>

        {/* Leg selector */}
        {isRoundTrip && (
          <div className="flex mx-4 rounded-full border border-[#E6E8E7] overflow-hidden mb-2" data-testid="leg-selector" aria-label={t('seatSelection.legSelector.aria')}>
            <button type="button" className={`flex-1 py-2 text-sm font-medium ${activeLeg === 'outbound' ? 'bg-[#E12127] text-white' : 'text-[#999999]'}`} onClick={() => setActiveLeg('outbound')}>
              {t('seatSelection.outbound')}
            </button>
            <button type="button" className={`flex-1 py-2 text-sm font-medium ${activeLeg === 'inbound' ? 'bg-[#E12127] text-white' : 'text-[#999999]'}`} onClick={() => setActiveLeg('inbound')}>
              {t('seatSelection.return')}
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-4 px-4 py-2" aria-label={t('seatSelection.seatMap.aria')}>
          <div className="flex gap-1 items-center">
            <span className="w-3 h-3 rounded-full bg-[#E12127]" />
            <span className="text-sm text-[#555555]">{t('seatSelection.legend.selected')}</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="w-3 h-3 rounded-full bg-[#7C7270]" />
            <span className="text-sm text-[#555555]">{t('seatSelection.legend.emergency')}</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="w-3 h-3 rounded-full bg-[#D9D9D9]" />
            <span className="text-sm text-[#555555]">{t('seatSelection.legend.taken')}</span>
          </div>
        </div>

        {/* Seat map */}
        {loading ? (
          <p className="text-center py-8 text-sm text-[#999999]">{t('common.loading')}</p>
        ) : seatmapError ? (
          <div data-testid="seatmap-error" aria-label={t('seatSelection.seatmapError.aria')} className="mx-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-[#555555]">{t('seatSelection.seatmapError')}</p>
          </div>
        ) : currentRows.length === 0 ? (
          <div data-testid="empty-state" className="p-8 text-center">
            <p className="text-sm text-[#555555]">{t('seatSelection.flightNotOpen')}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4">
            {/* Column headers */}
            <div className="grid grid-cols-[40px_40px_1fr_40px_40px] gap-3 mb-2">
              <span className="text-center text-xs font-medium text-[#999999]">A</span>
              <span className="text-center text-xs font-medium text-[#999999]">B</span>
              <span />
              <span className="text-center text-xs font-medium text-[#999999]">C</span>
              <span className="text-center text-xs font-medium text-[#999999]">D</span>
            </div>
            {currentRows.map((row) => (
              <div key={row.row} className="grid grid-cols-[40px_40px_1fr_40px_40px] gap-3 mb-1">
                {row.seats.slice(0, 2).map((seat) => (
                  <button
                    key={seat.code}
                    type="button"
                    data-testid="seat-cell"
                    aria-label={seat.unavailable || seat.price === null
                      ? t('seatSelection.seat.unavailable.aria', { code: seat.code })
                      : t('seatSelection.seat.aria', { code: seat.code, price: formatPrice(seat.price) })}
                    disabled={seat.unavailable || seat.price === null}
                    className={`w-10 h-10 rounded text-xs font-medium flex items-center justify-center ${getSeatBg(seat)}`}
                    onClick={() => seat.price !== null && toggleSeat(seat.code, seat.price)}
                  >
                    {seat.code}
                  </button>
                ))}
                <span className="flex items-center justify-center text-xs text-[#999999]">{row.row}</span>
                {row.seats.slice(2, 4).map((seat) => (
                  <button
                    key={seat.code}
                    type="button"
                    data-testid="seat-cell"
                    aria-label={seat.unavailable || seat.price === null
                      ? t('seatSelection.seat.unavailable.aria', { code: seat.code })
                      : t('seatSelection.seat.aria', { code: seat.code, price: formatPrice(seat.price) })}
                    disabled={seat.unavailable || seat.price === null}
                    className={`w-10 h-10 rounded text-xs font-medium flex items-center justify-center ${getSeatBg(seat)}`}
                    onClick={() => seat.price !== null && toggleSeat(seat.code, seat.price)}
                  >
                    {seat.code}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Selected summary */}
        {currentSelections.length > 0 && (
          <p data-testid="selected-seat-summary" className="text-base font-medium text-center py-2">
            {currentSelections.map((s) => s.seatCode).join(', ')} - {formatPrice(currentSelections.reduce((sum, s) => sum + s.price, 0))}
          </p>
        )}

        {/* Confirm */}
        <div className="p-4">
          <button
            type="button"
            data-testid="confirm-action"
            aria-label={t('seatSelection.confirm.aria')}
            className="w-full h-14 bg-[#E12127] text-white rounded-lg text-lg font-medium"
            onClick={() => onConfirm(outboundSelections, inboundSelectionsState)}
          >
            {t('seatSelection.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
