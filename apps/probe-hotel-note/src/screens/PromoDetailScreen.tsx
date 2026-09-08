import { t } from "../i18n";
import { getPromoById } from "../fixtures/promotions";
import type { ScreenProps } from "./types";

export default function PromoDetailScreen({ navigate, goBack, setCurrentCar, state }: ScreenProps) {
  const promo = state.currentPromoId ? getPromoById(state.currentPromoId) : undefined;

  if (!promo) {
    return (<div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">{t("catalog.empty.title")}</p></div>);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center p-4 gap-3">
        <button data-testid="back-action" aria-label={t("common.back")} onClick={goBack} className="p-2 text-gray-600">{"\u2190"}</button>
        <h1 className="text-xl font-bold">{t("promoDetail.title")}</h1>
      </div>
      <img src={promo.bannerUrl} alt={promo.title} className="w-full aspect-video object-cover" />
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold">{promo.title}</h2>
        <span className="text-xs text-gray-500">{promo.validity}</span>
        <p className="text-sm">{promo.termsAndConditions}</p>
      </div>
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("promoDetail.eligibleCars")}</h3>
        <div className="flex flex-col gap-3 mt-3">
          {promo.eligibleCars.map((car) => (
            <button key={car.id} aria-label={car.name} data-testid="eligible-car-card" onClick={() => setCurrentCar(car.id)} className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left">
              <img src={car.thumbnailUrl} alt={car.name} className="w-24 aspect-[4/3] object-cover" />
              <div className="flex-1 p-3 flex flex-col gap-1">
                <span className="font-semibold text-sm">{car.name}</span>
                <span className="font-semibold text-sm text-blue-600">{car.formattedPrice}</span>
                {car.promoLabel && (<span className="inline-block px-2 py-0.5 rounded text-xs font-medium w-fit bg-amber-100 text-amber-700" aria-label={t("common.discount", { tag: car.promoLabel })}>{car.promoLabel}</span>)}
              </div>
            </button>
          ))}
        </div>
      </section>
      <div className="p-4">
        <button data-testid="view-all-eligible" aria-label={t("promoDetail.viewAllEligible")} onClick={() => navigate("catalog")} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">{t("promoDetail.viewAllEligible")}</button>
      </div>
    </div>
  );
}
