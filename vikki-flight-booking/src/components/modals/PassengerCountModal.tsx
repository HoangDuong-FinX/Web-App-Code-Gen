import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';
import { t } from '../../i18n';

interface PassengerCountModalProps {
  open: boolean;
  adults: number;
  children: number;
  infants: number;
  onConfirm: (adults: number, children: number, infants: number) => void;
  onClose: () => void;
}

interface CounterRowProps {
  label: string;
  description: string;
  count: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  max?: number;
  decrementAriaLabel: string;
  incrementAriaLabel: string;
}

function CounterRow({
  label, description, count, onDecrement, onIncrement, min = 0, max = 9,
  decrementAriaLabel, incrementAriaLabel,
}: CounterRowProps) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)]">
      <Text variant="body-semibold" as="span">{label}</Text>
      <Text variant="footnote" as="span">{description}</Text>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="secondary"
          aria-label={decrementAriaLabel}
          data-testid="decrement-button"
          onClick={onDecrement}
          disabled={count <= min}
          className="!px-3 !py-2"
        >
          −
        </Button>
        <Text variant="headline" as="span">{count}</Text>
        <Button
          variant="secondary"
          aria-label={incrementAriaLabel}
          data-testid="increment-button"
          onClick={onIncrement}
          disabled={count >= max}
          className="!px-3 !py-2"
        >
          +
        </Button>
      </div>
    </div>
  );
}

export function PassengerCountModal({
  open, adults, children, infants, onConfirm, onClose,
}: PassengerCountModalProps) {
  const [localAdults, setLocalAdults] = useState(adults);
  const [localChildren, setLocalChildren] = useState(children);
  const [localInfants, setLocalInfants] = useState(infants);

  const handleConfirm = () => {
    onConfirm(localAdults, localChildren, localInfants);
  };

  return (
    <Modal
      title={t('passengerCount.title')}
      open={open}
      onClose={onClose}
      data-testid="passenger-count-modal"
    >
      <div className="flex flex-col gap-3 p-4">
        <Text variant="footnote" as="p">{t('passengerCount.specialHelp')}</Text>
        <CounterRow
          label={t('passengerCount.adults')}
          description={t('passengerCount.adults.desc')}
          count={localAdults}
          onDecrement={() => setLocalAdults(n => Math.max(1, n - 1))}
          onIncrement={() => setLocalAdults(n => Math.min(4, n + 1))}
          min={1} max={4}
          decrementAriaLabel={t('passengerCount.decrement.aria', { type: t('common.adult') })}
          incrementAriaLabel={t('passengerCount.increment.aria', { type: t('common.adult') })}
        />
        <CounterRow
          label={t('passengerCount.children')}
          description={t('passengerCount.children.desc')}
          count={localChildren}
          onDecrement={() => setLocalChildren(n => Math.max(0, n - 1))}
          onIncrement={() => setLocalChildren(n => Math.min(4, n + 1))}
          min={0} max={4}
          decrementAriaLabel={t('passengerCount.decrement.aria', { type: t('common.child') })}
          incrementAriaLabel={t('passengerCount.increment.aria', { type: t('common.child') })}
        />
        <CounterRow
          label={t('passengerCount.infants')}
          description={t('passengerCount.infants.desc')}
          count={localInfants}
          onDecrement={() => setLocalInfants(n => Math.max(0, n - 1))}
          onIncrement={() => setLocalInfants(n => Math.min(localAdults, n + 1))}
          min={0} max={localAdults}
          decrementAriaLabel={t('passengerCount.decrement.aria', { type: t('common.infant') })}
          incrementAriaLabel={t('passengerCount.increment.aria', { type: t('common.infant') })}
        />
        <Button
          variant="primary"
          fullWidth
          aria-label={t('passengerCount.confirm.aria')}
          data-testid="confirm-button"
          onClick={handleConfirm}
        >
          {t('passengerCount.confirm')}
        </Button>
      </div>
    </Modal>
  );
}
