import React from 'react';

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  'aria-label'?: string;
  'data-testid'?: string;
  disabled?: boolean;
}

export function Checkbox({
  label,
  checked = false,
  onChange,
  'aria-label': ariaLabel,
  'data-testid': testId,
  disabled,
}: CheckboxProps) {
  const id = testId ?? label;
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer select-none text-[14px] font-normal"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange?.(e.target.checked)}
        aria-label={ariaLabel}
        data-testid={testId}
        disabled={disabled}
        className="w-4 h-4 rounded border-[var(--gray-300)] accent-[var(--vikki-vkblue-500)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--vikki-vkblue-500)]"
      />
      {label}
    </label>
  );
}
