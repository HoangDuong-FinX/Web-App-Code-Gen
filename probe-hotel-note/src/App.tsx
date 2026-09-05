import { useState } from 'react';
import { BookingsList } from './screens/BookingsList';
import { BookingDetail } from './screens/BookingDetail';
import { BookingDetailSaveFailed } from './screens/BookingDetailSaveFailed';
import type { Booking } from './types';
import './App.css';

type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface AppState {
  currentScreen: ScreenId;
  selectedBooking: Booking | null;
  noteText: string;
}

export function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'bookings-list',
    selectedBooking: null,
    noteText: '',
  });

  const navigateToBookingDetail = (booking: Booking) => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
      selectedBooking: booking,
      noteText: booking.note || '',
    }));
  };

  const navigateToSaveFailed = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail-save-failed',
    }));
  };

  const navigateToBookingsList = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'bookings-list',
      selectedBooking: null,
      noteText: '',
    }));
  };

  const updateNoteText = (text: string) => {
    setState((prev) => ({
      ...prev,
      noteText: text,
    }));
  };

  return (
    <div className="app" data-brand="vikki" data-theme="light">
      {state.currentScreen === 'bookings-list' && (
        <BookingsList onSelectBooking={navigateToBookingDetail} />
      )}
      {state.currentScreen === 'booking-detail' && state.selectedBooking && (
        <BookingDetail
          booking={state.selectedBooking}
          noteText={state.noteText}
          onNoteChange={updateNoteText}
          onSaveSuccess={navigateToBookingsList}
          onSaveFailure={navigateToSaveFailed}
          onBack={navigateToBookingsList}
        />
      )}
      {state.currentScreen === 'booking-detail-save-failed' && state.selectedBooking && (
        <BookingDetailSaveFailed
          booking={state.selectedBooking}
          noteText={state.noteText}
          onNoteChange={updateNoteText}
          onRetrySuccess={navigateToBookingsList}
          onRetryFailure={() => {
            // Remain on save-failed screen
          }}
          onBack={navigateToBookingsList}
        />
      )}
    </div>
  );
}