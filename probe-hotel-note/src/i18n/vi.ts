export const i18n = {
  my_hotel_bookings: 'My Hotel Bookings',
  booking_details: 'Booking Details',
  personal_note: 'Personal Note (optional)',
  add_personal_note: 'Add a personal note...',
  check_in: 'Check-in',
  check_out: 'Check-out',
  reference: 'Reference',
  characters: 'characters',
  back: 'Back',
  save_note: 'Save Note',
  retry: 'Retry',
  discard_changes: 'Discard Changes',
  loading: 'Loading...',
  saving: 'Saving...',
  note_saved: 'Note saved',
  error_load_bookings: 'Unable to load bookings',
  error_load_booking_detail: 'Unable to load booking details',
  error_save_note: 'Failed to save note. Please try again.',
  error_save_note_default: 'Failed to save note. Please try again.',
  error_message: 'Error message',
  note_input_aria_label: 'Personal note for this booking, maximum 200 characters',
} as const;

export function t(key: keyof typeof i18n): string {
  return i18n[key];
}
