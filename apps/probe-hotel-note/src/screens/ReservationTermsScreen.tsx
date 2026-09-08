import { useState } from "react";
import { t } from "../i18n";
import { getCarById } from "../fixtures/cars";
import { reservationTermsData } from "../fixtures/reservation";
import type { ScreenProps } from "./types";

export default function ReservationTermsScreen({ navigate, goBack, state }: ScreenProps) {
  const car = state.currentCarId ? getCarById(state.currentCarId) : undefined;
  const [agreed, setAgreed] = useState(false);

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
        <h1 className="text-xl font-bold">{t("reservationTerms.title")}</h1>
      </div>

      {/* Car Summary */}
      {car && (
        <div className="flex items-center gap-3 px-4 py-3">
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

      {/* Deposit Info */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("reservationTerms.depositInfo")}</h3>
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("reservationTerms.depositAmount")}</span>
            <span className="text-xl font-bold text-blue-600">{reservationTermsData.depositAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("reservationTerms.holdPeriod")}</span>
            <span className="text-sm font-semibold">{reservationTermsData.holdPeriod}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">{t("reservationTerms.cancellation")}</span>
            <span className="text-sm">{reservationTermsData.cancellationPolicy}</span>
          </div>
        </div>
      </section>

      {/* Terms Checkbox */}
      <div className="px-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            data-testid="terms-agree"
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            aria-label={t("reservationTerms.agree")}
            className="accent-blue-600 mt-1"
          />
          <span className="text-sm">{t("reservationTerms.agree")}</span>
        </label>
      </div>

      <div className="p-4 mt-auto">
        <button
          data-testid="confirm-pay"
          aria-label={t("reservationTerms.confirmPay")}
          onClick={() => navigate("reservation-payment")}
          disabled={!agreed}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {t("reservationTerms.confirmPay")}
        </button>
      </div>
    </div>
  );
}
