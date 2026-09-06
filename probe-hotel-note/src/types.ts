export interface Booking {
  bookingId: string;
  hotelName: string;
  dateRange: string;
  confirmationNumber: string;
}

export interface BookingDetail extends Booking {
  existingNote: string | null;
}

export interface SaveNoteRequest {
  bookingId: string;
  noteText: string;
}

export interface SaveNoteResponse {
  success: boolean;
  message?: string;
}