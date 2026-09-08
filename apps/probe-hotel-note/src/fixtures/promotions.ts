import type { Promotion } from '../types';

let promoListOutcome: 'success' | 'fail' = 'success';
export function setPromoListOutcome(v: 'success' | 'fail'): void { promoListOutcome = v; }

let promoDetailOutcome: 'success' | 'fail' = 'success';
export function setPromoDetailOutcome(v: 'success' | 'fail'): void { promoDetailOutcome = v; }

const samplePromotions: Promotion[] = [
  {
    id: 'promo-1', title: 'Gi\u1ea3m 30 tri\u1ec7u cho Toyota Camry', bannerUrl: 'https://placehold.co/800x450/3b82f6/ffffff?text=Giam+30+Trieu',
    validity: '01/01/2024 - 31/03/2024', applicableModelsPreview: 'Toyota Camry 2024',
    termsAndConditions: '\u00c1p d\u1ee5ng cho kh\u00e1ch h\u00e0ng mua xe Toyota Camry 2024 phi\u00ean b\u1ea3n 2.5Q tr\u1edf l\u00ean.',
    eligibleCars: [{ id: 'car-1', name: 'Toyota Camry 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=Camry', formattedPrice: '1.050.000.000 \u20ab', promoDiscountTag: '-30 tri\u1ec7u' }],
  },
  {
    id: 'promo-2', title: 'T\u1eb7ng b\u1ea3o hi\u1ec3m 1 n\u0103m cho Mazda CX-5', bannerUrl: 'https://placehold.co/800x450/10b981/ffffff?text=Tang+Bao+Hiem',
    validity: '15/01/2024 - 28/02/2024', applicableModelsPreview: 'Mazda CX-5 2024',
    termsAndConditions: 'T\u1eb7ng g\u00f3i b\u1ea3o hi\u1ec3m th\u00e2n v\u1ecf 1 n\u0103m tr\u1ecb gi\u00e1 15 tri\u1ec7u \u0111\u1ed3ng.',
    eligibleCars: [{ id: 'car-3', name: 'Mazda CX-5 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=CX-5', formattedPrice: '839.000.000 \u20ab', promoDiscountTag: 'T\u1eb7ng BH 1 n\u0103m' }],
  },
  {
    id: 'promo-3', title: '\u01afu \u0111\u00e3i pin tr\u1ecdn \u0111\u1eddi VinFast VF 8', bannerUrl: 'https://placehold.co/800x450/8b5cf6/ffffff?text=Pin+Tron+Doi',
    validity: '01/01/2024 - 30/06/2024', applicableModelsPreview: 'VinFast VF 8 2024',
    termsAndConditions: 'Ch\u01b0\u01a1ng tr\u00ecnh \u01b0u \u0111\u00e3i pin tr\u1ecdn \u0111\u1eddi cho kh\u00e1ch h\u00e0ng mua VinFast VF 8.',
    eligibleCars: [{ id: 'car-5', name: 'VinFast VF 8 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=VF8', formattedPrice: '1.129.000.000 \u20ab', promoDiscountTag: 'Pin tr\u1ecdn \u0111\u1eddi' }],
  },
];

export async function loadHomePromotions(): Promise<Promotion[]> {
  await new Promise(r => setTimeout(r, 200));
  if (promoListOutcome === 'fail') throw new Error('Network error');
  return samplePromotions;
}

export async function loadPromotionsList(): Promise<Promotion[]> {
  await new Promise(r => setTimeout(r, 300));
  if (promoListOutcome === 'fail') throw new Error('Network error');
  return samplePromotions;
}

export async function loadPromoDetail(promoId: string): Promise<Promotion | null> {
  await new Promise(r => setTimeout(r, 200));
  if (promoDetailOutcome === 'fail') throw new Error('Network error');
  return samplePromotions.find(p => p.id === promoId) ?? null;
}

export { samplePromotions };
