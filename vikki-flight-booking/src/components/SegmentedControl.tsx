import React from 'react';

interface SegmentedControlOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  label?: string;
  options: SegmentedControlOption[];
  value?: string;
  onChange?: (value: string) => void;
  testId?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  label,
  options,
  value,
  onChange,
  testId,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange?.(opt.value)}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              value === opt.value
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
            data-testid={testId}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};