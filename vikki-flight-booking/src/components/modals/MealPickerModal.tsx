import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';
import { t } from '../../i18n';
import type { MealOption } from '../../types/state';

interface MealPickerModalProps {
  open: boolean;
  meals: MealOption[];
  quantities: Record<string, number>;
  onConfirm: (quantities: Record<string, number>) => void;
  onClose: () => void;
}

export function MealPickerModal({ open, meals, quantities: initial, onConfirm, onClose }: MealPickerModalProps) {
  const [qty, setQty] = useState<Record<string, number>>(initial);

  const totalPrice = meals.reduce((sum, meal) => {
    return sum + (qty[meal.optionId] ?? 0) * meal.priceAmount;
  }, 0);

  const handleConfirm = () => onConfirm(qty);

  return (
    <Modal
      title={t('mealPicker.title')}
      open={open}
      onClose={onClose}
      data-testid="meal-picker-modal"
    >
      <div className="flex flex-col gap-3 p-4">
        {meals.map(meal => (
          <div key={meal.optionId} className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)]">
            <Text variant="body-semibold" as="span">{meal.name}</Text>
            <Text variant="body" as="span">{meal.priceAmount.toLocaleString('vi-VN')} VND</Text>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                aria-label={t('mealPicker.decrement.aria')}
                data-testid="decrement-button"
                onClick={() => setQty(q => ({ ...q, [meal.optionId]: Math.max(0, (q[meal.optionId] ?? 0) - 1) }))}
                disabled={(qty[meal.optionId] ?? 0) <= 0}
                className="!px-3 !py-2"
              >
                −
              </Button>
              <Text variant="body" as="span">{qty[meal.optionId] ?? 0}</Text>
              <Button
                variant="secondary"
                aria-label={t('mealPicker.increment.aria')}
                data-testid="increment-button"
                onClick={() => setQty(q => ({ ...q, [meal.optionId]: (q[meal.optionId] ?? 0) + 1 }))}
                className="!px-3 !py-2"
              >
                +
              </Button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center">
          <Text variant="body" as="span">{t('mealPicker.total')}</Text>
          <Text variant="body-semibold" as="span">{totalPrice.toLocaleString('vi-VN')} VND</Text>
        </div>

        <Button
          variant="primary"
          fullWidth
          aria-label={t('mealPicker.continue.aria')}
          data-testid="confirm-button"
          onClick={handleConfirm}
        >
          {t('mealPicker.continue')}
        </Button>
      </div>
    </Modal>
  );
}
