import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('App mount', () => {
  it('renders the search screen without crashing', () => {
    render(<App />);
    expect(screen.getByText('T\u00ECm chuy\u1EBFn')).toBeDefined();
  });

  it('shows the search button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i })).toBeDefined();
  });
});
