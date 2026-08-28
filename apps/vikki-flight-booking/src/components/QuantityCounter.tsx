import React from 'react';

interface QuantityCounterProps {
  value: number;
  min?: number;
  max?: number;
  ariaLabel: string;
  onChange: (newValue: number) => void;
}

export const QuantityCounter: React.FC<QuantityCounterProps> = ({ value, min = 0, max = 10, ariaLabel, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} role="group" aria-label={ariaLabel}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          cursor: value <= min ? 'not-allowed' : 'pointer',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        −
      </button>
      <span style={{ minWidth: 20, textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          cursor: value >= max ? 'not-allowed' : 'pointer',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        +
      </button>
    </div>
  );
};
