const translations = {
  'screen.bookings_list.title': 'My Hotel Bookings',
  'screen.bookings_list.no_bookings': 'No bookings found',
  'screen.booking_detail.title': 'Booking Details',
  'screen.booking_detail.note_label': 'Your Note',
  'screen.booking_detail.note_placeholder': 'Add a note about this booking',
  'screen.booking_detail.note_aria_label': 'Note for this booking (max 200 characters)',
  'action.back': 'Back',
  'action.back_to_bookings': 'Back to bookings list',
  'action.view_booking': 'View booking for {{ hotelName }}',
  'action.save_note': 'Save Note',
  'action.retry': 'Retry',
  'booking.confirmation': 'Confirmation: {{ confirmationNumber }}',
  'error.unable_to_load_bookings': 'Unable to load bookings',
  'error.could_not_load_booking': 'Could not load booking details',
  'error.failed_to_save_note': 'Failed to save your note. Please try again.',
  'state.loading': 'Loading...',
  'state.saving': 'Saving...',
  'state.retrying': 'Retrying...',
} as const;

export type TranslationKey = keyof typeof translations;

export function useTranslation() {
  return (key: TranslationKey): string => {
    return translations[key];
  };
}