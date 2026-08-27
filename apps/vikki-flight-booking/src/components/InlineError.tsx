interface InlineErrorProps {
  visible: boolean;
  children: string;
}

export function InlineError({ visible, children }: InlineErrorProps) {
  if (!visible) return null;
  return (
    <div className="inline-error" role="alert" aria-live="assertive">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 5V8.5M8 10.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span>{children}</span>
    </div>
  );
}

