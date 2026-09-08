import { t } from "../i18n";
import { getCarById } from "../fixtures/cars";
import type { ScreenProps } from "./types";

export default function CarDetailScreen({
  goBack,
  setCurrentCar,
  toggleCompare,
  requireLogin,
  state,
}: ScreenProps) {
  const car = state.currentCarId ? getCarById(state.currentCarId) : undefined;

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-gray-500">{t("catalog.empty.title")}</p>
      </div>
    );
  }

  const handleInquiry = () => requireLogin("inquiry-form", "inquiry");
  const handleTestDrive = () => requireLogin("td-select-showroom", "test-drive");
  const handleReserve = () => requireLogin("reservation-terms", "reserve");

  return (
    <div className="flex flex-col min-h-screen pb-4">
      {/* Header */}
      <div className="flex items-center p-4 gap-3">
        <button
          data-testid="back-action"
          aria-label={t("common.back")}
          onClick={goBack}
          className="p-2 text-gray-600"
        >
          \u2190
        </button>
        <h1 className="text-xl font-bold flex-1">{t("carDetail.title")}</h1>
        <button
          data-testid="share-action"
          aria-label={t("carDetail.share")}
          onClick={() => {}}
          className="p-2 text-gray-600"
        >
          \u{1F517}
        </button>
      </div>

      {/* Gallery */}
      <div aria-label={car.name} className="overflow-hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory">
          {car.photos.map((photo, idx) => (
            <img
              key={idx}
              src={photo.url}
              alt={photo.label}
              className="flex-shrink-0 w-full aspect-video object-cover snap-center"
            />
          ))}
        </div>
      </div>

      {/* Car Info */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold">{car.name}</h2>
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-medium w-fit ${
            car.condition === "M\u1edbi" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}
          aria-label={t("common.condition", { condition: car.condition })}
        >
          {car.condition}
        </span>
        <span className="text-2xl font-bold text-blue-600">{car.formattedPrice}</span>
        {car.hasActivePromo && (
          <span
            className="inline-block px-2 py-0.5 rounded text-xs font-medium w-fit bg-amber-100 text-amber-700"
            aria-label={t("carDetail.promo.label", { label: car.promoLabel })}
          >
            {car.promoLabel}
          </span>
        )}
        <span className="text-sm text-gray-500">
          {t("carDetail.installment", { amount: car.monthlyInstallment })}
        </span>
      </div>

      {/* Specs */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("carDetail.specs.title")}</h3>
        <div className="mt-2">
          {car.specs.map((spec, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">{spec.label}</span>
              <span className="text-sm font-semibold">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Dealer */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("carDetail.dealer.title")}</h3>
        <div className="mt-2 flex flex-col gap-1">
          <span className="font-semibold">{car.dealer.name}</span>
          <span className="text-sm text-gray-500">{car.dealer.address}</span>
          <a
            href={`tel:${car.dealer.phone}`}
            data-testid="dealer-phone"
            aria-label={car.dealer.name}
            className="text-blue-600 text-sm font-medium"
          >
            {car.dealer.phone}
          </a>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="p-4 flex flex-col gap-3">
        <button
          data-testid="inquiry-cta"
          aria-label={t("carDetail.inquiry")}
          onClick={handleInquiry}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
        >
          {t("carDetail.inquiry")}
        </button>
        <button
          data-testid="test-drive-cta"
          aria-label={t("carDetail.testDrive")}
          onClick={handleTestDrive}
          className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium"
        >
          {t("carDetail.testDrive")}
        </button>
        {car.status === "available" && (
          <button
            data-testid="reserve-cta"
            aria-label={t("carDetail.reserve")}
            onClick={handleReserve}
            className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium"
          >
            {t("carDetail.reserve")}
          </button>
        )}
        <button
          data-testid="compare-cta"
          aria-label={t("carDetail.compare")}
          onClick={() => toggleCompare(car.id)}
          className={`w-full py-3 rounded-lg font-medium ${
            state.compareList.includes(car.id)
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 bg-gray-50"
          }`}
          disabled={state.compareList.length >= 3 && !state.compareList.includes(car.id)}
        >
          \u2696 {t("carDetail.compare")}
        </button>
      </div>
    </div>
  );
}
