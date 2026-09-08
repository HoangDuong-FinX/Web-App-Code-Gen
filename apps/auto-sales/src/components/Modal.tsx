import React, { useEffect, useRef, type ReactNode } from "react";
import { t } from "../i18n";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function Modal({ open, onClose, title, children, actions }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-[90vw] max-w-md rounded-2xl bg-white p-0 shadow-xl backdrop:bg-black/40"
      onClose={onClose}
      aria-label={title}
    >
      <div className="p-5">
        <h2 className="mb-3 text-lg font-bold text-gray-900">{title}</h2>
        <div className="text-sm text-gray-600">{children}</div>
        {actions && <div className="mt-5 flex gap-3 justify-end">{actions}</div>}
        {!actions && (
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={onClose}
              aria-label={t("modal.ok")}
            >
              {t("modal.ok")}
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
