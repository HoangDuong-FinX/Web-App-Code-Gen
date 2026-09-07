export const seatOptions = [
  // Front zone
  { row: 1, column: 1, seat_label: '1A', available: true, price_amount: 150000, zone: 'Front' as const },
  { row: 1, column: 2, seat_label: '1B', available: true, price_amount: 150000, zone: 'Front' as const },
  { row: 1, column: 3, seat_label: '1C', available: true, price_amount: 150000, zone: 'Front' as const },
  { row: 1, column: 4, seat_label: '1D', available: false, price_amount: null, zone: 'Front' as const },
  { row: 1, column: 5, seat_label: '1E', available: true, price_amount: 150000, zone: 'Front' as const },
  { row: 1, column: 6, seat_label: '1F', available: true, price_amount: 150000, zone: 'Front' as const },

  // Premium zone
  { row: 2, column: 1, seat_label: '2A', available: true, price_amount: 120000, zone: 'Premium' as const },
  { row: 2, column: 2, seat_label: '2B', available: true, price_amount: 120000, zone: 'Premium' as const },
  { row: 2, column: 3, seat_label: '2C', available: false, price_amount: null, zone: 'Premium' as const },
  { row: 2, column: 4, seat_label: '2D', available: true, price_amount: 120000, zone: 'Premium' as const },
  { row: 2, column: 5, seat_label: '2E', available: true, price_amount: 120000, zone: 'Premium' as const },
  { row: 2, column: 6, seat_label: '2F', available: true, price_amount: 120000, zone: 'Premium' as const },

  // Standard zone
  { row: 3, column: 1, seat_label: '3A', available: true, price_amount: 0, zone: 'Standard' as const },
  { row: 3, column: 2, seat_label: '3B', available: true, price_amount: 0, zone: 'Standard' as const },
  { row: 3, column: 3, seat_label: '3C', available: true, price_amount: 0, zone: 'Standard' as const },
  { row: 3, column: 4, seat_label: '3D', available: true, price_amount: 0, zone: 'Standard' as const },
  { row: 3, column: 5, seat_label: '3E', available: true, price_amount: 0, zone: 'Standard' as const },
  { row: 3, column: 6, seat_label: '3F', available: true, price_amount: 0, zone: 'Standard' as const },
];
