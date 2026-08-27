import React, { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog ref={dialogRef} className="modal" aria-label={title} onClose={onClose}>
      <div className="modal__header">
        <h2 className="modal__title">{title}</h2>
        <button className="modal__close" onClick={onClose} aria-label={t('common.close')} type="button">
          &times;
        </button>
      </div>
      <div className="modal__body">{children}</div>
    </dialog>
  );
}

