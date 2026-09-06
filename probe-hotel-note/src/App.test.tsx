import { render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import App from './App';

afterEach(() => {
  vi.restoreAllMocks();
});

test('App mounts and renders bookings list', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /my hotel bookings/i });
  expect(heading).toBeInTheDocument();
});
