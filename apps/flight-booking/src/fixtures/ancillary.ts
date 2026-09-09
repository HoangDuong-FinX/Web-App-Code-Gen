import type { AncillaryOption } from '../types';

export const fixtureAncillaryMeals: AncillaryOption[] = [
  { optionId: 'meal-1', name: 'Pho Bo', category: 'meal', priceAmount: 89000, imageUrl: '' },
  { optionId: 'meal-2', name: 'Com Ga', category: 'meal', priceAmount: 79000, imageUrl: '' },
  { optionId: 'meal-3', name: 'Banh Mi', category: 'meal', priceAmount: 59000, imageUrl: '' },
  { optionId: 'meal-4', name: 'Bun Cha', category: 'meal', priceAmount: 99000, imageUrl: '' },
];

export const fixtureAncillaryBaggage: AncillaryOption[] = [
  { optionId: 'bag-1', name: '20kg Checked Bag', category: 'baggage', priceAmount: 200000, imageUrl: '' },
  { optionId: 'bag-2', name: '30kg Checked Bag', category: 'baggage', priceAmount: 350000, imageUrl: '' },
  { optionId: 'bag-3', name: 'Airport Transfer', category: 'transfer', priceAmount: 150000, imageUrl: '' },
];

let fixtureAncillaryOutcome: 'success' | 'fail' = 'success';
export function setAncillaryOutcome(outcome: 'success' | 'fail'): void {
  fixtureAncillaryOutcome = outcome;
}
export function getAncillaryOutcome(): 'success' | 'fail' {
  return fixtureAncillaryOutcome;
}
