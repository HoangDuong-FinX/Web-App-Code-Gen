export const searchResults = [
  {
    offer_id: 'offer_001',
    flight_number: 'VJ101',
    departure_time: '08:00',
    arrival_time: '10:00',
    origin: 'SGN',
    destination: 'HAN',
    aircraft_type: 'A321',
    fare_classes: [
      { class_code: 'ECONOMY', class_name: 'Economy', price_amount: 450000, available: true },
      { class_code: 'BUSINESS', class_name: 'Business', price_amount: 750000, available: true },
    ],
  },
  {
    offer_id: 'offer_002',
    flight_number: 'VJ102',
    departure_time: '14:00',
    arrival_time: '16:00',
    origin: 'SGN',
    destination: 'HAN',
    aircraft_type: 'A320',
    fare_classes: [
      { class_code: 'ECONOMY', class_name: 'Economy', price_amount: 380000, available: true },
      { class_code: 'BUSINESS', class_name: 'Business', price_amount: 650000, available: false },
    ],
  },
  {
    offer_id: 'offer_003',
    flight_number: 'VJ103',
    departure_time: '18:30',
    arrival_time: '20:30',
    origin: 'SGN',
    destination: 'HAN',
    aircraft_type: 'A321',
    fare_classes: [
      { class_code: 'ECONOMY', class_name: 'Economy', price_amount: 420000, available: true },
    ],
  },
];