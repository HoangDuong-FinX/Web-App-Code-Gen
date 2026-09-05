import { useState } from 'react';
import { BookingsList } from './screens/BookingsList';
import { BookingDetail } from './screens/BookingDetail';
import { BookingDetailSaveFailed } from './screens/BookingDetailSaveFailed';

type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface AppState {
  currentScreen: ScreenId;
  selectedBookingId: string | null;
  noteText: string;
  saveInProgress: boolean;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'bookings-list',
    selectedBookingId: null,
    noteText: '',
    saveInProgress: false,
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
      saveInProgress: false,
    }));
  };

  const handleSaveFailed = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail-save-failed',
    }));
  };

  const handleSaveSuccess = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
      noteText: '',
      saveInProgress: false,
    }));
  };

  const handleRetry = () => {
    // Stay on save-failed screen
    setState((prev) => ({
      ...prev,
      saveInProgress: false,
    }));
  };

  const handleRetrySuccess = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
      noteText: '',
      saveInProgress: false,
    }));
  };

  return (
    <div className="w-full h-screen bg-white font-sans">
      {state.currentScreen === 'bookings-list' && (
        <BookingsList onSelectBooking={handleSelectBooking} />
      )}
      {state.currentScreen === 'booking-detail' && state.selectedBookingId && (
        <BookingDetail
          bookingId={state.selectedBookingId}
          onBack={handleBackToList}
          onSaveFailed={handleSaveFailed}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
      {state.currentScreen === 'booking-detail-save-failed' && state.selectedBookingId && (
        <BookingDetailSaveFailed
          bookingId={state.selectedBookingId}
          noteText={state.noteText}
          onBack={handleBackToList}
          onRetry={handleRetry}
          onRetrySuccess={handleRetrySuccess}
        />
      )}
    </div>
  );
}
