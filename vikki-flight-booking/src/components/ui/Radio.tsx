import React from 'react';

interface RadioProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
  'data-testid'?: string;
  name?: string;
  value?: string;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  checked = false,
  onChange,
  ariaLabel,
  'data-testid': testId,
  name,
  value,
}) => {
  const id = React.useId();
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer text-sm">
      <input
        id={id}
        type="radio"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-label={ariaLabel ?? label}
        data-testid={testId}
        name={name}
        value={value}
        className="w-4 h-4 accent-[var(--vikki-vkblue-700)] focus-visible:ring-2 focus-visible:ring-[var(--vikki-vkblue-700)]"
      />
      {label && <span>{label}</span>}
    </label>
  );
};
