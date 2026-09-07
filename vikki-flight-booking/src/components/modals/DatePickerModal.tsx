import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Calendar } from '../ui/Calendar';
import { t } from '../../i18n';

interface DatePickerModalProps {
  open: boolean;
  mode: 'departure' | 'return';
  departureDate: string;
  returnDate: string;
  tripType: string;
  onConfirm: (departureDate: string, returnDate?: string) => void;
  onClose: () => void;
}

export function DatePickerModal({
  open,
  mode,
  departureDate,
  returnDate,
  tripType,
  onConfirm,
  onClose,
}: DatePickerModalProps) {
  const [activeTab, setActiveTab] = useState<'departure' | 'return'>(mode);
  const [localDep, setLocalDep] = useState(departureDate);
  const [localRet, setLocalRet] = useState(returnDate);

  const today = new Date().toISOString().slice(0, 10);

  const handleConfirm = () => {
    onConfirm(localDep, tripType === 'round-trip' ? localRet : undefined);
  };

  const tabs = [
    { label: t('datePicker.departure'), value: 'departure' },
    ...(tripType === 'round-trip' ? [{ label: t('datePicker.return'), value: 'return' }] : []),
  ];

  return (
    <Modal
      title={t('datePicker.title')}
      open={open}
      onClose={onClose}
      data-testid="date-picker-modal"
    >
      <div className="flex flex-col gap-3 p-4">
        {tripType === 'round-trip' && (
          <SegmentedControl
            options={tabs}
            value={activeTab}
            onChange={v => setActiveTab(v as 'departure' | 'return')}
            aria-label={t('datePicker.title')}
            data-testid="trip-type-tabs"
          />
        )}
        {activeTab === 'departure' ? (
          <Calendar
            selectedDate={localDep}
            onSelect={setLocalDep}
            minDate={today}
            data-testid="calendar-grid"
          />
        ) : (
          <Calendar
            selectedDate={localRet}
            onSelect={setLocalRet}
            minDate={localDep}
            data-testid="calendar-grid"
          />
        )}
        <Button
          variant="primary"
          fullWidth
          aria-label={t('datePicker.confirm.aria')}
          data-testid="confirm-button"
          onClick={handleConfirm}
        >
          {t('datePicker.confirm')}
        </Button>
      </div>
    </Modal>
  );
}
