import type { Category } from '../types';

export const FIXTURE_CATEGORIES: Category[] = [
  { id: 'cat-brand-toyota', name: 'Toyota', filterKey: 'brand', filterValue: 'Toyota' },
  { id: 'cat-brand-honda', name: 'Honda', filterKey: 'brand', filterValue: 'Honda' },
  { id: 'cat-brand-hyundai', name: 'Hyundai', filterKey: 'brand', filterValue: 'Hyundai' },
  { id: 'cat-brand-mazda', name: 'Mazda', filterKey: 'brand', filterValue: 'Mazda' },
  { id: 'cat-brand-vinfast', name: 'VinFast', filterKey: 'brand', filterValue: 'VinFast' },
  { id: 'cat-brand-kia', name: 'Kia', filterKey: 'brand', filterValue: 'Kia' },
  { id: 'cat-brand-ford', name: 'Ford', filterKey: 'brand', filterValue: 'Ford' },
  { id: 'cat-type-sedan', name: 'Sedan', filterKey: 'bodyType', filterValue: 'sedan' },
  { id: 'cat-type-suv', name: 'SUV', filterKey: 'bodyType', filterValue: 'suv' },
  { id: 'cat-type-pickup', name: 'B\u00e1n t\u1ea3i', filterKey: 'bodyType', filterValue: 'pickup' },
  { id: 'cat-fuel-electric', name: 'Xe \u0111i\u1ec7n', filterKey: 'fuelType', filterValue: 'electric' },
];
