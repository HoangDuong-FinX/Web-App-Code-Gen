// components/TextArea.tsx
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ariaLabel?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ ariaLabel, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-label={ariaLabel}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-sm resize-none ${className || ''}`}
        rows={4}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';
