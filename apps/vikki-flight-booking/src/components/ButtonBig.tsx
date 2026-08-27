interface ButtonBigProps {
  children: string;
  variant?: 'Active' | 'Disabled';
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function ButtonBig({ children, variant = 'Active', onClick, ariaLabel, disabled, loading }: ButtonBigProps) {
  const isDisabled = disabled || variant === 'Disabled' || loading;
  return (
    <button
      className={`btn-big ${isDisabled ? 'btn-big--disabled' : 'btn-big--active'}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel ?? children}
      type="button"
    >
      {loading ? <span className="btn-big__spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

