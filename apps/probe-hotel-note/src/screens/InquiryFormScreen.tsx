import { useState } from "react";
import { t } from "../i18n";
import { getCarById } from "../fixtures/cars";
import type { ScreenProps } from "./types";

export default function InquiryFormScreen({ navigate, goBack, setInquiryForm, state }: ScreenProps) {
  const car = state.currentCarId ? getCarById(state.currentCarId) : undefined;
  const [contactMethod, setContactMethod] = useState("call");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");

  const handleContinue = () => {
    setInquiryForm({ contactMethod, preferredTime, message });
    navigate("inquiry-confirm");
  };

  const contactOptions = [
    { value: "call", label: t("inquiry.contactMethod.call") },
    { value: "zalo", label: t("inquiry.contactMethod.zalo") },
    { value: "email", label: t("inquiry.contactMethod.email") },
  ];

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
        <h1 className="text-xl font-bold">{t("inquiry.title")}</h1>
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

      {/* Form */}
      <div className="flex flex-col gap-4 p-4">
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">
            {t("inquiry.contactMethod.label")}
          </legend>
          <div className="flex flex-col gap-2" data-testid="contact-method">
            {contactOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="contactMethod"
                  value={opt.value}
                  checked={contactMethod === opt.value}
                  onChange={() => setContactMethod(opt.value)}
                  className="accent-blue-600"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="preferred-time" className="block text-sm font-medium text-gray-700 mb-1">
            {t("inquiry.preferredTime.label")}
          </label>
          <input
            id="preferred-time"
            data-testid="preferred-time"
            aria-label={t("inquiry.preferredTime.label")}
            type="text"
            placeholder={t("inquiry.preferredTime.placeholder")}
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="inquiry-message" className="block text-sm font-medium text-gray-700 mb-1">
            {t("inquiry.message.label")}
          </label>
          <textarea
            id="inquiry-message"
            data-testid="inquiry-message"
            aria-label={t("inquiry.message.label")}
            placeholder={t("inquiry.message.placeholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          data-testid="inquiry-continue"
          aria-label={t("inquiry.continue")}
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
        >
          {t("inquiry.continue")}
        </button>
      </div>
    </div>
  );
}
