import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { vi } from '../../i18n/vi';
import type { PassengerCounts } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  passengers: PassengerCounts;
  onConfirm: (passengers: PassengerCounts) => void;
}

interface CounterRowProps {
  label: string;
  sublabel: string;
  count: number;
  onDecrement: () => void;
  onIncrement: () => void;
  decrementLabel: string;
  incrementLabel: string;
  min?: number;
  max?: number;
}

const CounterRow: React.FC<CounterRowProps> = ({
  label, sublabel, count, onDecrement, onIncrement, decrementLabel, incrementLabel, min = 0, max = 9,
}) => (
  <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
    <div>
      <div className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</div>
      <div className="text-xs text-[var(--color-text-secondary)]">{sublabel}</div>
    </div>
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="secondary"
        ariaLabel={decrementLabel}
        data-testid="decrement-button"
        onClick={onDecrement}
        disabled={count <= min}
      >
        −
      </Button>
      <span className="text-[var(--text-headline)] text-[var(--color-text-primary)] w-8 text-center">
        {count}
      </span>
      <Button
        variant="secondary"
        ariaLabel={incrementLabel}
        data-testid="increment-button"
        onClick={onIncrement}
        disabled={count >= max}
      >
        +
      </Button>
    </div>
  </div>
);

export const PassengerCountModal: React.FC<Props> = ({
  open,
  onClose,
  passengers,
  onConfirm,
}) => {
  const [local, setLocal] = useState<PassengerCounts>(passengers);

  React.useEffect(() => {
    if (open) setLocal(passengers);
  }, [open, passengers]);

  const handleConfirm = () => {
    onConfirm(local);
  };

  return (
    <Modal
      open={open}
      onClose={() => { onConfirm(local); onClose(); }}
      title={vi.passengerCount.title}
      data-testid="passenger-count-modal"
    >
      <div className="flex flex-col gap-4 p-4">
        <p className="text-xs text-[var(--color-text-secondary)]">
          {vi.passengerCount.specialAssistance}
        </p>

        <CounterRow
          label={vi.common.adults}
          sublabel={vi.common.over12}
          count={local.adults}
          onDecrement={() => setLocal((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
          onIncrement={() => setLocal((p) => ({ ...p, adults: Math.min(4, p.adults + 1) }))}
          decrementLabel={vi.passengerCount.decrementAdult}
          incrementLabel={vi.passengerCount.incrementAdult}
          min={1}
          max={4}
        />

        <CounterRow
          label={vi.common.children}
          sublabel={vi.common.age2to12}
          count={local.children}
          onDecrement={() => setLocal((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
          onIncrement={() => setLocal((p) => ({ ...p, children: Math.min(4, p.children + 1) }))}
          decrementLabel={vi.passengerCount.decrementChild}
          incrementLabel={vi.passengerCount.incrementChild}
          min={0}
          max={4}
        />

        <CounterRow
          label={vi.common.infants}
          sublabel={vi.common.under2}
          count={local.infants}
          onDecrement={() => setLocal((p) => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
          onIncrement={() =>
            setLocal((p) => ({
              ...p,
              infants: Math.min(p.adults, p.infants + 1),
            }))
          }
          decrementLabel={vi.passengerCount.decrementInfant}
          incrementLabel={vi.passengerCount.incrementInfant}
          min={0}
          max={local.adults}
        />

        <Button
          variant="primary"
          ariaLabel={vi.passengerCount.confirmLabel}
          data-testid="confirm-button"
          onClick={handleConfirm}
          fullWidth
        >
          {vi.passengerCount.confirm}
        </Button>
      </div>
    </Modal>
  );
};
