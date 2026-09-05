// English translations for probe-hotel-note app
export const en = {
  // Screen titles
  'screen.bookings-list.title': 'My Bookings',
  'screen.bookings-list.loading': 'Loading bookings...',
  'screen.bookings-list.empty': 'No bookings found',
  'screen.bookings-list.error': 'Error loading bookings',
  
  'screen.booking-detail.title': 'Booking Details',
  'screen.booking-detail.back-label': 'Back to bookings list',
  'screen.booking-detail.reference-label': 'Reference',
  'screen.booking-detail.guests-label': 'Guests',
  'screen.booking-detail.note-label': 'My Note',
  'screen.booking-detail.note-placeholder': 'Add a note (up to 200 characters)',
  'screen.booking-detail.note-aria': 'Note input field, maximum 200 characters',
  'screen.booking-detail.char-count': '{count} / 200',
  'screen.booking-detail.save-button': 'Save Note',
  'screen.booking-detail.saving-button': 'Saving...',
  'screen.booking-detail.success-message': 'Note saved',
  'screen.booking-detail.success-aria': 'Note saved successfully',
  
  'screen.save-failed.title': 'Save Failed',
  'screen.save-failed.error-message': 'Unable to save your note. Please check your connection and try again.',
  'screen.save-failed.retry-button': 'Retry',
  'screen.save-failed.retrying-button': 'Retrying...',
  'screen.save-failed.retry-aria': 'Retry saving the note',
  'screen.save-failed.close-button': 'Close',
  'screen.save-failed.close-aria': 'Close error and return to booking detail',
} as const;