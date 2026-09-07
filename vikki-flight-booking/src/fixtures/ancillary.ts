// Fixture: Ancillary catalog
// Waiting on: GET /internal/vja/sessions/{id}/ancillary-options

export interface MealOption {
  optionId: string;
  name: string;
  priceAmount: number;
  available: boolean;
}

export interface BaggageOption {
  optionId: string;
  name: string;
  priceAmount: number;
  available: boolean;
}

export interface AncillaryCatalog {
  meals: MealOption[];
  baggage: BaggageOption[];
}

type AncillaryOutcome = 'success' | 'fail';
let _outcome: AncillaryOutcome = 'success';

export function setAncillaryOutcome(o: AncillaryOutcome): void {
  _outcome = o;
}

export const FIXTURE_MEALS: MealOption[] = [
  { optionId: 'meal_001', name: '🍖 Cơm gà', priceAmount: 150000, available: true },
  { optionId: 'meal_002', name: '🍜 Phở bò', priceAmount: 160000, available: true },
  { optionId: 'meal_003', name: '🥗 Salad chay', priceAmount: 120000, available: true },
];

export const FIXTURE_BAGGAGE: BaggageOption[] = [
  { optionId: 'bag_001', name: 'Hành lý ký gửi +2kg', priceAmount: 200000, available: true },
  { optionId: 'bag_002', name: 'Hành lý ký gửi 20kg', priceAmount: 500000, available: true },
  { optionId: 'bag_003', name: 'Hành lý ký gửi 30kg', priceAmount: 700000, available: true },
  { optionId: 'bag_004', name: 'Hành lý ký gửi 40kg', priceAmount: 900000, available: true },
];

export async function fixtureLoadAncillaryCatalog(_sessionId: string): Promise<AncillaryCatalog> {
  await new Promise(r => setTimeout(r, 300));
  if (_outcome === 'fail') throw new Error('fixture: ancillary-catalog failed');
  return { meals: FIXTURE_MEALS, baggage: FIXTURE_BAGGAGE };
}

export async function fixtureSubmitAncillarySelections(
  _sessionId: string,
  _selections: Array<{ passengerId: string; optionId: string }>,
): Promise<void> {
  await new Promise(r => setTimeout(r, 300));
  if (_outcome === 'fail') throw new Error('fixture: submit-ancillary failed');
}

export async function fixtureSubmitSeatSelections(
  _sessionId: string,
  _selections: Array<{ passengerIndex: number; seatNumber: string }>,
): Promise<void> {
  await new Promise(r => setTimeout(r, 300));
  if (_outcome === 'fail') throw new Error('fixture: submit-seats failed');
}
