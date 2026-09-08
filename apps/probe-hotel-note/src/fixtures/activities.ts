import type { ActivityItem } from "../types";

export const activityItems: ActivityItem[] = [
  {
    id: "act-001",
    type: "inquiry",
    carId: "car-001",
    carName: "Honda Civic RS 2024",
    carThumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=Civic+RS",
    carFormattedPrice: "870.000.000 ₫",
    statusLabel: "Đang xử lý",
    statusVariant: "warning",
    inquiryDate: "15/01/2024",
    typeSpecificDetails: "Liên hệ qua: Zalo | Thời gian: Sáng thứ 2 - thứ 6",
    timeline: [
      { date: "15/01/2024", description: "Gửi yêu cầu tư vấn" },
      { date: "15/01/2024", description: "Đã tiếp nhận yêu cầu" },
    ],
  },
  {
    id: "act-002",
    type: "test-drive",
    carId: "car-002",
    carName: "Toyota Camry 2.5Q 2024",
    carThumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=Camry+2.5Q",
    carFormattedPrice: "1.310.000.000 ₫",
    statusLabel: "Đã xác nhận",
    statusVariant: "success",
    bookingDatetime: "20/01/2024 09:00",
    showroomName: "Vikki Auto Quận 1",
    typeSpecificDetails: "Showroom: Vikki Auto Quận 1 | Ngày: 20/01/2024 | Giờ: 09:00",
    timeline: [
      { date: "16/01/2024", description: "Đặt lịch lái thử" },
      { date: "16/01/2024", description: "Đã xác nhận lịch hẹn" },
    ],
  },
  {
    id: "act-003",
    type: "reservation",
    carId: "car-003",
    carName: "Mazda CX-5 Premium 2024",
    carThumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=CX-5+Premium",
    carFormattedPrice: "979.000.000 ₫",
    statusLabel: "Đã đặt cọc",
    statusVariant: "success",
    reservationDate: "18/01/2024",
    depositAmount: "50.000.000 ₫",
    typeSpecificDetails: "Tiền cọc: 50.000.000 ₫ | Giữ xe đến: 18/02/2024",
    timeline: [
      { date: "18/01/2024", description: "Đặt cọc giữ xe" },
      { date: "18/01/2024", description: "Thanh toán thành công" },
      { date: "18/01/2024", description: "Xác nhận giữ xe đến 18/02/2024" },
    ],
  },
];

export function getActivityById(id: string): ActivityItem | undefined {
  return activityItems.find((a) => a.id === id);
}
