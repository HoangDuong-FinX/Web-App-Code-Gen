import { useState } from 'react';
import type { Booking } from './fixtures';
import { useLoadBookings } from './fixtures';
import { BookingList } from './screens/BookingList';
import { BookingDetail } from './screens/BookingDetail';
import { BookingDetailSaveFailed } from './screens/BookingDetailSaveFailed';

type ScreenId = 'booking-list' | 'booking-detail' | 'booking-detail-save-failed';

interface AppState {
  currentScreen: ScreenId;
  selectedBooking: Booking | undefined;
  noteText: string;
}

export default function App() {
  const { bookings } = useLoadBookings();
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'booking-list',
    selectedBooking: undefined,
    noteText: '',
  });

  const navigateTo = (screen: ScreenId, booking?: Booking, noteText?: string) => {
    setAppState({
      currentScreen: screen,
      selectedBooking: booking,
      noteText: noteText ?? '',
    });
  };

  const handleSelectBooking = (booking: Booking) => {
    navigateTo('booking-detail', booking, '');
  };

  const handleSaveSuccess = () => {
    navigateTo('booking-detail', appState.selectedBooking, '');
  };

  const handleSaveFailure = () => {
    navigateTo('booking-detail-save-failed', appState.selectedBooking, appState.noteText);
  };

  const handleRetrySuccess = () => {
    navigateTo('booking-detail', appState.selectedBooking, '');
  };

  const handleRetryFailure = () => {
    // Stay on same screen
  };

  const handleBackToList = () => {
    navigateTo('booking-list', undefined, '');
  };

  return (
    <div className="min-h-screen bg-white">
      {appState.currentScreen === 'booking-list' && (
        <BookingList bookings={bookings} onSelectBooking={handleSelectBooking} />
      )}
      {appState.currentScreen === 'booking-detail' && appState.selectedBooking && (
        <BookingDetail
          booking={appState.selectedBooking}
          onSaveSuccess={handleSaveSuccess}
          onSaveFailure={handleSaveFailure}
          onBackToList={handleBackToList}
        />
      )}
      {appState.currentScreen === 'booking-detail-save-failed' && appState.selectedBooking && (
        <BookingDetailSaveFailed
          booking={appState.selectedBooking}
          noteText={appState.noteText}
          onRetrySuccess={handleRetrySuccess}
          onRetryFailure={handleRetryFailure}
          onNoteChange={(text) => setAppState({ ...appState, noteText: text })}
          onBackToList={handleBackToList}
        />
      )}
    </div>
  );
}