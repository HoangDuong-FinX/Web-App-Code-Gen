import { useState } from 'react';
import BookingsList from './screens/BookingsList';
import BookingDetail from './screens/BookingDetail';
import BookingDetailSaveFailed from './screens/BookingDetailSaveFailed';
import type { Booking } from './types';
import './App.css';

type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface AppState {
  currentScreen: ScreenId;
  selectedBookingId: string | null;
  noteText: string;
  saveError: string | null;
}

const initialState: AppState = {
  currentScreen: 'bookings-list',
  selectedBookingId: null,
  noteText: '',
  saveError: null,
};

function App() {
  const [state, setState] = useState<AppState>(initialState);

  const goToBookingDetail = (bookingId: string) => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
      selectedBookingId: bookingId,
      noteText: '',
      saveError: null,
    }));
  };

  const goToBookingDetailSaveFailed = (noteText: string, error: string) => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail-save-failed',
      noteText,
      saveError: error,
    }));
  };

  const discardChanges = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'bookings-list',
      selectedBookingId: null,
      noteText: '',
      saveError: null,
    }));
  };

  const backToList = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'bookings-list',
      selectedBookingId: null,
      noteText: '',
      saveError: null,
    }));
  };

  const updateNoteText = (text: string) => {
    setState((prev) => ({
      ...prev,
      noteText: text,
    }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {state.currentScreen === 'bookings-list' && (
        <BookingsList onSelectBooking={goToBookingDetail} />
      )}
      {state.currentScreen === 'booking-detail' && state.selectedBookingId && (
        <BookingDetail
          bookingId={state.selectedBookingId}
          noteText={state.noteText}
          onNoteChange={updateNoteText}
          onSaveSuccess={() => {
            setState((prev) => ({
              ...prev,
              saveError: null,
            }));
          }}
          onSaveFailed={(error) =>
            goToBookingDetailSaveFailed(state.noteText, error)
          }
          onBack={backToList}
        />
      )}
      {state.currentScreen === 'booking-detail-save-failed' &&
        state.selectedBookingId && (
          <BookingDetailSaveFailed
            bookingId={state.selectedBookingId}
            noteText={state.noteText}
            onNoteChange={updateNoteText}
            saveError={state.saveError || 'Unknown error'}
            onRetrySuccess={() => {
              setState((prev) => ({
                ...prev,
                currentScreen: 'booking-detail',
                saveError: null,
              }));
            }}
            onRetryFailed={(error) => {
              setState((prev) => ({
                ...prev,
                saveError: error,
              }));
            }}
            onDiscard={discardChanges}
          />
        )}
    </div>
  );
}

export default App;