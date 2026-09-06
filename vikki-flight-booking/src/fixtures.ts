import { Airport, CityPair, FlightOffer, AncillaryOption, Seat } from './types';

let airportLoadFailure = false;
let cityPairsLoadFailure = false;
let searchFailure = false;
let passengersSubmitFailure = false;
let ancillarySubmitFailure = false;
let seatMapLoadFailure = false;
let paymentFailure = false;

export const setFixtureOutcome = (binding: string, outcome: 'success' | 'fail') => {
  if (binding === 'load-airports') airportLoadFailure = outcome === 'fail';
  if (binding === 'load-city-pairs') cityPairsLoadFailure = outcome === 'fail';
  if (binding === 'submit-search') searchFailure = outcome === 'fail';
  if (binding === 'submit-passengers') passengersSubmitFailure = outcome === 'fail';
  if (binding === 'submit-ancillary-selections') ancillarySubmitFailure = outcome === 'fail';
  if (binding === 'fetch-seat-map') seatMapLoadFailure = outcome === 'fail';
  if (binding === 'initiate-payment') paymentFailure = outcome === 'fail';
};

export const fixtureAirports = (): Promise<Airport[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (airportLoadFailure) {
        reject(new Error('Failed to load airports'));
      } else {
        resolve([
          { code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'VN', group: 'Popular' },
          { code: 'HAN', name: 'Nội Bài', city: 'Hà Nội', country: 'VN', group: 'Popular' },
          { code: 'DLI', name: 'Liên Khương', city: 'Đà Lạt', country: 'VN', group: 'Vietnam' },
          { code: 'DAD', name: 'Quốc Tế Đà Nẵng', city: 'Đà Nẵng', country: 'VN', group: 'Vietnam' },
          { code: 'HUI', name: 'Phú Bài', city: 'Huế', country: 'VN', group: 'Vietnam' },
          { code: 'CAN', name: 'Phú Quốc', city: 'Phú Quốc', country: 'VN', group: 'Vietnam' },
          { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'TH', group: 'International' },
          { code: 'PNH', name: 'Phnom Penh', city: 'Phnom Penh', country: 'KH', group: 'International' },
        ]);
      }
    }, 300);
  });
};

export const fixtureCityPairs = (): Promise<CityPair[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (cityPairsLoadFailure) {
        reject(new Error('Failed to load city pairs'));
      } else {
        resolve([
          { origin: 'SGN', destination: 'HAN' },
          { origin: 'HAN', destination: 'SGN' },
          { origin: 'SGN', destination: 'DLI' },
          { origin: 'DLI', destination: 'SGN' },
          { origin: 'SGN', destination: 'DAD' },
          { origin: 'DAD', destination: 'SGN' },
          { origin: 'HAN', destination: 'DLI' },
          { origin: 'DLI', destination: 'HAN' },
          { origin: 'SGN', destination: 'BKK' },
          { origin: 'BKK', destination: 'SGN' },
        ]);
      }
    }, 300);
  });
};

export const fixtureSearch = (criteria: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (searchFailure) {
        reject(new Error('Search failed'));
      } else {
        const sessionId = `sess_${Date.now()}`;
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        resolve({
          session_id: sessionId,
          expires_at: expiresAt,
          offers: [
            {
              offer_id: `off_${sessionId}_1`,
              flights: [
                {
                  flight_number: 'VJ123',
                  departure_time: '08:45',
                  arrival_time: '10:30',
                  aircraft_type: 'Airbus A321',
                  stops: 0,
                },
              ],
              fare_classes: [
                { cabin_class: 'Eco', price_amount: 2500000, available_seats: 45, baggage_allowance: '7kg' },
                { cabin_class: 'Premium', price_amount: 3500000, available_seats: 20, baggage_allowance: '15kg' },
              ],
            },
            {
              offer_id: `off_${sessionId}_2`,
              flights: [
                {
                  flight_number: 'VJ456',
                  departure_time: '14:00',
                  arrival_time: '15:45',
                  aircraft_type: 'Airbus A320',
                  stops: 0,
                },
              ],
              fare_classes: [
                { cabin_class: 'Eco', price_amount: 2300000, available_seats: 60, baggage_allowance: '7kg' },
              ],
            },
          ],
        });
      }
    }, 500);
  });
};

export const fixturePassengersSubmit = (): Promise<{ passengers: any[] }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (passengersSubmitFailure) {
        reject(new Error('Failed to submit passengers'));
      } else {
        resolve({
          passengers: [
            { passenger_id: 'pax_1', last_name: 'Ngô', first_name: 'Minh Hải' },
            { passenger_id: 'pax_2', last_name: 'Trần', first_name: 'Thị Linh' },
            { passenger_id: 'pax_3', last_name: 'Bùi', first_name: 'Gia Bảo' },
          ],
        });
      }
    }, 300);
  });
};

export const fixtureAncillaryOptions = (): Promise<{ meals: AncillaryOption[]; baggage: AncillaryOption[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        meals: [
          { option_id: 'meal_1', name: 'Cơm gà', price_amount: 150000, available: true },
          { option_id: 'meal_2', name: 'Cơm bò', price_amount: 150000, available: true },
          { option_id: 'meal_3', name: 'Mì gà', price_amount: 100000, available: true },
        ],
        baggage: [
          { option_id: 'bag_1', name: 'Hành lý +2kg', price_amount: 200000, available: true },
          { option_id: 'bag_2', name: 'Hành lý +5kg', price_amount: 400000, available: true },
        ],
      });
    }, 300);
  });
};

export const fixtureSeatMap = (): Promise<{ seats: Seat[] }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (seatMapLoadFailure) {
        reject(new Error('Failed to load seat map'));
      } else {
        const seats: Seat[] = [];
        const zones: Array<{ zone: 'Front' | 'Premium' | 'Standard' | 'Relax'; price: number | null }> = [
          { zone: 'Front', price: 500000 },
          { zone: 'Premium', price: 350000 },
          { zone: 'Standard', price: 0 },
          { zone: 'Relax', price: null },
        ];
        let seatNum = 1;
        zones.forEach(({ zone, price }) => {
          for (let i = 0; i < 30; i++) {
            const row = Math.floor(i / 6) + 1;
            const col = String.fromCharCode(65 + (i % 6));
            const available = Math.random() > 0.2;
            seats.push({
              seat_number: `${row}${col}`,
              zone,
              price_amount: available ? price : price,
              available,
            });
            seatNum++;
          }
        });
        resolve({ seats });
      }
    }, 300);
  });
};

export const fixturePaymentInquiry = (): Promise<{ booking_key: string; amount: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        booking_key: 'ABCD1234',
        amount: 6000000,
      });
    }, 200);
  });
};

export const fixtureInitiatePayment = (): Promise<{ paymentSessionId: string; status: string; transactionId?: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (paymentFailure) {
        reject(new Error('Payment rejected by hub'));
      } else {
        resolve({
          paymentSessionId: `psess_${Date.now()}`,
          status: 'success',
          transactionId: 'TXN123456',
        });
      }
    }, 800);
  });
};
