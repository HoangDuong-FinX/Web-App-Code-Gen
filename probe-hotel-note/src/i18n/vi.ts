export const translations = {
  'app.title': 'My Bookings',
  'bookings.list.heading': 'My Bookings',
  'bookings.empty': 'No bookings available',
  'booking.detail.heading': 'Booking Details',
  'booking.detail.hotel': 'Hotel Name',
  'booking.detail.checkIn': 'Check-in',
  'booking.detail.checkOut': 'Check-out',
  'booking.detail.confirmation': 'Confirmation #',
  'booking.note.label': 'Add a note (up to 200 characters)',
  'booking.note.placeholder': 'Enter your note here',
  'booking.note.charCount': '{current} / 200 characters',
  'booking.note.saveButton': 'Save Note',
  'booking.note.retryButton': 'Retry',
  'booking.note.savingLabel': 'Save note to booking',
  'booking.note.retryLabel': 'Retry saving note',
  'booking.note.inputLabel': 'Note input field',
  'booking.note.inputDescription': 'Free-text note, up to 200 characters',
  'booking.note.inputDescriptionWithPreserved': 'Free-text note, up to 200 characters; text preserved from failed attempt',
  'booking.note.successMessage': 'Note saved successfully',
  'booking.note.errorMessage': 'Failed to save note. Please try again.',
};

export function t(key: string, params?: Record<string, string | number>): string {
  let text = translations[key as keyof typeof translations] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}
