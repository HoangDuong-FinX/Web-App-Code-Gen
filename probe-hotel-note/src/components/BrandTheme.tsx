import React from 'react';

interface BrandThemeProviderProps {
  brand: string;
  theme: string;
  children: React.ReactNode;
}

export const BrandThemeProvider: React.FC<BrandThemeProviderProps> = ({
  brand,
  theme,
  children,
}) => {
  return (
    <div
      style={{
        '--brand': brand,
        '--theme': theme,
      } as React.CSSProperties}
      data-brand={brand}
      data-theme={theme}
    >
      {children}
    </div>
  );
};
