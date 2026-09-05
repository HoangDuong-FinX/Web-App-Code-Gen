import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { t } from '../i18n';
import { loadBookingsFixture } from '../fixtures/bookings';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface BookingsListProps {
  bookings: Booking[];
  isLoading: boolean;
  loadError: string | null;
  onBookingTap: (bookingId: string) => void;
  onRetry: () => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  isLoading,
  loadError,
  onBookingTap,
  onRetry,
}) => {
  const handleRetry = async () => {
    onRetry();
    try {
      await loadBookingsFixture();
    } catch (error) {
      // Error already handled by parent
    }
  };

  return (
    <div style={styles.container}>
      <Text variant="title" style={styles.title}>
        {t('bookings-list.title')}
      </Text>

      {isLoading && (
        <div style={styles.loadingContainer}>
          <Text variant="body">Loading bookings...</Text>
        </div>
      )}

      {loadError && (
        <div style={styles.errorContainer}>
          <Text variant="body" style={{ color: '#d32f2f' }}>
            {loadError}
          </Text>
          <Button variant="primary" onClick={handleRetry} style={styles.retryButton}>
            {t('bookings-list.retry')}
          </Button>
        </div>
      )}

      {!isLoading && !loadError && bookings.length === 0 && (
        <div style={styles.emptyContainer}>
          <Text variant="body">{t('bookings-list.empty')}</Text>
        </div>
      )}

      {!isLoading && !loadError && bookings.length > 0 && (
        <div style={styles.listContainer}>
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              onClick={() => onBookingTap(booking.id)}
              style={styles.bookingCard}
              role="button"
              tabIndex={0}
              aria-label={t('booking-card.aria')}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onBookingTap(booking.id);
                }
              }}
            >
              <Text variant="subtitle" style={styles.hotelName}>
                {booking.hotelName}
              </Text>
              <Text variant="body" style={styles.dates}>
                {booking.checkIn} — {booking.checkOut}
              </Text>
              <Text variant="caption" style={styles.location}>
                {booking.location}
              </Text>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    padding: '1rem',
    maxWidth: '100%',
  },
  title: {
    marginBottom: '0.5rem',
  },
  loadingContainer: {
    padding: '2rem 1rem',
    textAlign: 'center' as const,
  },
  errorContainer: {
    padding: '1rem',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  retryButton: {
    alignSelf: 'flex-start' as const,
  },
  emptyContainer: {
    padding: '2rem 1rem',
    textAlign: 'center' as const,
    color: '#666',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  bookingCard: {
    padding: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  hotelName: {
    marginBottom: '0.5rem',
  },
  dates: {
    marginBottom: '0.25rem',
  },
  location: {
    color: '#666',
  },
};
