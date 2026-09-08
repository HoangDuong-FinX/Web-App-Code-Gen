import type { PromoBanner } from "../types";
import { FIXTURE_CARS, FIXTURE_BRANDS } from "./cars";

export const FIXTURE_BANNERS: PromoBanner[] = [
  { id: "b1", imageUrl: "https://placehold.co/800x350/1a1a2e/eaeaea?text=Khuyen+Mai+Thang+9", targetType: "search", targetId: "" },
  { id: "b2", imageUrl: "https://placehold.co/800x350/16213e/eaeaea?text=VinFast+VF8+Moi", targetType: "car", targetId: "car-004" },
  { id: "b3", imageUrl: "https://placehold.co/800x350/0f3460/eaeaea?text=Lai+Thu+Mien+Phi", targetType: "search", targetId: "" },
];

export function getHomeData() {
  return {
    promoBanners: FIXTURE_BANNERS,
    featuredCars: FIXTURE_CARS.filter((c) => c.status === "available").slice(0, 4),
    brands: FIXTURE_BRANDS,
  };
}
