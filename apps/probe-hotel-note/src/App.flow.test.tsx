import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('App navigation state machine', () => {
  it('renders home screen by default', () => {
    render(<App />);
    expect(screen.getByText('AutoMini')).toBeTruthy();
  });

  it('navigates home -> catalog -> back to home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('view-all-action'));
    expect(screen.getByText('Danh s\u00e1ch xe')).toBeTruthy();
    fireEvent.click(screen.getByTestId('back-action'));
    expect(screen.getByText('AutoMini')).toBeTruthy();
  });

  it('navigates home -> car detail -> inquiry form', () => {
    render(<App />);
    const cards = screen.getAllByTestId('car-card');
    fireEvent.click(cards[0]);
    expect(screen.getByTestId('car-name')).toBeTruthy();
    fireEvent.click(screen.getByTestId('contact-seller-action'));
    expect(screen.getByText('Li\u00ean h\u1ec7 ng\u01b0\u1eddi b\u00e1n')).toBeTruthy();
  });

  it('navigates home -> admin listings -> add car', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('admin-nav-action'));
    expect(screen.getByText('Qu\u1ea3n l\u00fd xe')).toBeTruthy();
    fireEvent.click(screen.getByTestId('add-car-action'));
    expect(screen.getByText('Th\u00eam xe m\u1edbi')).toBeTruthy();
  });

  it('navigates home -> admin listings -> inquiries -> detail', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('admin-nav-action'));
    fireEvent.click(screen.getByTestId('nav-to-inquiries-action'));
    expect(screen.getByText('Qu\u1ea3n l\u00fd y\u00eau c\u1ea7u')).toBeTruthy();
    const rows = screen.getAllByTestId('inquiry-row');
    fireEvent.click(rows[0]);
    expect(screen.getByText('Chi ti\u1ebft y\u00eau c\u1ea7u')).toBeTruthy();
  });
});
