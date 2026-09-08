import type { Promotion } from "../types";
import { featuredCars } from "./cars";

export const promotions: Promotion[] = [
  {
    id: "promo-001",
    title: "Giảm đến 50 triệu cho dòng SUV",
    bannerUrl: "https://placehold.co/800x450/fef3c7/92400e?text=SUV+Sale",
    validity: "01/01/2024 - 31/03/2024",
    termsAndConditions:
      "Áp dụng cho tất cả xe SUV mới. Không áp dụng cùng các chương trình khuyến mãi khác. Liên hệ đại lý để biết thêm chi tiết.",
    applicableModelsPreview: "CX-5, Tucson, VF 8",
    eligibleCars: featuredCars.filter((c) => c.bodyType === "SUV"),
  },
  {
    id: "promo-002",
    title: "Tặng phụ kiện 20 triệu khi mua Sedan",
    bannerUrl: "https://placehold.co/800x450/dbeafe/1e40af?text=Sedan+Promo",
    validity: "15/01/2024 - 28/02/2024",
    termsAndConditions:
      "Áp dụng cho Civic RS và Camry 2.5Q. Phụ kiện bao gồm: phim cách nhiệt, thảm lót sàn, camera hành trình.",
    applicableModelsPreview: "Civic RS, Camry 2.5Q",
    eligibleCars: featuredCars.filter((c) => c.bodyType === "Sedan"),
  },
  {
    id: "promo-003",
    title: "Ưu đãi trả góp 0% lãi suất 12 tháng",
    bannerUrl: "https://placehold.co/800x450/dcfce7/166534?text=0%25+Interest",
    validity: "01/02/2024 - 30/04/2024",
    termsAndConditions:
      "Áp dụng cho tất cả xe mới. Thời hạn vay từ 12 đến 60 tháng. Trả trước tối thiểu 30%. Liên hệ đại lý để được tư vấn.",
    applicableModelsPreview: "Tất cả xe mới",
    eligibleCars: featuredCars.filter((c) => c.condition === "Mới"),
  },
];

export function getPromoById(id: string): Promotion | undefined {
  return promotions.find((p) => p.id === id);
}
