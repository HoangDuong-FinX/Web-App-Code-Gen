import { t } from "../i18n";
import type { ScreenProps } from "./types";

export default function InquirySuccessScreen({ navigate }: ScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-4xl">
        \u2713
      </div>
      <h1 className="text-2xl font-bold text-center">{t("inquirySuccess.title")}</h1>
      <p className="text-center text-gray-500">{t("inquirySuccess.message")}</p>
      <button
        data-testid="back-to-car"
        aria-label={t("inquirySuccess.backToCar")}
        onClick={() => navigate("car-detail")}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
      >
        {t("inquirySuccess.backToCar")}
      </button>
      <button
        data-testid="back-to-home"
        aria-label={t("inquirySuccess.backToHome")}
        onClick={() => navigate("home")}
        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium"
      >
        {t("inquirySuccess.backToHome")}
      </button>
    </div>
  );
}
