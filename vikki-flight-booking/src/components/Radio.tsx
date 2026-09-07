import React from 'react';

interface RadioProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  testId?: string;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  testId,
}) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 rounded-full border-gray-300"
        data-testid={testId}
      />
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
};