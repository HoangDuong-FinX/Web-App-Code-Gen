import React, { useState, useCallback } from 'react';
import BookingsList from './screens/BookingsList';
import BookingDetail from './screens/BookingDetail';
import BookingDetailSaveFailed from './screens/BookingDetailSaveFailed';

type Screen = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface NavigationState {
  current: Screen;
  bookingId?: string;
}

const App: React.FC = () => {
  const [nav, setNav] = useState<NavigationState>({
    current: 'bookings-list',
  });

  const navigateTo = useCallback(
    (screen: Screen, params?: { bookingId: string }) => {
      setNav({
        current: screen,
        bookingId: params?.bookingId,
      });
    },
    []
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {nav.current === 'bookings-list' && (
        <BookingsList onNavigate={navigateTo} />
      )}
      {nav.current === 'booking-detail' && nav.bookingId && (
        <BookingDetail
          bookingId={nav.bookingId}
          onNavigate={navigateTo}
        />
      )}
      {nav.current === 'booking-detail-save-failed' && nav.bookingId && (
        <BookingDetailSaveFailed
          bookingId={nav.bookingId}
          onNavigate={navigateTo}
        />
      )}
    </div>
  );
};

export default App;