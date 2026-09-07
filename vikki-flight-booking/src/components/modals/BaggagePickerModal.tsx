import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Button } from '../ui/Button';
import { Radio } from '../ui/Radio';
import { vi } from '../../i18n/vi';
import type { BaggageOption, BaggageSelection } from '../../types';
import { formatVND } from '../../utils/format';

interface Props {
  open: boolean;
  onClose: () => void;
  options: BaggageOption[];
  currentSelections: BaggageSelection[];
  onConfirm: (selections: BaggageSelection[]) => void;
}

export const BaggagePickerModal: React.FC<Props> = ({
  open,
  onClose,
  options,
  currentSelections,
  onConfirm,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    () => currentSelections[0]?.optionId ?? null,
  );

  React.useEffect(() => {
    if (open) setSelectedId(currentSelections[0]?.optionId ?? null);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = options.find((o) => o.optionId === selectedId);
  const totalCost = selected?.priceAmount ?? 0;

  const handleConfirm = () => {
    const selections: BaggageSelection[] = selected
      ? [{ optionId: selected.optionId, name: selected.name, priceAmount: selected.priceAmount }]
      : [];
    onConfirm(selections);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={vi.services.baggagePickerTitle}
      data-testid="baggage-picker-modal"
    >
      <div className="flex flex-col gap-3 p-4">
        <SegmentedControl
          options={[{ label: vi.services.outboundLeg, value: 'outbound' }]}
          value="outbound"
          ariaLabel={vi.services.legSelector}
          data-testid="leg-tab"
        />

        <span className="text-sm text-[var(--color-text-secondary)]">
          {vi.services.oversizeBaggage}
        </span>

        {options.map((opt) => (
          <div
            key={opt.optionId}
            className="flex flex-col gap-1 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">{opt.name}</span>
              <span className="text-sm text-[var(--color-text-secondary)]">{formatVND(opt.priceAmount)}</span>
            </div>
            <Radio
              label=""
              checked={selectedId === opt.optionId}
              onChange={(checked) => checked && setSelectedId(opt.optionId)}
              ariaLabel={`Chọn ${opt.name}`}
              data-testid="baggage-selection"
              name="baggage"
              value={opt.optionId}
            />
          </div>
        ))}

        {/* No extra baggage option */}
        <div className="flex flex-col gap-1 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">{vi.services.noExtraBaggage}</span>
          <Radio
            label=""
            checked={selectedId === null}
            onChange={(checked) => checked && setSelectedId(null)}
            ariaLabel={vi.services.noExtraBaggage}
            data-testid="no-bag-selection"
            name="baggage"
            value="none"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-primary)]">{vi.services.total}</span>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {totalCost > 0 ? formatVND(totalCost) : vi.common.free}
          </span>
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
