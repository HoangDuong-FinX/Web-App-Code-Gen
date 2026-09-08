import type { Promotion } from "../types";
import { featuredCars } from "./cars";

export const promotions: Promotion[] = [
  {
    id: "promo-001",
    title: "Gi\u1ea3m \u0111\u1ebfn 50 tri\u1ec7u cho d\u00f2ng SUV",
    bannerUrl: "https://placehold.co/800x450/fef3c7/92400e?text=SUV+Sale",
    validity: "01/01/2024 - 31/03/2024",
    termsAndConditions: "\u00c1p d\u1ee5ng cho t\u1ea5t c\u1ea3 xe SUV m\u1edbi. Kh\u00f4ng \u00e1p d\u1ee5ng c\u00f9ng c\u00e1c ch\u01b0\u01a1ng tr\u00ecnh khuy\u1ebfn m\u00e3i kh\u00e1c.",
    applicableModelsPreview: "CX-5, Tucson, VF 8",
    eligibleCars: featuredCars.filter((c) => c.bodyType === "SUV"),
  },
  {
    id: "promo-002",
    title: "T\u1eb7ng ph\u1ee5 ki\u1ec7n 20 tri\u1ec7u khi mua Sedan",
    bannerUrl: "https://placehold.co/800x450/dbeafe/1e40af?text=Sedan+Promo",
    validity: "15/01/2024 - 28/02/2024",
    termsAndConditions: "\u00c1p d\u1ee5ng cho Civic RS v\u00e0 Camry 2.5Q. Ph\u1ee5 ki\u1ec7n bao g\u1ed3m: phim c\u00e1ch nhi\u1ec7t, th\u1ea3m l\u00f3t s\u00e0n, camera h\u00e0nh tr\u00ecnh.",
    applicableModelsPreview: "Civic RS, Camry 2.5Q",
    eligibleCars: featuredCars.filter((c) => c.bodyType === "Sedan"),
  },
  {
    id: "promo-003",
    title: "\u01afu \u0111\u00e3i tr\u1ea3 g\u00f3p 0% l\u00e3i su\u1ea5t 12 th\u00e1ng",
    bannerUrl: "https://placehold.co/800x450/dcfce7/166534?text=0%25+Interest",
    validity: "01/02/2024 - 30/04/2024",
    termsAndConditions: "\u00c1p d\u1ee5ng cho t\u1ea5t c\u1ea3 xe m\u1edbi. Th\u1eddi h\u1ea1n vay t\u1eeb 12 \u0111\u1ebfn 60 th\u00e1ng.",
    applicableModelsPreview: "T\u1ea5t c\u1ea3 xe m\u1edbi",
    eligibleCars: featuredCars.filter((c) => c.condition === "M\u1edbi"),
  },
];

export function getPromoById(id: string): Promotion | undefined {
  return promotions.find((p) => p.id === id);
}
