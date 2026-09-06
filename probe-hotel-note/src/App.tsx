import { useState } from 'react';
import { BookingsList } from './screens/BookingsList';
import { BookingDetail } from './screens/BookingDetail';
import { type BookingDetail as BookingDetailData } from './fixtures/bookingDetail';

type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface AppState {
  currentScreen: ScreenId;
  selectedBookingId: string | null;
  selectedBookingData: BookingDetailData | null;
  failedNoteText: string;
}

function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'bookings-list',
    selectedBookingId: null,
    selectedBookingData: null,
    failedNoteText: '',
  });

  // Navigation handlers
  const handleSelectBooking = (bookingId: string) => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
      selectedBookingId: bookingId,
    }));
  };

  const handleBackToList = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'bookings-list',
      selectedBookingId: null,
      selectedBookingData: null,
      failedNoteText: '',
    }));
  };

  const handleSaveSuccess = () => {
    setState((prev) => ({
      ...prev,
      failedNoteText: '',
    }));
  };

  const handleSaveFailed = (noteText: string) => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail-save-failed',
      failedNoteText: noteText,
    }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {state.currentScreen === 'bookings-list' && (
        <BookingsList onSelectBooking={handleSelectBooking} />
      )}
      {state.currentScreen === 'booking-detail' && state.selectedBookingId && (
        <BookingDetail
          bookingId={state.selectedBookingId}
          onBack={handleBackToList}
          onSaveSuccess={handleSaveSuccess}
          onSaveFailed={handleSaveFailed}
        />
      )}
      {state.currentScreen === 'booking-detail-save-failed' && state.selectedBookingId && (
        <BookingDetail
          key={`booking-detail-${state.selectedBookingId}`}
          bookingId={state.selectedBookingId}
          onBack={handleBackToList}
          onSaveSuccess={handleSaveSuccess}
          onSaveFailed={handleSaveFailed}
        />
      )}
    </div>
  );
}

export default App;
