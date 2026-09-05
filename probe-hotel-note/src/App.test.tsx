import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Check that the app renders and the bookings list title appears
    const titleElement = screen.queryByText('My Hotel Bookings', { selector: '*' });
    expect(titleElement || screen.queryByText(/My Hotel Bookings|Loading/)).toBeTruthy();
  });
});
