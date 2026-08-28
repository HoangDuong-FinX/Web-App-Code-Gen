import React from 'react';

interface TouchableFieldProps {
  label: string;
  value?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export default function TouchableField({ label, value, onClick, ariaLabel }: TouchableFieldProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        padding: '12px 16px',
        borderRadius: 'var(--radius-012)',
        border: '1px solid var(--line-normal)',
        background: 'var(--common-100)',
        textAlign: 'left',
      }}
    >
      <span style={{ fontSize: 12, color: 'var(--label-alternative)' }}>{label}</span>
      {value && <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--label-normal)', marginTop: 2 }}>{value}</span>}
    </button>
  );
}
