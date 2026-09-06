// components/Alert.tsx
import React, { useEffect, useState } from 'react';

interface AlertProps {
  variant?: 'success' | 'error';
  visible?: boolean;
  children: React.ReactNode;
  onDismiss?: () => void;
  autoDismissMs?: number;
}

const variantClasses: Record<string, string> = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'success', visible = true, children, onDismiss, autoDismissMs = 3000 }, ref) => {
    const [isVisible, setIsVisible] = useState(visible);

    useEffect(() => {
      setIsVisible(visible);
      if (visible && autoDismissMs > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, autoDismissMs);
        return () => clearTimeout(timer);
      }
    }, [visible, autoDismissMs, onDismiss]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={`p-4 rounded-md ${variantClasses[variant] || ''}`}
      >
        {children}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
