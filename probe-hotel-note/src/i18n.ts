// i18n.ts
const translations = {
  'bookings-list.title': 'Hotel Bookings',
  'booking-detail.title': 'Booking Detail',
  'booking-detail.label-add-note': 'Add a note',
  'booking-detail.button-save': 'Save Note',
  'booking-detail.success-message': 'Note saved',
  'booking-detail.placeholder-note': 'Enter your note here',
  'booking-detail.aria-label-note': 'Booking note, maximum 200 characters',
  'booking-detail.character-count': '{current} / 200',
  'booking-detail.reference-label': 'Reference: {id}',
  'booking-detail.dates-label': '{checkIn} – {checkOut}',
  'booking-detail-save-failed.title': 'Booking Detail',
  'booking-detail-save-failed.error-message': 'Failed to save note. Please try again.',
  'booking-detail-save-failed.button-retry': 'Retry',
  'booking-detail-save-failed.button-discard': 'Discard',
  'booking-detail-save-failed.label-add-note': 'Add a note',
  'booking-detail-save-failed.reference-label': 'Reference: {id}',
  'booking-detail-save-failed.dates-label': '{checkIn} – {checkOut}',
  'booking-detail-save-failed.character-count': '{current} / 200',
  'booking-detail-save-failed.placeholder-note': 'Enter your note here',
  'booking-detail-save-failed.aria-label-note': 'Booking note, maximum 200 characters',
  'bookings-list.button-back': 'Back to bookings list',
  'booking-detail.button-back': 'Back to bookings list',
  'booking-detail-save-failed.button-back': 'Back to bookings list',
  'error.load-bookings-failed': 'Unable to load bookings',
  'error.retry': 'Retry',
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
