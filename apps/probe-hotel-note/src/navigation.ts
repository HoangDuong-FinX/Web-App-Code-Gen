import type { ScreenId } from "./types";

export type NavigationAction =
  | { type: "NAVIGATE"; screen: ScreenId; params?: Record<string, string> }
  | { type: "BACK" }
  | { type: "SET_CAR"; carId: string }
  | { type: "SET_PROMO"; promoId: string }
  | { type: "SET_ACTIVITY"; activityId: string }
  | { type: "SET_FILTER"; bodyType: string | null };

export function getBackTarget(current: ScreenId, previous: ScreenId | null): ScreenId {
  const backMap: Partial<Record<ScreenId, ScreenId>> = {
    catalog: "home",
    "car-detail": "catalog",
    search: "home",
    compare: "car-detail",
    login: "car-detail",
    register: "login",
    "inquiry-form": "car-detail",
    "inquiry-confirm": "inquiry-form",
    "td-select-showroom": "car-detail",
    "td-select-datetime": "td-select-showroom",
    "td-confirm": "td-select-datetime",
    "reservation-terms": "car-detail",
    "reservation-payment": "reservation-terms",
    "my-activity": "home",
    "activity-detail": "my-activity",
    promotions: "home",
    "promo-detail": "promotions",
  };
  return backMap[current] ?? previous ?? "home";
}
