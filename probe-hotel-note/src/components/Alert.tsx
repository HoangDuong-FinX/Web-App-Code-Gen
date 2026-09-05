import React from 'react';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  children?: React.ReactNode;
}

const typeStyles: Record<AlertType, React.CSSProperties> = {
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderLeft: '4px solid #d32f2f',
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderLeft: '4px solid #388e3c',
  },
  warning: {
    backgroundColor: '#fff3e0',
    color: '#e65100',
    borderLeft: '4px solid #f57c00',
  },
  info: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    borderLeft: '4px solid #1976d2',
  },
};

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  style,
  children,
  ...props
}) => {
  const mergedStyle: React.CSSProperties = {
    padding: '1rem',
    borderRadius: '4px',
    ...typeStyles[type],
    ...style,
  };

  return (
    <div style={mergedStyle} role="alert" {...props}>
      {children}
    </div>
  );
};
