import type { AncillaryItem } from '../types';

let shouldFail = false;

export function setLoadAncillariesOutcome(fail: boolean): void {
  shouldFail = fail;
}

export function loadAncillariesFixture(): Promise<AncillaryItem[]> {
  if (shouldFail) {
    return Promise.reject(new Error('fixture: ancillaries load failed'));
  }
  return Promise.resolve([
    { option_id: 'meal_01', name: 'Phở bò', description: 'Phở bò truyền thống', unit_price: 85000, group: 'meal' },
    { option_id: 'meal_02', name: 'Cơm gà', description: 'Cơm gà xối mỡ', unit_price: 75000, group: 'meal' },
    { option_id: 'meal_03', name: 'Mì xào', description: 'Mì xào hải sản', unit_price: 80000, group: 'meal' },
    { option_id: 'bag_01', name: 'Hành lý 20kg', description: 'Hành lý ký gửi 20kg', unit_price: 200000, group: 'baggage' },
    { option_id: 'bag_02', name: 'Hành lý 30kg', description: 'Hành lý ký gửi 30kg', unit_price: 350000, group: 'baggage' },
    { option_id: 'bag_03', name: 'Hành lý 40kg', description: 'Hành lý ký gửi 40kg', unit_price: 500000, group: 'baggage' },
  ]);
}