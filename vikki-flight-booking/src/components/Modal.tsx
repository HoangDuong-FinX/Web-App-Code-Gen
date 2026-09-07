import React, { useEffect, useRef } from 'react';
import { t } from '../i18n/vi';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  'data-testid'?: string;
}

export function Modal({ isOpen, title, onClose, children, ...rest }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
    return () => { prev?.focus(); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
        {...rest}
      >
        <div className="modal__header">
          <h2 className="modal__title text-headline">{title}</h2>
          <button
            type="button"
            className="modal__close btn btn-ghost"
            onClick={onClose}
            aria-label={t('common.close.ariaLabel')}
          >
            \u00D7
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
