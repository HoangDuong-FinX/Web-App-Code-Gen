import { useState } from "react";
import { t } from "../i18n";
import { getCarById } from "../fixtures/cars";
import { reservationTermsData, simulatePayment } from "../fixtures/reservation";
import type { ScreenProps } from "./types";

export default function ReservationPaymentScreen({ navigate, goBack, state }: ScreenProps) {
  const car = state.currentCarId ? getCarById(state.currentCarId) : undefined;
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const paymentOptions = [
    { value: "bank-transfer", label: t("reservationPayment.bankTransfer") },
    { value: "credit-card", label: t("reservationPayment.creditCard") },
    { value: "e-wallet", label: t("reservationPayment.eWallet") },
  ];

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    const result = await simulatePayment();
    setLoading(false);
    if (result.success) {
      navigate("reservation-success");
    } else if (result.carUnavailable) {
      setError(t("reservationPayment.error.carUnavailable"));
      setTimeout(() => navigate("car-detail"), 2000);
    } else {
      setError(t("reservationPayment.error.declined"));
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
        <h1 className="text-xl font-bold">{t("reservationPayment.title")}</h1>
      </div>

      {/* Summary */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("reservationPayment.summary")}</h3>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("reservationPayment.car")}</span>
            <span className="text-sm font-semibold">{car?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("reservationPayment.depositAmount")}</span>
            <span className="text-xl font-bold text-blue-600">{reservationTermsData.depositAmount}</span>
          </div>
        </div>
      </section>

      {/* Payment Method */}
      <fieldset className="p-4">
        <legend className="text-sm font-medium text-gray-700 mb-2">
          {t("reservationPayment.method")}
        </legend>
        <div className="flex flex-col gap-2" data-testid="payment-method">
          {paymentOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value={opt.value}
                checked={paymentMethod === opt.value}
                onChange={() => setPaymentMethod(opt.value)}
                className="accent-blue-600"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <div
          data-testid="payment-error"
          aria-live="polite"
          className="mx-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
        >
          {error}
        </div>
      )}

      <div className="p-4 mt-auto">
        {loading && (
          <div aria-label={t("reservationPayment.processing")} className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <button
          data-testid="payment-submit"
          aria-label={t("reservationPayment.submit")}
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "..." : t("reservationPayment.submit")}
        </button>
      </div>
    </div>
  );
}
