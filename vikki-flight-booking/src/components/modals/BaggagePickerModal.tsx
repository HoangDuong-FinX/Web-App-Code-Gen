import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';
import { Radio } from '../ui/Radio';
import { t } from '../../i18n';
import type { BaggageOption } from '../../types/state';

interface BaggagePickerModalProps {
  open: boolean;
  baggageOptions: BaggageOption[];
  selectedId: string | null;
  onConfirm: (selectedId: string | null) => void;
  onClose: () => void;
}

export function BaggagePickerModal({ open, baggageOptions, selectedId: initialId, onConfirm, onClose }: BaggagePickerModalProps) {
  const [selected, setSelected] = useState<string | null>(initialId);

  const selectedOption = baggageOptions.find(b => b.optionId === selected);
  const totalPrice = selectedOption?.priceAmount ?? 0;

  return (
    <Modal
      title={t('baggagePicker.title')}
      open={open}
      onClose={onClose}
      data-testid="baggage-picker-modal"
    >
      <div className="flex flex-col gap-3 p-4">
        <Text variant="body" as="p">{t('baggagePicker.oversize')}</Text>

        {baggageOptions.map(opt => (
          <div
            key={opt.optionId}
            className="flex flex-col gap-1 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Text variant="body-semibold" as="span">{opt.name}</Text>
                <Text variant="body" as="span">{opt.priceAmount.toLocaleString('vi-VN')} VND</Text>
              </div>
              <Radio
                checked={selected === opt.optionId}
                onChange={() => setSelected(opt.optionId)}
                aria-label={t('baggagePicker.select.aria', { name: opt.name })}
                data-testid="baggage-selection"
                name="baggage"
                value={opt.optionId}
              />
            </div>
          </div>
        ))}

        {/* No extra option */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
          <Text variant="body-semibold" as="span">{t('baggagePicker.noExtra')}</Text>
          <Radio
            checked={selected === null}
            onChange={() => setSelected(null)}
            aria-label={t('baggagePicker.noExtra.aria')}
            data-testid="no-bag-selection"
            name="baggage"
            value="none"
          />
        </div>

        <div className="flex justify-between items-center">
          <Text variant="body" as="span">{t('baggagePicker.total')}</Text>
          <Text variant="body-semibold" as="span">{totalPrice.toLocaleString('vi-VN')} VND</Text>
        </div>

        <Button
          variant="primary"
          fullWidth
          aria-label={t('baggagePicker.continue.aria')}
          data-testid="confirm-button"
          onClick={() => onConfirm(selected)}
        >
          {t('baggagePicker.continue')}
        </Button>
      </div>
    </Modal>
  );
}
