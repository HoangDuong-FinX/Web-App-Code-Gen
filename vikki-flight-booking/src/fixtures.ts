// All bindings are fixtures in this standalone environment
// Real endpoints would be at /internal/vja, /sdk.payment, etc.

export let fixtureOverrides = {
  loadAirports: 'success' as 'success' | 'error',
  loadCityPairs: 'success' as 'success' | 'error',
  submitSearch: 'success' as 'success' | 'error',
  submitPassengers: 'success' as 'success' | 'error',
  submitServices: 'success' as 'success' | 'error',
  initializePayment: 'success' as 'success' | 'error' | 'simulated',
};

export function setFixtureOutcome(fixture: keyof typeof fixtureOverrides, outcome: string) {
  (fixtureOverrides as any)[fixture] = outcome;
}

const airports = [
  { code: 'SGN', name: 'Sân Bay Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'Vietnam', group: 'Popular' as const },
  { code: 'HAN', name: 'Sân Bay Nội Bài', city: 'Hà Nội', country: 'Vietnam', group: 'Popular' as const },
  { code: 'DLI', name: 'Sân Bay Liên Khương', city: 'Đà Lạt', country: 'Vietnam', group: 'Vietnam' as const },
  { code: 'HUI', name: 'Sân Bay Phú Bài', city: 'Huế', country: 'Vietnam', group: 'Vietnam' as const },
  { code: 'DAD', name: 'Sân Bay Quốc Tế Đà Nẵng', city: 'Đà Nẵng', country: 'Vietnam', group: 'Vietnam' as const },
];

const cityPairs = [
  { origin: 'SGN', destination: 'DLI' },
  { origin: 'DLI', destination: 'SGN' },
  { origin: 'SGN', destination: 'HAN' },
  { origin: 'HAN', destination: 'SGN' },
  { origin: 'SGN', destination: 'HUI' },
  { origin: 'HUI', destination: 'SGN' },
];

const flightOffers = [
  {
    offer_id: 'VJ123_ECO_1',
    flight_number: 'VJ123',
    departure_time: '08:45',
    arrival_time: '10:30',
    aircraft_type: 'Airbus A321',
    duration_minutes: 105,
    available_seats: 45,
    price_amount: 2500000,
    stops: 0,
  },
  {
    offer_id: 'VJ456_ECO_1',
    flight_number: 'VJ456',
    departure_time: '14:00',
    arrival_time: '15:45',
    aircraft_type: 'Airbus A320',
    duration_minutes: 105,
    available_seats: 30,
    price_amount: 2800000,
    stops: 0,
  },
];

export async function loadAirports() {
  if (fixtureOverrides.loadAirports === 'error') {
    throw new Error('Failed to load airports');
  }
  return airports;
}

export async function loadCityPairs() {
  if (fixtureOverrides.loadCityPairs === 'error') {
    throw new Error('Failed to load city pairs');
  }
  return cityPairs;
}

export async function submitSearch(criteria: any) {
  if (fixtureOverrides.submitSearch === 'error') {
    throw new Error('Search failed');
  }
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
  return {
    session_id: `sess_${Math.random().toString(36).substring(7)}`,
    expires_at: expiresAt.toISOString(),
    offers: flightOffers,
  };
}

export async function submitPassengers(sessionId: string, passengers: any) {
  if (fixtureOverrides.submitPassengers === 'error') {
    throw new Error('Passenger submission failed');
  }
  return {
    passengers: passengers.map((p: any, i: number) => ({
      ...p,
      passenger_id: `pax_${i + 1}`,
    })),
  };
}

export async function submitAncillarySelections(sessionId: string, selections: any) {
  if (fixtureOverrides.submitServices === 'error') {
    throw new Error('Service submission failed');
  }
  return { selections };
}

export async function submitSeatSelections(sessionId: string, selections: any) {
  if (fixtureOverrides.submitServices === 'error') {
    throw new Error('Seat submission failed');
  }
  return { selections };
}

export async function fetchPaymentInquiry(sessionId: string) {
  return {
    booking_key: 'ABCD1234',
    amount: 6000000,
  };
}

export async function initiatePayment(payload: any) {
  if (fixtureOverrides.initializePayment === 'error') {
    throw new Error('Payment failed');
  }
  if (fixtureOverrides.initializePayment === 'simulated') {
    return {
      paymentSessionId: `psid_${Math.random().toString(36).substring(7)}`,
      status: 'success',
      simulated: true,
    };
  }
  return {
    paymentSessionId: `psid_${Math.random().toString(36).substring(7)}`,
    status: 'success',
    transactionId: `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  };
}
