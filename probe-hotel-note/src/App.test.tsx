import { render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import App from './App';

afterEach(() => {
  vi.restoreAllMocks();
});

test('App mounts and renders bookings list', async () => {
  render(<App />);
  await new Promise((resolve) => setTimeout(resolve, 400));
  const heading = screen.getByRole('heading', { name: /my hotel bookings/i });
  expect(heading).toBeDefined();
});
