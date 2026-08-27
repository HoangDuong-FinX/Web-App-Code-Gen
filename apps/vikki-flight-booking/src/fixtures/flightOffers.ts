import type { Flight } from '../types';

export const mockFlightOffers: Flight[] = [
  {
    id: 'vj001',
    airline: 'Vietjet Air',
    departureTime: '06:00',
    arrivalTime: '08:30',
    duration: '2h 30m',
    stops: 0,
    price: 1250000,
  },
  {
    id: 'vj002',
    airline: 'Vietjet Air',
    departureTime: '09:15',
    arrivalTime: '11:45',
    duration: '2h 30m',
    stops: 0,
    price: 1100000,
  },
  {
    id: 'vj003',
    airline: 'Vietjet Air',
    departureTime: '14:00',
    arrivalTime: '16:30',
    duration: '2h 30m',
    stops: 1,
    price: 950000,
  },
  {
    id: 'vj004',
    airline: 'Vietjet Air',
    departureTime: '18:30',
    arrivalTime: '21:00',
    duration: '2h 30m',
    stops: 0,
    price: 1350000,
  },
];
