import React from 'react';
import type { SeatOption } from '../../types/state';
import { t } from '../../i18n';

interface SeatMapProps {
  seats: SeatOption[];
  selectedSeats: string[];
  onSelect: (seatNumber: string) => void;
  'data-testid'?: string;
}

const zoneColors: Record<SeatOption['zone'], string> = {
  Front: 'bg-[var(--vikki-vkblue-500)] text-white',
  Premium: 'bg-[var(--vikki-vkblue-200)] text-[var(--gray-900)]',
  Standard: 'bg-[var(--gray-200)] text-[var(--gray-900)]',
  Relax: 'bg-[var(--gray-100)] text-[var(--gray-500)]',
};

export function SeatMap({ seats, selectedSeats, onSelect, 'data-testid': testId }: SeatMapProps) {
  const rows: Record<string, SeatOption[]> = {};
  seats.forEach(s => {
    const row = s.seatNumber.replace(/[A-Z]/g, '');
    if (!rows[row]) rows[row] = [];
    rows[row].push(s);
  });

  return (
    <div data-testid={testId} className="overflow-x-auto">
      <div className="min-w-[280px]">
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-3">
          {(['Front', 'Premium', 'Standard', 'Relax'] as const).map(zone => (
            <div key={zone} className="flex items-center gap-1">
              <div className={`w-4 h-4 rounded ${zoneColors[zone].split(' ')[0]}`} aria-hidden />
              <span className="text-[11px] text-[var(--gray-600)]">
                {t(`seatMap.zone.${zone.toLowerCase()}` as Parameters<typeof t>[0])}
              </span>
            </div>
          ))}
        </div>
        {/* Seat grid */}
        {Object.entries(rows).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-1 mb-1">
            <span className="text-[11px] text-[var(--gray-400)] w-6 text-right">{row}</span>
            {rowSeats.map(seat => {
              const isSelected = selectedSeats.includes(seat.seatNumber);
              const canSelect = seat.available && seat.priceAmount !== null && seat.priceAmount > 0;
              return (
                <button
                  key={seat.seatNumber}
                  type="button"
                  onClick={() => canSelect && onSelect(seat.seatNumber)}
                  disabled={!canSelect}
                  aria-label={t('seatMap.seat.aria', {
                    number: seat.seatNumber,
                    zone: seat.zone,
                    price: seat.priceAmount ? `${seat.priceAmount.toLocaleString('vi-VN')} VND` : t('seatMap.unavailable'),
                  })}
                  aria-pressed={isSelected}
                  className={`w-8 h-8 rounded text-[11px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--vikki-vkblue-500)] ${
                    isSelected
                      ? 'bg-[var(--vikki-vkblue-500)] text-white'
                      : !seat.available
                      ? 'bg-[var(--gray-200)] text-[var(--gray-400)] cursor-not-allowed'
                      : seat.priceAmount === null
                      ? 'bg-[var(--gray-100)] text-[var(--gray-400)] cursor-not-allowed'
                      : `${zoneColors[seat.zone]} hover:opacity-80 cursor-pointer`
                  }`}
                >
                  {!seat.available ? '×' : seat.seatNumber.replace(/\d+/, '')}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
