import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { StoreProvider } from '../store';
import Checkout from './Checkout';

describe('Checkout screen flow', () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders checkout title', () => {
    render(
      <StoreProvider>
        <Checkout
          airports={[]}
          cityPairs={[]}
          masterDataError={null}
          masterDataLoading={false}
        />
      </StoreProvider>
    );

    expect(screen.getByText(/Xác nhận trả tiền/i)).toBeInTheDocument();
  });

  it('renders payment details', () => {
    render(
      <StoreProvider>
        <Checkout
          airports={[]}
          cityPairs={[]}
          masterDataError={null}
          masterDataLoading={false}
        />
      </StoreProvider>
    );

    expect(screen.getByText(/Chi tiết thanh toán/i)).toBeInTheDocument();
  });

  it('renders pay now button', () => {
    render(
      <StoreProvider>
        <Checkout
          airports={[]}
          cityPairs={[]}
          masterDataError={null}
          masterDataLoading={false}
        />
      </StoreProvider>
    );

    expect(screen.getByRole('button', { name: /Thanh toán ngay/i })).toBeInTheDocument();
  });
});
