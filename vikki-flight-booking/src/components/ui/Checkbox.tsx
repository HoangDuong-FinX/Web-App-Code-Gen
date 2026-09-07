// src/components/ui/Checkbox.tsx
import React from 'react';

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
  'data-testid'?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  ariaLabel,
  'data-testid': testId,
  disabled = false,
}) => {
  const id = `checkbox-${testId ?? label}`;
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="checkbox__input"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        aria-label={ariaLabel}
        data-testid={testId}
      />
      <span className="checkbox__label">{label}</span>
    </label>
  );
};
