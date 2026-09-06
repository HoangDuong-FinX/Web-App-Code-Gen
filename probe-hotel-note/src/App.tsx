import React, { useState, useEffect } from 'react';
import { BookingsList } from './screens/BookingsList';
import { BookingDetail } from './screens/BookingDetail';
import { BookingDetailSaveFailed } from './screens/BookingDetailSaveFailed';
import { loadBookings, loadBookingDetail } from './fixtures/bookings';

export interface Booking {
  bookingId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  note: string | null;
}

export type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

export interface AppState {
  currentScreen: ScreenId;
  bookings: Booking[];
  selectedBookingId: string | null;
  selectedBooking: Booking | null;
  noteText: string;
  loadingBookings: boolean;
  loadingDetail: boolean;
  bookingsError: string | null;
  detailError: string | null;
  savingNote: boolean;
  saveError: string | null;
}

const initialState: AppState = {
  currentScreen: 'bookings-list',
  bookings: [],
  selectedBookingId: null,
  selectedBooking: null,
  noteText: '',
  loadingBookings: false,
  loadingDetail: false,
  bookingsError: null,
  detailError: null,
  savingNote: false,
  saveError: null,
};

export function App() {
  const [state, setState] = useState<AppState>(initialState);

  // Load bookings on app mount
  useEffect(() => {
    loadBookingsData();
  }, []);

  const loadBookingsData = async () => {
    setState((prev) => ({ ...prev, loadingBookings: true, bookingsError: null }));
    try {
      const bookings = await loadBookings();
      setState((prev) => ({
        ...prev,
        bookings,
        loadingBookings: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loadingBookings: false,
        bookingsError: 'Unable to load bookings',
      }));
    }
  };

  const handleSelectBooking = async (bookingId: string) => {
    setState((prev) => ({
      ...prev,
      selectedBookingId: bookingId,
      loadingDetail: true,
      detailError: null,
      saveError: null,
    }));
    try {
      const booking = await loadBookingDetail(bookingId);
      setState((prev) => ({
        ...prev,
        selectedBooking: booking,
        noteText: booking.note || '',
        loadingDetail: false,
        currentScreen: 'booking-detail',
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loadingDetail: false,
        detailError: 'Unable to load booking details',
      }));
    }
  };

  const handleUpdateNoteText = (text: string) => {
    setState((prev) => ({
      ...prev,
      noteText: text.slice(0, 200),
    }));
  };

  const handleSaveNote = async () => {
    if (!state.selectedBookingId) return;
    setState((prev) => ({
      ...prev,
      savingNote: true,
    }));
    try {
      const { saveNote } = await import('./fixtures/bookings');
      await saveNote(state.selectedBookingId, state.noteText);
      setState((prev) => ({
        ...prev,
        savingNote: false,
        saveError: null,
        currentScreen: 'booking-detail',
        selectedBooking: prev.selectedBooking
          ? { ...prev.selectedBooking, note: prev.noteText }
          : null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        savingNote: false,
        saveError: 'Failed to save your note. Please try again.',
        currentScreen: 'booking-detail-save-failed',
      }));
    }
  };

  const handleRetrySaveNote = async () => {
    await handleSaveNote();
  };

  const handleBackToBookingsList = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'bookings-list',
      selectedBookingId: null,
      selectedBooking: null,
      noteText: '',
      detailError: null,
      saveError: null,
    }));
  };

  const handleRetryLoadBookings = () => {
    loadBookingsData();
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {state.currentScreen === 'bookings-list' && (
        <BookingsList
          bookings={state.bookings}
          loading={state.loadingBookings}
          error={state.bookingsError}
          onSelectBooking={handleSelectBooking}
          onRetry={handleRetryLoadBookings}
        />
      )}
      {state.currentScreen === 'booking-detail' && state.selectedBooking && (
        <BookingDetail
          booking={state.selectedBooking}
          noteText={state.noteText}
          loading={state.loadingDetail}
          error={state.detailError}
          saving={state.savingNote}
          onUpdateNoteText={handleUpdateNoteText}
          onSaveNote={handleSaveNote}
          onBackToList={handleBackToBookingsList}
        />
      )}
      {state.currentScreen === 'booking-detail-save-failed' && state.selectedBooking && (
        <BookingDetailSaveFailed
          booking={state.selectedBooking}
          noteText={state.noteText}
          error={state.saveError}
          saving={state.savingNote}
          onUpdateNoteText={handleUpdateNoteText}
          onRetrySaveNote={handleRetrySaveNote}
          onBackToList={handleBackToBookingsList}
        />
      )}
    </div>
  );
}

export default App;
