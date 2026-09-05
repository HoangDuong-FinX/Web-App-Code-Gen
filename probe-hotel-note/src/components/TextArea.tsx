import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  children?: React.ReactNode;
}

export const TextArea: React.FC<TextAreaProps> = ({
  style,
  ...props
}) => {
  const mergedStyle: React.CSSProperties = {
    fontFamily: 'inherit',
    fontSize: '1rem',
    ...style,
  };

  return <textarea style={mergedStyle} {...props} />;
};
