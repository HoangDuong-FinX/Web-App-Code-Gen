import React, { useEffect, useRef } from 'react';
import { Button } from './Button';
import { t } from '../i18n';

export interface ModalProps {
  title: string;
  dismissible?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export function Modal({
  title,
  dismissible,
  onClose,
  children,
  'data-testid': testId,
}: ModalProps): React.ReactElement {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Trap focus inside modal
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && dismissible) onClose?.();
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    first?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [dismissible, onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'flex-end',
      }}
      onClick={e => { if (e.target === e.currentTarget && dismissible) onClose?.(); }}
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      <div
        ref={dialogRef}
        data-testid={testId}
        style={{
          width: '100%',
          maxWidth: '640px',
          margin: '0 auto',
          background: 'var(--color-bg-page)',
          borderRadius: '16px 16px 0 0',
          boxShadow: 'var(--shadow-modal)',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 16px 12px',
            borderBottom: '1px solid var(--gray-200)',
            position: 'sticky', top: 0, background: 'var(--color-bg-page)', zIndex: 1,
          }}
        >
          <h2 style={{ font: 'var(--text-headline)', margin: 0 }}>{title}</h2>
          {dismissible && (
            <Button
              variant="ghost"
              onClick={onClose}
              ariaLabel={t('common.close.ariaLabel')}
              style={{ padding: '6px 8px', minWidth: 0 }}
            >
              ✕
            </Button>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}
