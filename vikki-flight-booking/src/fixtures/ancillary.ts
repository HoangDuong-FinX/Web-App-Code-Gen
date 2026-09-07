// Ancillary catalog fixture
import type { MealOption, BaggageOption } from '../types/state';

type FixtureOutcome = 'success' | 'fail';
let catalogOutcome: FixtureOutcome = 'success';
let ancillarySubmitOutcome: FixtureOutcome = 'success';
let seatSubmitOutcome: FixtureOutcome = 'success';

export function setFetchAncillaryCatalogOutcome(o: FixtureOutcome): void { catalogOutcome = o; }
export function setSubmitAncillaryOutcome(o: FixtureOutcome): void { ancillarySubmitOutcome = o; }
export function setSubmitSeatOutcome(o: FixtureOutcome): void { seatSubmitOutcome = o; }

export const MEALS: MealOption[] = [
  { optionId: 'meal_001', name: '🍖 Cơm gà', priceAmount: 150000, available: true },
  { optionId: 'meal_002', name: '🌿 Cơm chay', priceAmount: 130000, available: true },
  { optionId: 'meal_003', name: '🍜 Mì xào', priceAmount: 120000, available: true },
];

export const BAGGAGE: BaggageOption[] = [
  { optionId: 'bag_2kg', name: 'Hành lý ký gửi +2kg', priceAmount: 200000, available: true },
  { optionId: 'bag_20kg', name: 'Hành lý ký gửi 20kg', priceAmount: 500000, available: true },
  { optionId: 'bag_30kg', name: 'Hành lý ký gửi 30kg', priceAmount: 750000, available: true },
];

export interface AncillaryCatalog {
  meals: MealOption[];
  baggage: BaggageOption[];
}

export async function fetchAncillaryCatalog(): Promise<AncillaryCatalog> {
  await new Promise(r => setTimeout(r, 400));
  if (catalogOutcome === 'fail') throw new Error('fixture: fetch-ancillary-catalog failed');
  return { meals: MEALS, baggage: BAGGAGE };
}

export async function submitAncillarySelections(): Promise<void> {
  await new Promise(r => setTimeout(r, 500));
  if (ancillarySubmitOutcome === 'fail') throw new Error('fixture: submit-ancillary-selections failed');
}

export async function submitSeatSelections(): Promise<void> {
  await new Promise(r => setTimeout(r, 500));
  if (seatSubmitOutcome === 'fail') throw new Error('fixture: submit-seat-selections failed');
}

export async function submitPassengers(): Promise<string[]> {
  await new Promise(r => setTimeout(r, 600));
  // Returns passenger IDs
  return ['pax_001', 'pax_002', 'pax_003'];
}
