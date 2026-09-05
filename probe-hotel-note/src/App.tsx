import React, { useReducer } from 'react';
import { BookingsList } from './screens/BookingsList';
import { BookingDetail } from './screens/BookingDetail';
import { BookingDetailSaveFailed } from './screens/BookingDetailSaveFailed';
import { bookingsFixture } from './fixtures/bookings';
import type { NavigationState, ScreenId, Booking } from './types/index';

type NavigationAction =
  | { type: 'SELECT_BOOKING'; bookingId: string }
  | { type: 'SAVE_FAILED'; noteText: string }
  | { type: 'RETRY_SUCCESS' }
  | { type: 'BACK_TO_LIST' };

const initialState: NavigationState = {
  currentScreen: 'bookings-list',
};

function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  switch (action.type) {
    case 'SELECT_BOOKING':
      return {
        currentScreen: 'booking-detail',
        selectedBookingId: action.bookingId,
        noteText: '',
      };
    case 'SAVE_FAILED':
      return {
        ...state,
        currentScreen: 'booking-detail-save-failed',
        noteText: action.noteText,
      };
    case 'RETRY_SUCCESS':
      return {
        currentScreen: 'booking-detail',
        selectedBookingId: state.selectedBookingId,
        noteText: '',
      };
    case 'BACK_TO_LIST':
      return {
        currentScreen: 'bookings-list',
      };
    default:
      return state;
  }
}

export default function App() {
  const [navState, dispatch] = useReducer(navigationReducer, initialState);

  const selectedBooking: Booking | undefined = bookingsFixture.find(
    (b) => b.bookingId === navState.selectedBookingId
  );

  return (
    <div className="min-h-screen bg-white">
      {navState.currentScreen === 'bookings-list' && (
        <BookingsList
          bookings={bookingsFixture}
          onSelectBooking={(bookingId) =>
            dispatch({ type: 'SELECT_BOOKING', bookingId })
          }
        />
      )}

      {navState.currentScreen === 'booking-detail' && selectedBooking && (
        <BookingDetail
          booking={selectedBooking}
          onSaveSuccess={() => dispatch({ type: 'BACK_TO_LIST' })}
          onSaveFailed={(noteText) =>
            dispatch({ type: 'SAVE_FAILED', noteText })
          }
        />
      )}

      {navState.currentScreen === 'booking-detail-save-failed' &&
        selectedBooking && (
          <BookingDetailSaveFailed
            booking={selectedBooking}
            noteText={navState.noteText || ''}
            onRetrySuccess={() => dispatch({ type: 'RETRY_SUCCESS' })}
            onRetryFailed={(noteText) =>
              dispatch({ type: 'SAVE_FAILED', noteText })
            }
          />
        )}
    </div>
  );
}
