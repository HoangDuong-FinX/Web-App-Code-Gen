import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
  required?: boolean;
}

export function Checkbox({ label, checked, onChange, ariaLabel, required = false }: CheckboxProps) {
  return (
    <label className="checkbox" aria-label={ariaLabel}>
      <input
        type="checkbox"
        className="checkbox__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        aria-required={required}
      />
      <span className="checkbox__box" aria-hidden="true">
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span className="checkbox__label">{label}</span>
    </label>
  );
}

