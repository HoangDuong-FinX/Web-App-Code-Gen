import type { ActivityItem } from "../types";

export const activityItems: ActivityItem[] = [
  {
    id: "act-001",
    type: "inquiry",
    carId: "car-001",
    carName: "Honda Civic RS 2024",
    carThumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=Civic+RS",
    carFormattedPrice: "870.000.000 \u20ab",
    statusLabel: "\u0110ang x\u1eed l\u00fd",
    statusVariant: "warning",
    inquiryDate: "15/01/2024",
    typeSpecificDetails: "Li\u00ean h\u1ec7 qua: Zalo | Th\u1eddi gian: S\u00e1ng th\u1ee9 2 - th\u1ee9 6",
    timeline: [
      { date: "15/01/2024", description: "G\u1eedi y\u00eau c\u1ea7u t\u01b0 v\u1ea5n" },
      { date: "15/01/2024", description: "\u0110\u00e3 ti\u1ebfp nh\u1eadn y\u00eau c\u1ea7u" },
    ],
  },
  {
    id: "act-002",
    type: "test-drive",
    carId: "car-002",
    carName: "Toyota Camry 2.5Q 2024",
    carThumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=Camry+2.5Q",
    carFormattedPrice: "1.310.000.000 \u20ab",
    statusLabel: "\u0110\u00e3 x\u00e1c nh\u1eadn",
    statusVariant: "success",
    bookingDatetime: "20/01/2024 09:00",
    showroomName: "Vikki Auto Qu\u1eadn 1",
    typeSpecificDetails: "Showroom: Vikki Auto Qu\u1eadn 1 | Ng\u00e0y: 20/01/2024 | Gi\u1edd: 09:00",
    timeline: [
      { date: "16/01/2024", description: "\u0110\u1eb7t l\u1ecbch l\u00e1i th\u1eed" },
      { date: "16/01/2024", description: "\u0110\u00e3 x\u00e1c nh\u1eadn l\u1ecbch h\u1eb9n" },
    ],
  },
  {
    id: "act-003",
    type: "reservation",
    carId: "car-003",
    carName: "Mazda CX-5 Premium 2024",
    carThumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=CX-5+Premium",
    carFormattedPrice: "979.000.000 \u20ab",
    statusLabel: "\u0110\u00e3 \u0111\u1eb7t c\u1ecdc",
    statusVariant: "success",
    reservationDate: "18/01/2024",
    depositAmount: "50.000.000 \u20ab",
    typeSpecificDetails: "Ti\u1ec1n c\u1ecdc: 50.000.000 \u20ab | Gi\u1eef xe \u0111\u1ebfn: 18/02/2024",
    timeline: [
      { date: "18/01/2024", description: "\u0110\u1eb7t c\u1ecdc gi\u1eef xe" },
      { date: "18/01/2024", description: "Thanh to\u00e1n th\u00e0nh c\u00f4ng" },
      { date: "18/01/2024", description: "X\u00e1c nh\u1eadn gi\u1eef xe \u0111\u1ebfn 18/02/2024" },
    ],
  },
];

export function getActivityById(id: string): ActivityItem | undefined {
  return activityItems.find((a) => a.id === id);
}
