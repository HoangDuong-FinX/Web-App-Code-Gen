export const t = (key: string): string => {
  const translations: Record<string, string> = {
    my_hotel_bookings: 'My Hotel Bookings',
    booking_details: 'Booking Details',
    loading: 'Loading...',
    bookings_load_error: 'Failed to load bookings',
    no_bookings_available: 'No bookings available',
    hotel: 'Hotel',
    check_in: 'Check-in',
    check_out: 'Check-out',
    location: 'Location',
    notes: 'Notes',
    add_note_placeholder: 'Add a note about this booking',
    booking_note_label: 'Booking note, maximum 200 characters',
    save_note_button: 'Save booking note',
    save_note: 'Save Note',
    saving: 'Saving...',
    note_saved_successfully: 'Note saved successfully',
    back: 'Back',
    back_to_bookings: 'Back to bookings',
    save_note_failed: 'Failed to save note. Please try again.',
    retry_save: 'Retry Save',
    retry_save_button: 'Retry saving the booking note',
    continue_editing: 'Continue Editing',
    continue_editing_button: 'Continue editing the booking note without saving',
  };

  return translations[key] || key;
};