import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';
import { AlertNote } from '../ui/AlertNote';
import { SeatMap } from '../ui/SeatMap';
import { t } from '../../i18n';
import type { SeatOption, SeatSelection, PassengerData } from '../../types/state';

interface SeatMapModalProps {
  open: boolean;
  seats: SeatOption[];
  selectedSeats: string[];
  passengers: PassengerData[];
  onConfirm: (selections: SeatSelection[]) => void;
  onClose: () => void;
}

export function SeatMapModal({
  open, seats, selectedSeats: initialSelected, passengers, onConfirm, onClose,
}: SeatMapModalProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [activePax, setActivePax] = useState(0);

  const handleSeatClick = (seatNumber: string) => {
    setSelected(prev => {
      const next = [...prev];
      // Find if this passenger already has a seat
      const existingIdx = next[activePax] !== undefined ? activePax : -1;
      if (existingIdx >= 0) {
        next[existingIdx] = seatNumber;
      } else {
        next[activePax] = seatNumber;
      }
      return next;
    });
  };

  const totalPrice = selected
    .filter(Boolean)
    .reduce((sum, seatNum) => {
      const seat = seats.find(s => s.seatNumber === seatNum);
      return sum + (seat?.priceAmount ?? 0);
    }, 0);

  const handleConfirm = () => {
    const selections: SeatSelection[] = selected
      .filter(Boolean)
      .map((seatNumber, idx) => ({ passengerIndex: idx + 1, seatNumber }));
    onConfirm(selections);
  };

  const paxOptions = passengers.map((_, i) => ({
    label: `Khách ${i + 1}`,
    value: String(i),
  }));

  return (
    <Modal
      title={t('seatMap.title')}
      open={open}
      onClose={onClose}
      data-testid="seat-map-modal"
    >
      <div className="flex flex-col gap-3 p-4">
        {paxOptions.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {paxOptions.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setActivePax(i)}
                aria-pressed={activePax === i}
                className={`px-3 py-1 rounded-full text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--vikki-vkblue-500)] ${
                  activePax === i
                    ? 'bg-[var(--vikki-vkblue-500)] text-white'
                    : 'bg-[var(--gray-100)] text-[var(--gray-700)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <SeatMap
          seats={seats}
          selectedSeats={selected.filter(Boolean)}
          onSelect={handleSeatClick}
          data-testid="seat-map-grid"
        />

        <div className="flex justify-between items-center pt-2">
          <Text variant="body" as="span">{t('seatMap.total')}</Text>
          <Text variant="body-semibold" as="span">
            {totalPrice.toLocaleString('vi-VN')} VND
          </Text>
        </div>

        <Button
          variant="primary"
          fullWidth
          aria-label={t('seatMap.continue.aria')}
          data-testid="confirm-button"
          onClick={handleConfirm}
        >
          {t('seatMap.continue')}
        </Button>
      </div>
    </Modal>
  );
}
