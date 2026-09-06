import React, { useState, useCallback } from 'react';
import { useTranslation } from './i18n';
import { Booking } from './types';
import { loadBookingsFixture, loadBookingDetailFixture, saveNoteFixture, setSaveNoteOutcome } from './fixtures/bookings';
import BookingsList from './screens/BookingsList';
import BookingDetail from './screens/BookingDetail';
import BookingDetailSaveFailed from './screens/BookingDetailSaveFailed';

type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface NavigationState {
  screen: ScreenId;
  selectedBookingId?: string;
  noteText?: string;
  currentCharCount?: number;
}

function App() {
  const { t } = useTranslation();
  const [nav, setNav] = useState<NavigationState>({ screen: 'bookings-list' });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingsLoadError, setBookingsLoadError] = useState<string | null>(null);
  const [bookingDetailLoadError, setBookingDetailLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savePending, setSavePending] = useState(false);

  // Load bookings list on app mount
  React.useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await loadBookingsFixture();
        setBookings(data);
        setBookingsLoadError(null);
      } catch (err) {
        setBookingsLoadError(t('bookings.loadError'));
      }
    };
    loadBookings();
  }, [t]);

  const handleSelectBooking = useCallback((bookingId: string) => {
    setBookingDetailLoadError(null);
    setSaveError(null);
    setNav({ screen: 'booking-detail', selectedBookingId: bookingId, noteText: '', currentCharCount: 0 });
  }, []);

  const handleLoadBookingDetail = useCallback(async (bookingId: string) => {
    try {
      const data = await loadBookingDetailFixture(bookingId);
      setSelectedBooking(data);
      setNav((prev) => ({
        ...prev,
        noteText: data.noteText || '',
        currentCharCount: (data.noteText || '').length,
      }));
      setBookingDetailLoadError(null);
    } catch (err) {
      setBookingDetailLoadError(t('bookingDetail.loadError'));
    }
  }, [t]);

  const handleNoteChange = useCallback((text: string) => {
    setNav((prev) => ({
      ...prev,
      noteText: text,
      currentCharCount: text.length,
    }));
  }, []);

  const handleSaveNote = useCallback(async () => {
    if (!selectedBooking || nav.noteText === undefined) return;
    setSavePending(true);
    setSaveError(null);
    try {
      const result = await saveNoteFixture(selectedBooking.id, nav.noteText);
      if (result.success) {
        // Success: update the booking's note and remain on booking-detail
        setSelectedBooking((prev) => prev ? { ...prev, noteText: nav.noteText || '' } : null);
        setSaveError(null);
        setNav((prev) => ({ ...prev, screen: 'booking-detail' }));
      } else {
        // Failure: transition to save-failed screen
        setSaveError(t('bookingDetail.saveFailed'));
        setNav((prev) => ({ ...prev, screen: 'booking-detail-save-failed' }));
      }
    } catch (err) {
      setSaveError(t('bookingDetail.saveFailed'));
      setNav((prev) => ({ ...prev, screen: 'booking-detail-save-failed' }));
    } finally {
      setSavePending(false);
    }
  }, [selectedBooking, nav.noteText, t]);

  const handleRetry = useCallback(async () => {
    if (!selectedBooking || nav.noteText === undefined) return;
    setSavePending(true);
    setSaveError(null);
    try {
      const result = await saveNoteFixture(selectedBooking.id, nav.noteText);
      if (result.success) {
        // Success: update the booking's note and return to booking-detail
        setSelectedBooking((prev) => prev ? { ...prev, noteText: nav.noteText || '' } : null);
        setNav((prev) => ({ ...prev, screen: 'booking-detail' }));
      } else {
        // Failure: remain on save-failed screen with error
        setSaveError(t('bookingDetail.saveFailed'));
      }
    } catch (err) {
      setSaveError(t('bookingDetail.saveFailed'));
    } finally {
      setSavePending(false);
    }
  }, [selectedBooking, nav.noteText, t]);

  const handleBack = useCallback(() => {
    setNav({ screen: 'bookings-list' });
    setSaveError(null);
  }, []);

  const handleDiscardChanges = useCallback(() => {
    setNav({ screen: 'bookings-list' });
    setSaveError(null);
  }, []);

  // Load booking detail when navigating to that screen
  React.useEffect(() => {
    if (nav.screen === 'booking-detail' && nav.selectedBookingId && !selectedBooking) {
      handleLoadBookingDetail(nav.selectedBookingId);
    }
  }, [nav.screen, nav.selectedBookingId, selectedBooking, handleLoadBookingDetail]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {nav.screen === 'bookings-list' && (
        <BookingsList
          bookings={bookings}
          error={bookingsLoadError}
          onSelectBooking={handleSelectBooking}
        />
      )}
      {nav.screen === 'booking-detail' && selectedBooking && (
        <BookingDetail
          booking={selectedBooking}
          noteText={nav.noteText || ''}
          currentCharCount={nav.currentCharCount || 0}
          error={bookingDetailLoadError || saveError}
          savePending={savePending}
          onNoteChange={handleNoteChange}
          onSave={handleSaveNote}
          onBack={handleBack}
        />
      )}
      {nav.screen === 'booking-detail-save-failed' && selectedBooking && (
        <BookingDetailSaveFailed
          booking={selectedBooking}
          noteText={nav.noteText || ''}
          currentCharCount={nav.currentCharCount || 0}
          error={saveError}
          retryPending={savePending}
          onNoteChange={handleNoteChange}
          onRetry={handleRetry}
          onDiscardChanges={handleDiscardChanges}
        />
      )}
    </div>
  );
}

export default App;
