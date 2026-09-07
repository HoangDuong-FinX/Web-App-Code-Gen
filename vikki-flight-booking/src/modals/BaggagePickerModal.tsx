import React, { useState } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { Radio } from '../components/Radio';
import { t, formatVnd } from '../i18n';
import type { BaggageOption } from '../fixtures/ancillary';
import type { BaggageSelection } from '../types/state';

interface BaggagePickerModalProps {
  baggageOptions: BaggageOption[];
  existingSelection: BaggageSelection | null;
  origin: string;
  destination: string;
  onConfirm: (selection: BaggageSelection | null) => void;
  onClose: () => void;
}

export function BaggagePickerModal({
  baggageOptions,
  existingSelection,
  origin,
  destination,
  onConfirm,
  onClose,
}: BaggagePickerModalProps): React.ReactElement {
  const [selected, setSelected] = useState<string | null>(existingSelection?.optionId ?? null);

  const totalCost = selected
    ? (baggageOptions.find(b => b.optionId === selected)?.priceAmount ?? 0)
    : 0;

  function handleConfirm() {
    if (!selected) { onConfirm(null); return; }
    const opt = baggageOptions.find(b => b.optionId === selected);
    if (!opt) { onConfirm(null); return; }
    onConfirm({ optionId: opt.optionId, name: opt.name, priceAmount: opt.priceAmount });
  }

  return (
    <Modal
      title={t('baggagePicker.title')}
      dismissible
      onClose={onClose}
      data-testid="baggage-picker-modal"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
        <div style={{ font: 'var(--text-body-semibold)', color: 'var(--color-text-secondary)' }}>
          {origin} → {destination}
        </div>
        <Text variant="body">{t('baggagePicker.oversizeNote')}</Text>

        {/* No extra option */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-8)' }}>
          <Text variant="body-semibold">{t('baggagePicker.noExtra')}</Text>
          <Radio
            checked={selected === null}
            onChange={() => setSelected(null)}
            ariaLabel={t('baggagePicker.noExtra.ariaLabel')}
            name="baggage"
            value="none"
            data-testid="no-bag-selection"
          />
        </div>

        {baggageOptions.map(opt => (
          <div
            key={opt.optionId}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '12px',
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius-8)',
              border: selected === opt.optionId ? '1.5px solid var(--color-primary)' : '1.5px solid transparent',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Text variant="body-semibold">{opt.name}</Text>
                <Text variant="body">{formatVnd(opt.priceAmount)}</Text>
              </div>
              <Radio
                checked={selected === opt.optionId}
                onChange={() => setSelected(opt.optionId)}
                ariaLabel={`Chọn ${opt.name}`}
                name="baggage"
                value={opt.optionId}
                data-testid="baggage-selection"
              />
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text variant="body">{t('baggagePicker.total')}</Text>
          <Text variant="body-semibold">{formatVnd(totalCost)}</Text>
        </div>

        <Button
          variant="primary"
          onClick={handleConfirm}
          ariaLabel={t('baggagePicker.confirm.ariaLabel')}
          data-testid="confirm-button"
          fullWidth
        >
          {t('baggagePicker.confirm')}
        </Button>
      </div>
    </Modal>
  );
}
