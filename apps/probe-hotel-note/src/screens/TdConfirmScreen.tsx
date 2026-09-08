import { useState } from "react";
import { t } from "../i18n";
import { getCarById } from "../fixtures/cars";
import { simulateBookTestDrive } from "../fixtures/reservation";
import type { ScreenProps } from "./types";

export default function TdConfirmScreen({
  navigate,
  goBack,
  setTestDriveBooking,
  state,
}: ScreenProps) {
  const car = state.currentCarId ? getCarById(state.currentCarId) : undefined;
  const booking = state.testDriveBooking;
  const buyer = state.buyer;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const result = await simulateBookTestDrive();
    setLoading(false);
    if (result.success) {
      setTestDriveBooking({
        referenceCode: result.referenceCode,
        datetime: `${booking.date} ${booking.time}`,
      });
      navigate("td-success");
    } else if (result.slotUnavailable) {
      navigate("td-select-datetime");
    } else {
      setError(t("tdConfirm.error"));
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
        <h1 className="text-xl font-bold">{t("tdConfirm.title")}</h1>
      </div>

      {/* Step Indicator */}
      <div
        data-testid="step-indicator"
        aria-label={t("tdConfirm.step")}
        className="flex items-center justify-center gap-2 px-4 py-3"
      >
        {[t("steps.showroom"), t("steps.datetime"), t("steps.confirm")].map((step, idx) => (
          <div key={step} className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-blue-600 text-white">
              {idx + 1}
            </span>
            <span className="text-xs font-semibold text-blue-600">{step}</span>
            {idx < 2 && <span className="text-gray-300">\u2014</span>}
          </div>
        ))}
      </div>

      {/* Car Info */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("tdConfirm.carInfo")}</h3>
        {car && (
          <div className="flex items-center gap-3 mt-2">
            <img
              src={car.thumbnailUrl}
              alt={car.name}
              className="w-20 aspect-[4/3] object-cover rounded-lg"
            />
            <div>
              <span className="font-semibold text-sm block">{car.name}</span>
              <span className="text-sm text-blue-600">{car.formattedPrice}</span>
            </div>
          </div>
        )}
      </section>

      {/* Schedule */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("tdConfirm.schedule")}</h3>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("tdConfirm.showroom")}</span>
            <span className="text-sm font-semibold">{booking.showroomName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("tdConfirm.address")}</span>
            <span className="text-sm font-semibold text-right">{booking.showroomAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("tdConfirm.date")}</span>
            <span className="text-sm font-semibold">{booking.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("tdConfirm.time")}</span>
            <span className="text-sm font-semibold">{booking.time}</span>
          </div>
        </div>
      </section>

      {/* Personal Info */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("tdConfirm.personalInfo")}</h3>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("tdConfirm.name")}</span>
            <span className="text-sm font-semibold">{buyer?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("tdConfirm.phone")}</span>
            <span className="text-sm font-semibold">{buyer?.phone}</span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="p-4 flex flex-col gap-3">
        <button
          data-testid="edit-datetime"
          aria-label={t("tdConfirm.editDatetime")}
          onClick={() => navigate("td-select-datetime")}
          className="text-blue-600 text-sm font-medium"
        >
          {t("tdConfirm.editDatetime")}
        </button>

        {error && (
          <div
            data-testid="td-confirm-error"
            aria-live="polite"
            className="text-sm text-red-600 bg-red-50 p-3 rounded-lg"
          >
            {error}
          </div>
        )}

        <button
          data-testid="td-confirm-submit"
          aria-label={t("tdConfirm.submit")}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "..." : t("tdConfirm.submit")}
        </button>
      </div>
    </div>
  );
}
