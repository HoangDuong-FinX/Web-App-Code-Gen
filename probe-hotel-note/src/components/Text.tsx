import React from 'react';

interface TextProps {
  variant: 'title' | 'body-strong' | 'body-secondary' | 'label' | 'caption';
  children: React.ReactNode;
}

const variantStyles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  'body-strong': {
    fontSize: '16px',
    fontWeight: '600',
  },
  'body-secondary': {
    fontSize: '14px',
    color: '#666',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '8px',
  },
  caption: {
    fontSize: '12px',
    color: '#999',
  },
};

export default function Text({ variant, children }: TextProps) {
  return <div style={variantStyles[variant]}>{children}</div>;
}