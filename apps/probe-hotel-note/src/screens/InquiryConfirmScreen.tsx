import { useState } from "react";
import { t } from "../i18n";
import { getCarById } from "../fixtures/cars";
import { simulateSubmitInquiry } from "../fixtures/reservation";
import type { ScreenProps } from "./types";

export default function InquiryConfirmScreen({ navigate, goBack, state }: ScreenProps) {
  const car = state.currentCarId ? getCarById(state.currentCarId) : undefined;
  const inquiry = state.inquiryForm;
  const buyer = state.buyer;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const contactMethodLabel =
    inquiry?.contactMethod === "call"
      ? t("inquiry.contactMethod.call")
      : inquiry?.contactMethod === "zalo"
        ? t("inquiry.contactMethod.zalo")
        : t("inquiry.contactMethod.email");

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);
    const result = await simulateSubmitInquiry();
    setLoading(false);
    if (result.success) {
      navigate("inquiry-success");
    } else {
      setError(true);
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
        <h1 className="text-xl font-bold">{t("inquiryConfirm.title")}</h1>
      </div>

      {/* Car Info */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("inquiryConfirm.carInfo")}</h3>
        <div className="mt-2 flex flex-col gap-1">
          <span className="font-semibold">{car?.name}</span>
          <span className="text-blue-600">{car?.formattedPrice}</span>
        </div>
      </section>

      {/* Contact Info */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("inquiryConfirm.contactInfo")}</h3>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("inquiryConfirm.name")}</span>
            <span className="text-sm font-semibold">{buyer?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("inquiryConfirm.phone")}</span>
            <span className="text-sm font-semibold">{buyer?.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">{t("inquiryConfirm.method")}</span>
            <span className="text-sm font-semibold">{contactMethodLabel}</span>
          </div>
          {inquiry?.preferredTime && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t("inquiryConfirm.time")}</span>
              <span className="text-sm font-semibold">{inquiry.preferredTime}</span>
            </div>
          )}
          {inquiry?.message && (
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500">{t("inquiryConfirm.message")}</span>
              <span className="text-sm">{inquiry.message}</span>
            </div>
          )}
        </div>
      </section>

      {/* Actions */}
      <div className="p-4 flex flex-col gap-3">
        <button
          data-testid="edit-inquiry"
          aria-label={t("inquiryConfirm.edit")}
          onClick={goBack}
          className="text-blue-600 text-sm font-medium"
        >
          {t("inquiryConfirm.edit")}
        </button>

        {error && (
          <div
            data-testid="inquiry-submit-error"
            aria-live="polite"
            className="text-sm text-red-600 bg-red-50 p-3 rounded-lg"
          >
            {t("inquiryConfirm.error")}
          </div>
        )}

        <button
          data-testid="inquiry-submit"
          aria-label={t("inquiryConfirm.submit")}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "..." : t("inquiryConfirm.submit")}
        </button>
      </div>
    </div>
  );
}
