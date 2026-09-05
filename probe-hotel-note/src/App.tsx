import React, { useState, useEffect } from 'react';
import { BrandThemeProvider } from './components/BrandTheme';
import { BookingsList } from './screens/BookingsList';
import { BookingDetail } from './screens/BookingDetail';
import { BookingDetailSaveFailed } from './screens/BookingDetailSaveFailed';
import { Booking } from './types';
import { loadBookingsFixture } from './fixtures/bookings';

type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface NavigationState {
  currentScreen: ScreenId;
  selectedBookingId?: string;
  errorMessage?: string;
}

export default function App() {
  const [nav, setNav] = useState<NavigationState>({
    currentScreen: 'bookings-list',
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load bookings on mount
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        const data = await loadBookingsFixture();
        setBookings(data);
        setLoadError(null);
      } catch (error) {
        setLoadError('Unable to load bookings. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };

    if (nav.currentScreen === 'bookings-list') {
      loadBookings();
    }
  }, [nav.currentScreen]);

  // Navigation handlers
  const goToDetail = (bookingId: string) => {
    setNav({
      currentScreen: 'booking-detail',
      selectedBookingId: bookingId,
    });
  };

  const goToList = () => {
    setNav({
      currentScreen: 'bookings-list',
    });
  };

  const goToSaveFailed = (error: string) => {
    setNav({
      currentScreen: 'booking-detail-save-failed',
      errorMessage: error,
    });
  };

  const retryFromFailed = () => {
    setNav((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
    }));
  };

  // Find current booking
  const currentBooking = nav.selectedBookingId
    ? bookings.find((b) => b.id === nav.selectedBookingId)
    : null;

  // Render current screen
  let screen: React.ReactNode = null;

  switch (nav.currentScreen) {
    case 'bookings-list':
      screen = (
        <BookingsList
          bookings={bookings}
          isLoading={isLoading}
          loadError={loadError}
          onBookingTap={goToDetail}
          onRetry={() => {
            setIsLoading(true);
            setLoadError(null);
          }}
        />
      );
      break;

    case 'booking-detail':
      screen = currentBooking ? (
        <BookingDetail
          booking={currentBooking}
          onBack={goToList}
          onSaveFailed={goToSaveFailed}
          onSaveSuccess={() => {
            setBookings((prev) =>
              prev.map((b) =>
                b.id === currentBooking.id ? currentBooking : b
              )
            );
            goToList();
          }}
        />
      ) : (
        <div style={{ padding: '1rem' }}>
          <p>Booking not found</p>
        </div>
      );
      break;

    case 'booking-detail-save-failed':
      screen = currentBooking ? (
        <BookingDetailSaveFailed
          booking={currentBooking}
          errorMessage={nav.errorMessage || 'Failed to save note. Please try again.'}
          onBack={goToList}
          onRetry={retryFromFailed}
          onRetrySave={goToSaveFailed}
        />
      ) : (
        <div style={{ padding: '1rem' }}>
          <p>Booking not found</p>
        </div>
      );
      break;
  }

  return (
    <BrandThemeProvider brand="vikki" theme="light">
      {screen}
    </BrandThemeProvider>
  );
}
