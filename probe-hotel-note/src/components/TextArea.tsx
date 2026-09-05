import React from 'react';
import './TextArea.css';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextArea({ className = '', ...props }: TextAreaProps) {
  const classes = ['textarea', className].filter(Boolean).join(' ');
  return <textarea className={classes} {...props} />;
}
