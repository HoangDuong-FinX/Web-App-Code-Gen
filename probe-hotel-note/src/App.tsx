import { useState } from 'react';
import BookingsList from './screens/BookingsList';
import BookingDetail from './screens/BookingDetail';
import BookingDetailSaveFailed from './screens/BookingDetailSaveFailed';
import { i18n } from './i18n/vi';

type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface AppState {
  currentScreen: ScreenId;
  selectedBookingId: string | null;
  noteText: string;
  saveError: string | null;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'bookings-list',
    selectedBookingId: null,
    noteText: '',
    saveError: null,
  });

  const handleNavigateTo = (screenId: ScreenId, bookingId?: string) => {
    setState(prev => ({
      ...prev,
      currentScreen: screenId,
      selectedBookingId: bookingId || prev.selectedBookingId,
      saveError: null,
    }));
  };

  const handleSelectBooking = (bookingId: string) => {
    handleNavigateTo('booking-detail', bookingId);
  };

  const handleUpdateNoteText = (text: string) => {
    setState(prev => ({
      ...prev,
      noteText: text.slice(0, 200),
    }));
  };

  const handleSaveNote = () => {
    // Trigger save via fixture; on success stay on detail, on failure go to save-failed
    setState(prev => ({
      ...prev,
      currentScreen: 'booking-detail-save-failed',
      saveError: i18n['error.save_note_failed'],
    }));
  };

  const handleRetryNote = () => {
    // Retry save via fixture; on success go to detail, on failure stay on save-failed
    setState(prev => ({
      ...prev,
      currentScreen: 'booking-detail',
      saveError: null,
    }));
  };

  return (
    <div className="app" style={{ fontFamily: 'system-ui, sans-serif', padding: '16px' }}>
      {state.currentScreen === 'bookings-list' && (
        <BookingsList
          onSelectBooking={handleSelectBooking}
        />
      )}
      {state.currentScreen === 'booking-detail' && state.selectedBookingId && (
        <BookingDetail
          bookingId={state.selectedBookingId}
          noteText={state.noteText}
          onUpdateNoteText={handleUpdateNoteText}
          onSaveNote={handleSaveNote}
        />
      )}
      {state.currentScreen === 'booking-detail-save-failed' && state.selectedBookingId && (
        <BookingDetailSaveFailed
          bookingId={state.selectedBookingId}
          noteText={state.noteText}
          onUpdateNoteText={handleUpdateNoteText}
          onRetryNote={handleRetryNote}
          errorMessage={state.saveError}
        />
      )}
    </div>
  );
}