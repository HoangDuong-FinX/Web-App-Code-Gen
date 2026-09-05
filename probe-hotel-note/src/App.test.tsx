import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { App } from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('App Mount', () => {
  it('renders without crashing and shows bookings list', () => {
    render(<App />);
    const title = screen.getByText('My Hotel Bookings');
    expect(title).toBeDefined();
  });
});
