import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { StoreProvider } from '../store';
import Results from './Results';

describe('Results screen flow', () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders results title', () => {
    render(
      <StoreProvider>
        <Results
          airports={[]}
          cityPairs={[]}
          masterDataError={null}
          masterDataLoading={false}
          isReturn={false}
        />
      </StoreProvider>
    );

    expect(screen.getByText(/Chọn vé chiều đi/i)).toBeInTheDocument();
  });

  it('renders return title when isReturn is true', () => {
    render(
      <StoreProvider>
        <Results
          airports={[]}
          cityPairs={[]}
          masterDataError={null}
          masterDataLoading={false}
          isReturn={true}
        />
      </StoreProvider>
    );

    expect(screen.getByText(/Chọn vé chiều về/i)).toBeInTheDocument();
  });
});
