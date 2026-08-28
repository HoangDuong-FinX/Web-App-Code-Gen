import React from 'react';

interface SpinnerProps {
  visible?: boolean;
  ariaLabel?: string;
}

export default function Spinner({ visible = true, ariaLabel }: SpinnerProps) {
  if (!visible) return null;
  return (
    <div role="status" aria-label={ariaLabel} style={{ display: 'flex', justifyContent: 'center', padding: 'var(--gap-024)' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--fill-normal)', borderTopColor: 'var(--main-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
