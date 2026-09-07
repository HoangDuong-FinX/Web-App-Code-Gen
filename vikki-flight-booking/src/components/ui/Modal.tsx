import React, { useEffect } from 'react';
import { t } from '../../i18n';

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  'data-testid'?: string;
}

export function Modal({ title, open, onClose, children, 'data-testid': testId }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal
      aria-label={title}
      data-testid={testId}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 pt-4 pb-2 sticky top-0 bg-white border-b border-[var(--gray-100)]">
          <span className="text-[17px] font-semibold text-[var(--gray-900)]">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close.aria')}
            className="p-2 rounded-lg text-[var(--gray-500)] hover:bg-[var(--gray-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--vikki-vkblue-500)]"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
