import React, { useState } from 'react';

interface ModalProps {
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  children: React.ReactNode;
  testId?: string;
}

export default function Modal({
  title,
  dismissible = true,
  onDismiss,
  children,
  testId,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid={testId}>
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {dismissible && (
              <button
                onClick={onDismiss}
                className="text-gray-500 hover:text-gray-900"
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
