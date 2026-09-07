import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Button } from '../ui/Button';
import { AlertNote } from '../ui/AlertNote';
import { vi } from '../../i18n/vi';
import type { SeatOption, PassengerInfo, SeatSelection } from '../../types';

const ZONE_COLORS: Record<string, string> = {
  Front: 'bg-[var(--vikki-vkblue-700)] text-white',
  Premium: 'bg-purple-500 text-white',
  Standard: 'bg-green-500 text-white',
  Relax: 'bg-gray-400 text-white',
};

interface Props {
  open: boolean;
  onClose: () => void;
  seats: SeatOption[];
  passengers: PassengerInfo[];
  currentSelections: SeatSelection[];
  onConfirm: (selections: SeatSelection[]) => void;
}

export const SeatMapModal: React.FC<Props> = ({
  open,
  onClose,
  seats,
  passengers,
  currentSelections,
  onConfirm,
}) => {
  const [selectedPaxIdx, setSelectedPaxIdx] = useState(0);
  const [selections, setSelections] = useState<SeatSelection[]>(currentSelections);

  React.useEffect(() => {
    if (open) setSelections(currentSelections);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const zones = ['Front', 'Premium', 'Standard', 'Relax'] as const;

  const handleSeatClick = (seat: SeatOption) => {
    if (!seat.available || seat.priceAmount === null || seat.priceAmount <= 0) return;
    const pax = passengers[selectedPaxIdx];
    if (!pax) return;
    const paxIndex = pax.passengerIndex;
    const newSelections = selections.filter((s) => s.passengerIndex !== paxIndex);
    newSelections.push({
      passengerIndex: paxIndex,
      seatNumber: seat.seatNumber,
      priceAmount: seat.priceAmount,
    });
    setSelections(newSelections);
  };

  const totalCost = selections.reduce((s, sel) => s + sel.priceAmount, 0);

  const paxOptions = passengers.map((p, i) => ({
    label: `${vi.passengers.guestLabel} ${p.passengerIndex}`,
    value: String(i),
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={vi.services.seatPickerTitle}
      data-testid="seat-map-modal"
    >
      <div className="flex flex-col gap-3 p-4">
        <SegmentedControl
          options={[{ label: vi.services.outboundLeg, value: 'outbound' }]}
          value="outbound"
          ariaLabel={vi.services.legSelector}
          data-testid="leg-tab"
        />

        {paxOptions.length > 1 && (
          <SegmentedControl
            options={paxOptions}
            value={String(selectedPaxIdx)}
            onChange={(v) => setSelectedPaxIdx(parseInt(v, 10))}
            ariaLabel={vi.services.passengerSelector}
            data-testid="passenger-selector-tab"
          />
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {zones.map((zone) => (
            <div key={zone} className="flex items-center gap-1">
              <span className={`w-4 h-4 rounded ${ZONE_COLORS[zone]}`} aria-hidden="true" />
              <span className="text-xs text-[var(--color-text-secondary)]">
                {vi.services[zone.toLowerCase() as 'front' | 'premium' | 'standard' | 'relax']}
              </span>
            </div>
          ))}
        </div>

        {/* Seat grid */}
        <div className="flex flex-col gap-3" data-testid="seat-map-grid">
          {zones.map((zone) => {
            const zoneSeats = seats.filter((s) => s.zone === zone);
            if (zoneSeats.length === 0) return null;
            return (
              <div key={zone}>
                <div className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  {vi.services[zone.toLowerCase() as 'front' | 'premium' | 'standard' | 'relax']}
                </div>
                <div className="flex flex-wrap gap-1">
                  {zoneSeats.map((seat) => {
                    const isSelected = selections.some((s) => s.seatNumber === seat.seatNumber);
                    const canSelect = seat.available && seat.priceAmount !== null && seat.priceAmount > 0;
                    return (
                      <button
                        key={seat.seatNumber}
                        type="button"
                        disabled={!canSelect}
                        onClick={() => handleSeatClick(seat)}
                        aria-label={`Ghế ${seat.seatNumber}${
                          !seat.available ? ' - ' + vi.services.seatUnavailable : ''
                        }${seat.priceAmount === null ? ' - ' + vi.services.seatNotSelectable : ''}`}
                        aria-pressed={isSelected}
                        className={`w-10 h-10 rounded text-xs font-semibold flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vikki-vkblue-700)] transition-colors ${
                          !seat.available
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : seat.priceAmount === null || seat.priceAmount === 0
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[var(--vikki-vkblue-700)] text-white'
                            : `${ZONE_COLORS[zone]} opacity-80 hover:opacity-100`
                        }`}
                      >
                        {seat.available ? seat.seatNumber : '×'}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-primary)]">{vi.services.total}</span>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {totalCost > 0 ? `${totalCost.toLocaleString('vi-VN')} VND` : vi.services.noSeatSelected}
          </span>
        </div>

        <Button
          variant="primary"
          ariaLabel={vi.services.confirmLabel}
          data-testid="confirm-button"
          onClick={() => onConfirm(selections)}
          fullWidth
        >
          {vi.services.confirm}
        </Button>
      </div>
    </Modal>
  );
};
