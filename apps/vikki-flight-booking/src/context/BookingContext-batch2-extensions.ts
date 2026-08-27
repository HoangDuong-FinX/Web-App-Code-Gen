// These action types and reducer cases must be MERGED into src/context/BookingContext.tsx from batch 1.

// --- Additional action types to add to the BookingAction union ---
//
// | { type: 'SET_SELECTED_SERVICES'; payload: ServiceSelection[] }
// | { type: 'SET_SELECTED_SEATS'; payload: SeatSelection[] }
// | { type: 'SET_RETURN_SELECTED_SERVICES'; payload: ServiceSelection[] }
// | { type: 'SET_RETURN_SELECTED_SEATS'; payload: SeatSelection[] }
// | { type: 'SET_PAYMENT_INQUIRY'; payload: PaymentInquiry }
//
// --- Additional reducer cases ---
//
// case 'SET_SELECTED_SERVICES':
//   return { ...state, selectedServices: action.payload };
// case 'SET_SELECTED_SEATS':
//   return { ...state, selectedSeats: action.payload };
// case 'SET_RETURN_SELECTED_SERVICES':
//   return { ...state, returnSelectedServices: action.payload };
// case 'SET_RETURN_SELECTED_SEATS':
//   return { ...state, returnSelectedSeats: action.payload };
// case 'SET_PAYMENT_INQUIRY':
//   return { ...state, paymentInquiry: action.payload };
//
// NOTE: The BookingState type in src/types/index.ts already includes these fields
// (selectedServices, selectedSeats, returnSelectedServices, returnSelectedSeats, paymentInquiry).
// The reducer just needs the new cases above.
//
// For batch 2, the screens import useBooking() and dispatch these actions directly.
// No new context provider changes are needed beyond adding the reducer cases.

export {}; // Module marker — this file documents the merge instructions.
