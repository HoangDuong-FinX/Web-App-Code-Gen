import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('DoneScreen flow (mount test)', () => {
  it('renders search screen on initial load', () => {
    render(<App />);
    expect(screen.getByText('Tim chuyen bay')).toBeInTheDocument();
  });
});
