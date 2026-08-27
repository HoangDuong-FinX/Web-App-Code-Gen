interface TripTypeToggleProps {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export function TripTypeToggle({ options, value, onChange, ariaLabel }: TripTypeToggleProps) {
  return (
    <div className="trip-toggle" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt}
          className={`trip-toggle__option ${value === opt ? 'trip-toggle__option--active' : ''}`}
          role="radio"
          aria-checked={value === opt}
          onClick={() => onChange(opt)}
          type="button"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

