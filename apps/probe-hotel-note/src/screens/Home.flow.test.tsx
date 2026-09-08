import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from '../App';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('Home screen flow', () => {
  it('renders home screen with logo and featured cars', () => {
    render(<App />);
    expect(screen.getByText('AutoMini')).toBeTruthy();
    expect(screen.getAllByTestId('car-card').length).toBeGreaterThan(0);
  });

  it('navigates to catalog when view all is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('view-all-action'));
    expect(screen.getByText('Danh s\u00e1ch xe')).toBeTruthy();
  });

  it('navigates to favorites when favorites button is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('favorites-nav-action'));
    expect(screen.getByText('Xe y\u00eau th\u00edch')).toBeTruthy();
  });

  it('navigates to admin when admin button is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('admin-nav-action'));
    expect(screen.getByText('Qu\u1ea3n l\u00fd xe')).toBeTruthy();
  });

  it('navigates to search results when search is submitted', () => {
    render(<App />);
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    expect(screen.getByTestId('results-count')).toBeTruthy();
  });
});
