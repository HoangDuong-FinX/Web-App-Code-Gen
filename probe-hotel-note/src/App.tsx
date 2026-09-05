import React, { useState } from 'react';
import { Booking } from './types';
import BookingsList from './screens/BookingsList';
import BookingDetail from './screens/BookingDetail';
import SaveFailed from './screens/SaveFailed';
import './styles/index.css';

type ScreenId = 'bookings-list' | 'booking-detail' | 'save-failed';

interface AppState {
  currentScreen: ScreenId;
  selectedBooking: Booking | null;
  noteText: string;
  isSaving: boolean;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentScreen: 'bookings-list',
    selectedBooking: null,
    noteText: '',
    isSaving: false,
  });

  const navigate = (screen: ScreenId, booking?: Booking, noteText?: string) => {
    setState((prev) => ({
      ...prev,
      currentScreen: screen,
      selectedBooking: booking ?? prev.selectedBooking,
      noteText: noteText ?? prev.noteText,
    }));
  };

  const updateNoteText = (text: string) => {
    setState((prev) => ({ ...prev, noteText: text }));
  };

  const setSaving = (saving: boolean) => {
    setState((prev) => ({ ...prev, isSaving: saving }));
  };

  return (
    <div className="app" data-brand="vikki" data-theme="light">
      {state.currentScreen === 'bookings-list' && (
        <BookingsList onSelectBooking={(booking) => navigate('booking-detail', booking)} />
      )}
      {state.currentScreen === 'booking-detail' && state.selectedBooking && (
        <BookingDetail
          booking={state.selectedBooking}
          noteText={state.noteText}
          onNoteChange={updateNoteText}
          onBack={() => navigate('bookings-list')}
          onSaveFailed={(preservedNote) => navigate('save-failed', state.selectedBooking, preservedNote)}
          onSaveSuccess={() => {
            setState((prev) => ({ ...prev, noteText: '' }));
          }}
          isSaving={state.isSaving}
          setSaving={setSaving}
        />
      )}
      {state.currentScreen === 'save-failed' && state.selectedBooking && (
        <SaveFailed
          booking={state.selectedBooking}
          noteText={state.noteText}
          onRetry={() => navigate('booking-detail', state.selectedBooking, state.noteText)}
          onClose={() => navigate('booking-detail', state.selectedBooking)}
          isSaving={state.isSaving}
          setSaving={setSaving}
        />
      )}
    </div>
  );
};

export default App;