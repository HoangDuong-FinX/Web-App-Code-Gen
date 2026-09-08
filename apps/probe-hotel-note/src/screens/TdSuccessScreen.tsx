import { t } from "../i18n";
import { getCarById } from "../fixtures/cars";
import type { ScreenProps } from "./types";

export default function TdSuccessScreen({ navigate, state }: ScreenProps) {
  const car = state.currentCarId ? getCarById(state.currentCarId) : undefined;
  const booking = state.testDriveBooking;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-4xl">
        \u2713
      </div>
      <h1 className="text-2xl font-bold text-center">{t("tdSuccess.title")}</h1>
      <p className="font-semibold text-center">
        {t("tdSuccess.refCode", { code: booking.referenceCode ?? "" })}
      </p>

      <div className="w-full bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
        <span className="text-sm">{car?.name}</span>
        <span className="text-sm">{booking.showroomName}</span>
        <span className="text-sm">{booking.datetime}</span>
      </div>

      <p className="text-sm text-amber-600 text-center">{t("tdSuccess.reminder")}</p>

      <button
        data-testid="back-to-car"
        aria-label={t("tdSuccess.backToCar")}
        onClick={() => navigate("car-detail")}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
      >
        {t("tdSuccess.backToCar")}
      </button>
      <button
        data-testid="back-to-home"
        aria-label={t("tdSuccess.backToHome")}
        onClick={() => navigate("home")}
        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium"
      >
        {t("tdSuccess.backToHome")}
      </button>
    </div>
  );
}
