import React, { useState } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { t, formatVnd } from '../i18n';
import type { MealOption } from '../fixtures/ancillary';
import type { MealSelection } from '../types/state';

interface MealPickerModalProps {
  mealOptions: MealOption[];
  existingSelections: MealSelection[];
  origin: string;
  destination: string;
  onConfirm: (selections: MealSelection[]) => void;
  onClose: () => void;
}

export function MealPickerModal({
  mealOptions,
  existingSelections,
  origin,
  destination,
  onConfirm,
  onClose,
}: MealPickerModalProps): React.ReactElement {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    existingSelections.forEach(s => { init[s.optionId] = s.quantity; });
    return init;
  });

  function setQty(optionId: string, delta: number) {
    setQuantities(prev => ({ ...prev, [optionId]: Math.max(0, (prev[optionId] ?? 0) + delta) }));
  }

  const total = mealOptions.reduce((sum, m) => sum + (quantities[m.optionId] ?? 0) * m.priceAmount, 0);

  function handleConfirm() {
    const selections: MealSelection[] = mealOptions
      .filter(m => (quantities[m.optionId] ?? 0) > 0)
      .map(m => ({ optionId: m.optionId, name: m.name, priceAmount: m.priceAmount, quantity: quantities[m.optionId] }));
    onConfirm(selections);
  }

  return (
    <Modal
      title={t('mealPicker.title')}
      dismissible
      onClose={onClose}
      data-testid="meal-picker-modal"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
        <div style={{ font: 'var(--text-body-semibold)', color: 'var(--color-text-secondary)' }}>
          {origin} → {destination}
        </div>

        {mealOptions.map(meal => (
          <div
            key={meal.optionId}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px',
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius-8)',
            }}
          >
            <Text variant="body-semibold">{meal.name}</Text>
            <Text variant="body">{formatVnd(meal.priceAmount)}</Text>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                variant="secondary"
                onClick={() => setQty(meal.optionId, -1)}
                disabled={(quantities[meal.optionId] ?? 0) === 0}
                ariaLabel={t('mealPicker.decrement.ariaLabel')}
                data-testid="decrement-button"
                style={{ minWidth: '40px', padding: '8px 12px' }}
              >
                −
              </Button>
              <Text variant="body" style={{ minWidth: '24px', textAlign: 'center' }}>
                {quantities[meal.optionId] ?? 0}
              </Text>
              <Button
                variant="secondary"
                onClick={() => setQty(meal.optionId, 1)}
                ariaLabel={t('mealPicker.increment.ariaLabel')}
                data-testid="increment-button"
                style={{ minWidth: '40px', padding: '8px 12px' }}
              >
                +
              </Button>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text variant="body">{t('mealPicker.total')}</Text>
          <Text variant="body-semibold">{formatVnd(total)}</Text>
        </div>

        <Button
          variant="primary"
          onClick={handleConfirm}
          ariaLabel={t('mealPicker.confirm.ariaLabel')}
          data-testid="confirm-button"
          fullWidth
        >
          {t('mealPicker.confirm')}
        </Button>
      </div>
    </Modal>
  );
}
