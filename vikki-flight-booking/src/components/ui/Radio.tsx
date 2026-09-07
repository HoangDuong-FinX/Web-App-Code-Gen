import React from 'react';

interface RadioProps {
  label?: string;
  checked?: boolean;
  onChange?: () => void;
  'aria-label'?: string;
  'data-testid'?: string;
  name?: string;
  value?: string;
}

export function Radio({
  label,
  checked = false,
  onChange,
  'aria-label': ariaLabel,
  'data-testid': testId,
  name,
  value,
}: RadioProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-[14px]">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        data-testid={testId}
        name={name}
        value={value}
        className="w-4 h-4 accent-[var(--vikki-vkblue-500)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--vikki-vkblue-500)]"
      />
      {label}
    </label>
  );
}
