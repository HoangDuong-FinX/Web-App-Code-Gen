import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { StoreProvider } from '../store';
import Search from './Search';

describe('Search screen flow', () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders search screen with trip type options', async () => {
    render(
      <StoreProvider>
        <Search
          airports={[
            { code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'VN', group: 'Popular' },
            { code: 'DLI', name: 'Liên Khương', city: 'Đà Lạt', country: 'VN', group: 'Vietnam' },
          ]}
          cityPairs={[
            { origin: 'SGN', destination: 'DLI' },
            { origin: 'DLI', destination: 'SGN' },
          ]}
          masterDataError={null}
          masterDataLoading={false}
        />
      </StoreProvider>
    );

    expect(screen.getByText(/Tìm chuyến/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Khứ hồi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Một chiều/i)).toBeInTheDocument();
  });

  it('shows master data error when airports fail to load', () => {
    render(
      <StoreProvider>
        <Search
          airports={[]}
          cityPairs={[]}
          masterDataError="Lỗi tải dữ liệu"
          masterDataLoading={false}
        />
      </StoreProvider>
    );

    expect(screen.getByText(/Lỗi tải dữ liệu/i)).toBeInTheDocument();
  });

  it('blocks search when route is invalid', async () => {
    render(
      <StoreProvider>
        <Search
          airports={[
            { code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'VN', group: 'Popular' },
            { code: 'DLI', name: 'Liên Khương', city: 'Đà Lạt', country: 'VN', group: 'Vietnam' },
            { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'TH', group: 'International' },
          ]}
          cityPairs={[
            { origin: 'SGN', destination: 'DLI' },
          ]}
          masterDataError={null}
          masterDataLoading={false}
        />
      </StoreProvider>
    );

    const searchButton = screen.getByRole('button', { name: /Tìm kiếm/i });
    expect(searchButton).toBeDisabled();
  });
});
