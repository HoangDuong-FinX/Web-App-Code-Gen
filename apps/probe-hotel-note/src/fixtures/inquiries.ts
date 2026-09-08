import type { Inquiry } from '../types';

let updateInquiryStatusOutcome: 'success' | 'fail' = 'success';
export function setUpdateInquiryStatusOutcome(o: 'success' | 'fail'): void {
  updateInquiryStatusOutcome = o;
}

const fixtureInquiries: Inquiry[] = [
  {
    id: 'inq-1', buyerName: 'Nguy\u1ec5n V\u0103n An', phone: '0912345678',
    email: 'an.nguyen@email.com', preferredContactTime: 'S\u00e1ng 9h-11h',
    message: 'T\u00f4i mu\u1ed1n bi\u1ebft th\u00eam v\u1ec1 ch\u01b0\u01a1ng tr\u00ecnh tr\u1ea3 g\u00f3p cho xe n\u00e0y.',
    carId: 'car-1', carName: 'Toyota Camry 2024', carPrice: '1.050.000.000 VN\u0110',
    carThumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=Camry',
    status: 'new', date: '2024-12-15',
  },
  {
    id: 'inq-2', buyerName: 'Tr\u1ea7n Th\u1ecb B\u00edch', phone: '0987654321',
    email: 'bich.tran@email.com',
    message: 'Xe c\u00f2n h\u00e0ng kh\u00f4ng? T\u00f4i mu\u1ed1n xem xe cu\u1ed1i tu\u1ea7n.',
    carId: 'car-3', carName: 'Hyundai Tucson 2024', carPrice: '920.000.000 VN\u0110',
    carThumbnailUrl: 'https://placehold.co/400x300/e8eaf6/283593?text=Tucson',
    status: 'contacted', date: '2024-12-14',
  },
  {
    id: 'inq-3', buyerName: 'L\u00ea Ho\u00e0ng C\u01b0\u1eddng', phone: '0901234567',
    carId: 'car-6', carName: 'Kia Morning 2022', carPrice: '349.000.000 VN\u0110',
    carThumbnailUrl: 'https://placehold.co/400x300/fff3e0/e65100?text=Morning',
    status: 'closed', date: '2024-12-10',
  },
];

export function loadAdminInquiries(statusFilter?: string): Inquiry[] {
  if (!statusFilter || statusFilter === 'all') return [...fixtureInquiries];
  return fixtureInquiries.filter((i) => i.status === statusFilter);
}

export function loadInquiryDetail(inquiryId: string): Inquiry | null {
  return fixtureInquiries.find((i) => i.id === inquiryId) ?? null;
}

export function updateInquiryStatusFixture(): { success: boolean } {
  if (updateInquiryStatusOutcome === 'fail') return { success: false };
  return { success: true };
}
