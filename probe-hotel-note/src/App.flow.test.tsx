import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { setSaveNoteOutcome } from './fixtures/bookings';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('App Flow Tests', () => {
  beforeEach(() => {
    setSaveNoteOutcome('success');
  });

  it('mounts and renders bookings list', async () => {
    render(<App />);
    const heading = await screen.findByRole('heading', { name: /my hotel bookings/i });
    expect(heading).toBeInTheDocument();
  });

  it('transition: bookings-list -> booking-detail (select booking)', async () => {
    render(<App />);
    await screen.findByRole('heading', { name: /my hotel bookings/i });
    
    const bookingButton = await screen.findByRole('button', { name: /select booking at grand plaza hotel/i });
    fireEvent.click(bookingButton);
    
    const detailHeading = await screen.findByRole('heading', { name: /booking details/i });
    expect(detailHeading).toBeInTheDocument();
    
    const hotelName = await screen.findByText('Grand Plaza Hotel');
    expect(hotelName).toBeInTheDocument();
  });

  it('transition: booking-detail -> bookings-list (back button)', async () => {
    render(<App />);
    await screen.findByRole('heading', { name: /my hotel bookings/i });
    
    const bookingButton = await screen.findByRole('button', { name: /select booking at grand plaza hotel/i });
    fireEvent.click(bookingButton);
    
    await screen.findByRole('heading', { name: /booking details/i });
    
    const backButton = screen.getByRole('button', { name: /back to bookings list/i });
    fireEvent.click(backButton);
    
    const listHeading = await screen.findByRole('heading', { name: /my hotel bookings/i });
    expect(listHeading).toBeInTheDocument();
  });

  it('transition: booking-detail -> booking-detail (save note success)', async () => {
    setSaveNoteOutcome('success');
    render(<App />);
    
    await screen.findByRole('heading', { name: /my hotel bookings/i });
    const bookingButton = await screen.findByRole('button', { name: /select booking at grand plaza hotel/i });
    fireEvent.click(bookingButton);
    
    await screen.findByRole('heading', { name: /booking details/i });
    
    const noteInput = screen.getByRole('note-input') as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /save booking note/i });
    fireEvent.click(saveButton);
    
    // Should remain on booking-detail after success
    const detailHeading = await screen.findByRole('heading', { name: /booking details/i });
    expect(detailHeading).toBeInTheDocument();
  });

  it('transition: booking-detail -> booking-detail-save-failed (save note failure)', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    
    await screen.findByRole('heading', { name: /my hotel bookings/i });
    const bookingButton = await screen.findByRole('button', { name: /select booking at grand plaza hotel/i });
    fireEvent.click(bookingButton);
    
    await screen.findByRole('heading', { name: /booking details/i });
    
    const noteInput = screen.getByRole('note-input') as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /save booking note/i });
    fireEvent.click(saveButton);
    
    // Should transition to booking-detail-save-failed
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/failed to save note/i);
  });

  it('transition: booking-detail-save-failed -> booking-detail (retry success)', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    
    await screen.findByRole('heading', { name: /my hotel bookings/i });
    const bookingButton = await screen.findByRole('button', { name: /select booking at grand plaza hotel/i });
    fireEvent.click(bookingButton);
    
    await screen.findByRole('heading', { name: /booking details/i });
    
    const noteInput = screen.getByRole('note-input') as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /save booking note/i });
    fireEvent.click(saveButton);
    
    await screen.findByRole('alert');
    
    // Now set outcome to success and retry
    setSaveNoteOutcome('success');
    const retryButton = screen.getByRole('button', { name: /retry saving booking note/i });
    fireEvent.click(retryButton);
    
    // Should return to booking-detail
    const detailHeading = await screen.findByRole('heading', { name: /booking details/i });
    expect(detailHeading).toBeInTheDocument();
    
    // Alert should be gone
    const alerts = screen.queryAllByRole('alert');
    expect(alerts.length).toBe(0);
  });

  it('transition: booking-detail-save-failed -> bookings-list (discard changes)', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    
    await screen.findByRole('heading', { name: /my hotel bookings/i });
    const bookingButton = await screen.findByRole('button', { name: /select booking at grand plaza hotel/i });
    fireEvent.click(bookingButton);
    
    await screen.findByRole('heading', { name: /booking details/i });
    
    const noteInput = screen.getByRole('note-input') as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /save booking note/i });
    fireEvent.click(saveButton);
    
    await screen.findByRole('alert');
    
    const discardButton = screen.getByRole('button', { name: /discard changes and return to bookings list/i });
    fireEvent.click(discardButton);
    
    // Should return to bookings-list
    const listHeading = await screen.findByRole('heading', { name: /my hotel bookings/i });
    expect(listHeading).toBeInTheDocument();
  });
});
