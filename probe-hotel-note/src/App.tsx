import { useState } from 'react';
import BookingsList from './screens/BookingsList';
import BookingDetail from './screens/BookingDetail';
import BookingDetailSaveFailed from './screens/BookingDetailSaveFailed';
import './App.css';

type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface AppState {
  currentScreen: ScreenId;
  selectedBookingId: string | null;
  noteText: string;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'bookings-list',
    selectedBookingId: null,
    noteText: '',
  });

  const handleSelectBooking = (bookingId: string) => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
      selectedBookingId: bookingId,
      noteText: '',
    }));
  };

  const handleBackToList = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'bookings-list',
      selectedBookingId: null,
      noteText: '',
    }));
  };

  const handleSaveFailed = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail-save-failed',
    }));
  };

  const handleRetrySuccess = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
    }));
  };

  const handleDiscardChanges = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'bookings-list',
      selectedBookingId: null,
      noteText: '',
    }));
  };

  const handleNoteChange = (newText: string) => {
    setState((prev) => ({
      ...prev,
      noteText: newText,
    }));
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {state.currentScreen === 'bookings-list' && (
        <BookingsList onSelectBooking={handleSelectBooking} />
      )}
      {state.currentScreen === 'booking-detail' && state.selectedBookingId && (
        <BookingDetail
          bookingId={state.selectedBookingId}
          noteText={state.noteText}
          onNoteChange={handleNoteChange}
          onBack={handleBackToList}
          onSaveFailed={handleSaveFailed}
        />
      )}
      {state.currentScreen === 'booking-detail-save-failed' && state.selectedBookingId && (
        <BookingDetailSaveFailed
          bookingId={state.selectedBookingId}
          noteText={state.noteText}
          onNoteChange={handleNoteChange}
          onRetrySuccess={handleRetrySuccess}
          onDiscardChanges={handleDiscardChanges}
        />
      )}
    </div>
  );
}
