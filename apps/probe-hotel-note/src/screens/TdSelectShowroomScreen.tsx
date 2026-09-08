import { t } from "../i18n";
import { getCarById } from "../fixtures/cars";
import { showrooms } from "../fixtures/showrooms";
import type { ScreenProps } from "./types";

export default function TdSelectShowroomScreen({
  navigate,
  goBack,
  setTestDriveBooking,
  state,
}: ScreenProps) {
  const car = state.currentCarId ? getCarById(state.currentCarId) : undefined;

  const handleSelectShowroom = (showroomId: string) => {
    const sr = showrooms.find((s) => s.id === showroomId);
    if (sr) {
      setTestDriveBooking({
        showroomId: sr.id,
        showroomName: sr.name,
        showroomAddress: sr.address,
      });
      navigate("td-select-datetime");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
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
        <h1 className="text-xl font-bold">{t("tdShowroom.title")}</h1>
      </div>

      {/* Car Summary */}
      {car && (
        <div className="flex items-center gap-3 px-4 py-3">
          <img
            src={car.thumbnailUrl}
            alt={car.name}
            className="w-16 aspect-[4/3] object-cover rounded-lg"
          />
          <div>
            <span className="font-semibold text-sm block">{car.name}</span>
            <span className="text-xs text-blue-600">{car.formattedPrice}</span>
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div
        data-testid="step-indicator"
        aria-label={t("tdShowroom.step")}
        className="flex items-center justify-center gap-2 px-4 py-3"
      >
        {[t("steps.showroom"), t("steps.datetime"), t("steps.confirm")].map((step, idx) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                idx === 0 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {idx + 1}
            </span>
            <span className={`text-xs ${idx === 0 ? "font-semibold text-blue-600" : "text-gray-500"}`}>
              {step}
            </span>
            {idx < 2 && <span className="text-gray-300">\u2014</span>}
          </div>
        ))}
      </div>

      {/* Showroom List */}
      <div className="flex flex-col gap-3 p-4">
        {showrooms.map((sr) => (
          <button
            key={sr.id}
            aria-label={sr.name}
            data-testid="showroom-card"
            onClick={() => handleSelectShowroom(sr.id)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left flex flex-col gap-1"
          >
            <span className="font-semibold text-sm">{sr.name}</span>
            <span className="text-xs text-gray-500">{sr.address}</span>
            <span className="text-xs text-gray-500">{sr.distance}</span>
            <span className="text-xs text-gray-500">
              {t("tdShowroom.hours", { hours: sr.hours })}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
