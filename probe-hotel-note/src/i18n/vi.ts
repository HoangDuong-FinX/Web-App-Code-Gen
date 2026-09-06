// Translation table for probe-hotel-note app
// All user-facing strings are keyed here for i18n

const translations: Record<string, string> = {
  // Bookings list screen
  bookings_list_title: 'My Hotel Bookings',
  no_bookings: 'No bookings found',
  select_booking: 'Select booking',
  loading: 'Loading...',
  retry: 'Retry',

  // Booking detail screen
  back: 'Back',
  back_to_bookings_list: 'Back to bookings list',
  personal_note: 'Personal Note',
  add_a_note: 'Add a note...',
  personal_note_input: 'Personal note text input, maximum 200 characters',
  save_note: 'Save Note',
  saving: 'Saving...',

  // Error messages
  error_unable_to_load_bookings: 'Unable to load bookings',
  error_unable_to_load_booking_details: 'Unable to load booking details',
  error_save_failed: 'Failed to save your note. Please try again.',
};

export function t(key: string): string {
  return translations[key] || key;
}
