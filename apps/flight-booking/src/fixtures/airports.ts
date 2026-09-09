import type { AirportGroup } from '../types';

export const fixtureAirports: AirportGroup[] = [
  {
    groupName: 'Popular',
    airports: [
      { airportCode: 'SGN', airportName: 'Tan Son Nhat', cityName: 'Ho Chi Minh City' },
      { airportCode: 'HAN', airportName: 'Noi Bai', cityName: 'Hanoi' },
      { airportCode: 'DAD', airportName: 'Da Nang', cityName: 'Da Nang' },
    ],
  },
  {
    groupName: 'Vietnam',
    airports: [
      { airportCode: 'CXR', airportName: 'Cam Ranh', cityName: 'Nha Trang' },
      { airportCode: 'PQC', airportName: 'Phu Quoc', cityName: 'Phu Quoc' },
      { airportCode: 'HUI', airportName: 'Phu Bai', cityName: 'Hue' },
      { airportCode: 'VDO', airportName: 'Van Don', cityName: 'Quang Ninh' },
    ],
  },
  {
    groupName: 'International',
    airports: [
      { airportCode: 'BKK', airportName: 'Suvarnabhumi', cityName: 'Bangkok' },
      { airportCode: 'ICN', airportName: 'Incheon', cityName: 'Seoul' },
      { airportCode: 'NRT', airportName: 'Narita', cityName: 'Tokyo' },
    ],
  },
];
