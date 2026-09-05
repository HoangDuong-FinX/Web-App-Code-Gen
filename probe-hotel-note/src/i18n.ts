export const i18n = {
  'bookings-list.title': 'My Hotel Bookings',
  'bookings-list.empty': 'No bookings found',
  'bookings-list.error': 'Unable to load bookings. Please refresh.',
  'bookings-list.retry': 'Retry',
  'booking-detail.back': 'Back',
  'booking-detail.note-label': 'Personal Note',
  'booking-detail.note-placeholder': 'Add a personal note...',
  'booking-detail.note-aria': 'Personal note for this booking (max 200 characters)',
  'booking-detail.char-count': '{current} / 200',
  'booking-detail.save-button': 'Save Note',
  'booking-detail.save-aria': 'Save the personal note',
  'booking-detail.saving': 'Saving...',
  'booking-detail-save-failed.title': 'Save Failed',
  'booking-detail-save-failed.error': 'Failed to save note. Please try again.',
  'booking-detail-save-failed.retry': 'Retry Save',
  'booking-detail-save-failed.retry-aria': 'Retry saving the personal note',
  'booking-card.aria': 'View booking details',
  'booking-detail.dates': '{checkIn} — {checkOut}',
} as const;

export function t(key: keyof typeof i18n, params?: Record<string, string | number>): string {
  let text = i18n[key];
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}
