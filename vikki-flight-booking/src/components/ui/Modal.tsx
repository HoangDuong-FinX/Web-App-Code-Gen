// src/components/ui/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { vi } from '../../i18n/vi';

interface ModalProps {
  title: string;
  dismissible?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  'data-testid'?: string;
  open?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  dismissible = true,
  onClose,
  children,
  'data-testid': testId,
  open = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      firstFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [dismissible, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => {
        if (dismissible && e.target === overlayRef.current) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-testid={testId}
    >
      <div className="modal-panel">
        <div className="modal-header">
          <span className="modal-title text-headline">{title}</span>
          {dismissible && (
            <button
              ref={firstFocusRef}
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label={vi.modal.closeAriaLabel}
            >
              ✕
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
