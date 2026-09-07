import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Button } from '../ui/Button';
import { vi } from '../../i18n/vi';
import type { MealOption, MealSelection } from '../../types';
import { formatVND } from '../../utils/format';

interface Props {
  open: boolean;
  onClose: () => void;
  meals: MealOption[];
  currentSelections: MealSelection[];
  onConfirm: (selections: MealSelection[]) => void;
}

export const MealPickerModal: React.FC<Props> = ({
  open,
  onClose,
  meals,
  currentSelections,
  onConfirm,
}) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(currentSelections.map((s) => [s.optionId, s.quantity])),
  );

  React.useEffect(() => {
    if (open) {
      setQuantities(Object.fromEntries(currentSelections.map((s) => [s.optionId, s.quantity])))
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalCost = meals.reduce((s, m) => s + m.priceAmount * (quantities[m.optionId] ?? 0), 0);

  const handleConfirm = () => {
    const selections: MealSelection[] = meals
      .filter((m) => (quantities[m.optionId] ?? 0) > 0)
      .map((m) => ({
        optionId: m.optionId,
        quantity: quantities[m.optionId] ?? 0,
        name: m.name,
        priceAmount: m.priceAmount,
      }));
    onConfirm(selections);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={vi.services.mealPickerTitle}
      data-testid="meal-picker-modal"
    >
      <div className="flex flex-col gap-3 p-4">
        <SegmentedControl
          options={[{ label: vi.services.outboundLeg, value: 'outbound' }]}
          value="outbound"
          ariaLabel={vi.services.legSelector}
          data-testid="leg-tab"
        />

        {meals.map((meal) => (
          <div
            key={meal.optionId}
            className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">{meal.name}</span>
              <span className="text-sm text-[var(--color-text-secondary)]">{formatVND(meal.priceAmount)}</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                ariaLabel={`${vi.services.decrement} ${meal.name}`}
                data-testid="decrement-button"
                onClick={() =>
                  setQuantities((q) => ({ ...q, [meal.optionId]: Math.max(0, (q[meal.optionId] ?? 0) - 1) }))
                }
                disabled={(quantities[meal.optionId] ?? 0) <= 0}
              >
                −
              </Button>
              <span className="text-sm font-semibold w-8 text-center">
                {quantities[meal.optionId] ?? 0}
              </span>
              <Button
                variant="secondary"
                ariaLabel={`${vi.services.increment} ${meal.name}`}
                data-testid="increment-button"
                onClick={() =>
                  setQuantities((q) => ({ ...q, [meal.optionId]: (q[meal.optionId] ?? 0) + 1 }))
                }
              >
                +
              </Button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-primary)]">{vi.services.total}</span>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">{formatVND(totalCost)}</span>
        </div>

        <Button
          variant="primary"
          ariaLabel={vi.services.confirmLabel}
          data-testid="confirm-button"
          onClick={handleConfirm}
          fullWidth
        >
          {vi.services.confirm}
        </Button>
      </div>
    </Modal>
  );
};
