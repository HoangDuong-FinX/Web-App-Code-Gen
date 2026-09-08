import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from '../App';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('Home screen navigation', () => {
  it('renders home screen with featured cars heading', async () => {
    render(<App />);
    expect(await screen.findByText('Xe n\u1ed5i b\u1eadt')).toBeTruthy();
  });

  it('navigates to search when search button is clicked', async () => {
    render(<App />);
    await screen.findByText('Xe n\u1ed5i b\u1eadt');
    fireEvent.click(screen.getByTestId('search-trigger'));
    expect(screen.getByTestId('search-input')).toBeTruthy();
  });

  it('navigates to catalog when view all featured is clicked', async () => {
    render(<App />);
    await screen.findByText('Xe n\u1ed5i b\u1eadt');
    fireEvent.click(screen.getByTestId('view-all-featured'));
    expect(screen.getByText('Danh s\u00e1ch xe')).toBeTruthy();
  });

  it('navigates to promotions via bottom nav', async () => {
    render(<App />);
    await screen.findByText('Xe n\u1ed5i b\u1eadt');
    fireEvent.click(screen.getByTestId('nav-promotions'));
    expect(await screen.findByText('Khuy\u1ebfn m\u00e3i')).toBeTruthy();
  });
});
