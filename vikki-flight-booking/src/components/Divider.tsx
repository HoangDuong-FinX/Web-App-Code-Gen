import React from 'react';

export function Divider({ style }: { style?: React.CSSProperties }): React.ReactElement {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: '1px solid var(--gray-200)',
        margin: '4px 0',
        ...style,
      }}
    />
  );
}
