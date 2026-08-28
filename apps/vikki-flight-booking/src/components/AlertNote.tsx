import React from 'react';

interface AlertNoteProps {
  children: React.ReactNode;
  variant?: 'error' | 'warning' | 'info';
  visible?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  ariaLabel?: string;
}

const variantColors: Record<string, { bg: string; border: string; text: string }> = {
  error: { bg: 'rgba(230,34,0,0.06)', border: 'var(--status-negative)', text: 'var(--status-negative)' },
  warning: { bg: 'rgba(255,138,0,0.06)', border: 'var(--status-cautionary)', text: 'var(--status-cautionary)' },
  info: { bg: 'var(--fill-normal)', border: 'var(--line-normal)', text: 'var(--label-normal)' },
};

export default function AlertNote({ children, variant = 'info', visible = true, actionLabel, onAction, ariaLabel }: AlertNoteProps) {
  if (!visible) return null;
  const colors = variantColors[variant] ?? variantColors.info;
  return (
    <div role="alert" aria-label={ariaLabel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 'var(--radius-012)', background: colors.bg, borderLeft: `3px solid ${colors.border}` }}>
      <span style={{ fontSize: 13, color: colors.text }}>{children}</span>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginLeft: 12 }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
