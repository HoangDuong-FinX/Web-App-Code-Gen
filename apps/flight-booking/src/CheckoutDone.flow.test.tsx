import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('App mount', () => {
  it('renders the search screen by default', () => {
    render(<App />);
    expect(screen.getByText('Tim chuyen bay')).toBeInTheDocument();
  });

  it('app root has data-testid', () => {
    render(<App />);
    expect(screen.getByTestId('app-root')).toBeInTheDocument();
  });
});
