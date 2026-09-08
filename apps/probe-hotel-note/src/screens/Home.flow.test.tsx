import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, afterEach, describe, it, expect } from 'vitest';
import App from '../App';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('Home screen navigation', () => {
  it('renders home screen with featured cars heading', async () => {
    render(<App />);
    expect(await screen.findByText('Xe nổi bật')).toBeTruthy();
  });

  it('navigates to search when search button is clicked', async () => {
    render(<App />);
    await screen.findByText('Xe nổi bật');
    fireEvent.click(screen.getByTestId('search-trigger'));
    expect(screen.getByTestId('search-input')).toBeTruthy();
  });

  it('navigates to catalog when view all featured is clicked', async () => {
    render(<App />);
    await screen.findByText('Xe nổi bật');
    fireEvent.click(screen.getByTestId('view-all-featured'));
    expect(screen.getByText('Danh sách xe')).toBeTruthy();
  });

  it('navigates to promotions via bottom nav', async () => {
    render(<App />);
    await screen.findByText('Xe nổi bật');
    fireEvent.click(screen.getByTestId('nav-promotions'));
    expect(await screen.findByText('Khuyến mãi')).toBeTruthy();
  });

  it('navigates to catalog via bottom nav', async () => {
    render(<App />);
    await screen.findByText('Xe nổi bật');
    fireEvent.click(screen.getByTestId('nav-catalog'));
    expect(screen.getByText('Danh sách xe')).toBeTruthy();
  });
});
