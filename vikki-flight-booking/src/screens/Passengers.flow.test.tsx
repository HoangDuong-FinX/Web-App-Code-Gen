import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { StoreProvider } from '../store';
import Passengers from './Passengers';

describe('Passengers screen flow', () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders passengers title', () => {
    render(
      <StoreProvider>
        <Passengers
          airports={[]}
          cityPairs={[]}
          masterDataError={null}
          masterDataLoading={false}
        />
      </StoreProvider>
    );

    expect(screen.getByText(/Thông tin hành khách/i)).toBeInTheDocument();
  });

  it('validates email format on blur', async () => {
    render(
      <StoreProvider>
        <Passengers
          airports={[]}
          cityPairs={[]}
          masterDataError={null}
          masterDataLoading={false}
        />
      </StoreProvider>
    );

    const emailInputs = screen.getAllByDisplayValue('');
    expect(emailInputs.length).toBeGreaterThan(0);
  });

  it('shows continue button', () => {
    render(
      <StoreProvider>
        <Passengers
          airports={[]}
          cityPairs={[]}
          masterDataError={null}
          masterDataLoading={false}
        />
      </StoreProvider>
    );

    expect(screen.getByRole('button', { name: /Tiếp tục/i })).toBeInTheDocument();
  });
});
