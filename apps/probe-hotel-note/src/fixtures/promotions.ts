import type { Promotion } from '../types';

let promoListOutcome: 'success' | 'fail' = 'success';
export function setPromoListOutcome(v: 'success' | 'fail'): void { promoListOutcome = v; }

let promoDetailOutcome: 'success' | 'fail' = 'success';
export function setPromoDetailOutcome(v: 'success' | 'fail'): void { promoDetailOutcome = v; }

const samplePromotions: Promotion[] = [
  {
    id: 'promo-1', title: 'Giảm 30 triệu cho Toyota Camry', bannerUrl: 'https://placehold.co/800x450/3b82f6/ffffff?text=Giam+30+Trieu',
    validity: '01/01/2024 - 31/03/2024', applicableModelsPreview: 'Toyota Camry 2024',
    termsAndConditions: 'Áp dụng cho khách hàng mua xe Toyota Camry 2024 phiên bản 2.5Q trở lên. Giảm trực tiếp vào giá bán. Không áp dụng đồng thời với các chương trình khuyến mãi khác.',
    eligibleCars: [{ id: 'car-1', name: 'Toyota Camry 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=Camry', formattedPrice: '1.050.000.000 ₫', promoDiscountTag: '-30 triệu' }],
  },
  {
    id: 'promo-2', title: 'Tặng bảo hiểm 1 năm cho Mazda CX-5', bannerUrl: 'https://placehold.co/800x450/10b981/ffffff?text=Tang+Bao+Hiem',
    validity: '15/01/2024 - 28/02/2024', applicableModelsPreview: 'Mazda CX-5 2024',
    termsAndConditions: 'Tặng gói bảo hiểm thân vỏ 1 năm trị giá 15 triệu đồng cho khách hàng mua Mazda CX-5 2024 tất cả phiên bản.',
    eligibleCars: [{ id: 'car-3', name: 'Mazda CX-5 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=CX-5', formattedPrice: '839.000.000 ₫', promoDiscountTag: 'Tặng BH 1 năm' }],
  },
  {
    id: 'promo-3', title: 'Ưu đãi pin trọn đời VinFast VF 8', bannerUrl: 'https://placehold.co/800x450/8b5cf6/ffffff?text=Pin+Tron+Doi',
    validity: '01/01/2024 - 30/06/2024', applicableModelsPreview: 'VinFast VF 8 2024',
    termsAndConditions: 'Chương trình ưu đãi pin trọn đời cho khách hàng mua VinFast VF 8 trong giai đoạn khuyến mãi. Bảo hành pin 10 năm.',
    eligibleCars: [{ id: 'car-5', name: 'VinFast VF 8 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=VF8', formattedPrice: '1.129.000.000 ₫', promoDiscountTag: 'Pin trọn đời' }],
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
