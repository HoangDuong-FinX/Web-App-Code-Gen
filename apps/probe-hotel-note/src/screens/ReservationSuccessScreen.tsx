import { t } from "../i18n";
import { getCarById } from "../fixtures/cars";
import type { ScreenProps } from "./types";

export default function ReservationSuccessScreen({ navigate, state }: ScreenProps) {
  const car = state.currentCarId ? getCarById(state.currentCarId) : undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-4xl">
        \u2713
      </div>
      <h1 className="text-2xl font-bold text-center">{t("reservationSuccess.title")}</h1>
      <p className="font-semibold text-center">
        {t("reservationSuccess.code", { code: "RES-20240118-003" })}
      </p>

      <div className="w-full bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">{t("reservationSuccess.car")}</span>
          <span className="text-sm font-semibold">{car?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">{t("reservationSuccess.paid")}</span>
          <span className="text-sm font-semibold">50.000.000 \u20ab</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">{t("reservationSuccess.holdUntil")}</span>
          <span className="text-sm font-semibold">18/02/2024</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 text-center">
        {t("reservationSuccess.code", { code: "" }).replace("M\u00e3 \u0111\u1eb7t c\u1ecdc: ", "")}
      </p>

      <button
        data-testid="view-activity"
        aria-label={t("reservationSuccess.viewActivity")}
        onClick={() => navigate("my-activity")}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
      >
        {t("reservationSuccess.viewActivity")}
      </button>
      <button
        data-testid="back-to-home"
        aria-label={t("reservationSuccess.backToHome")}
        onClick={() => navigate("home")}
        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium"
      >
        {t("reservationSuccess.backToHome")}
      </button>
    </div>
  );
}
