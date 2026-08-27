interface SwapButtonProps {
  onClick: () => void;
  ariaLabel: string;
}

export function SwapButton({ onClick, ariaLabel }: SwapButtonProps) {
  return (
    <button className="swap-btn" onClick={onClick} aria-label={ariaLabel} type="button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 4V20M7 20L3 16M7 20L11 16M17 20V4M17 4L13 8M17 4L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

