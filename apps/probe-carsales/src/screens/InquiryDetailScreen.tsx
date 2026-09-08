import type { PurchaseInquiry } from "../types";
import { t, formatPrice } from "../i18n/index";

interface Props {
  inquiry: PurchaseInquiry;
  onBack: () => void;
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  responded: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function InquiryDetailScreen({ inquiry, onBack }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <button onClick={onBack} className="self-start text-sm text-blue-600 hover:underline" aria-label={t("inquiryDetail.back.aria")}>
        \u2190 {t("inquiryDetail.back")}
      </button>
      <h1 className="text-2xl font-bold text-gray-900">{t("inquiryDetail.title")}</h1>
      <div className="bg-gray-50 p-3 rounded-lg">
        <h3 className="font-semibold text-gray-900">{inquiry.carMakeModel}</h3>
        <p className="text-sm text-gray-600">{t("inquiryDetail.reference", { ref: inquiry.referenceNumber })}</p>
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${statusColor[inquiry.status] ?? "bg-gray-100 text-gray-700"}`}>{inquiry.status}</span>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("inquiryDetail.info")}</h2>
        <dl className="flex flex-col gap-2">
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("inquiryDetail.type")}</dt><dd className="text-sm font-medium text-gray-900">{inquiry.type}</dd></div>
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("inquiryDetail.submitted")}</dt><dd className="text-sm font-medium text-gray-900">{inquiry.submittedDate}</dd></div>
          {inquiry.offerPrice > 0 && <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("inquiryDetail.offerPrice")}</dt><dd className="text-sm font-medium text-gray-900">{formatPrice(inquiry.offerPrice, "VND")}</dd></div>}
          {inquiry.financing && <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("inquiryDetail.financing")}</dt><dd className="text-sm font-medium text-gray-900">{inquiry.financing.loanTerm} months, {inquiry.financing.downPaymentPercent}% down</dd></div>}
          {inquiry.appointmentDate && <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("inquiryDetail.appointmentDate")}</dt><dd className="text-sm font-medium text-gray-900">{inquiry.appointmentDate}</dd></div>}
        </dl>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("inquiryDetail.responses")}</h2>
        {inquiry.responses.length === 0 ? (
          <p className="text-sm text-gray-500">{t("inquiryDetail.noResponses")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {inquiry.responses.map((r, i) => (
              <li key={i} className="bg-white p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{r.date}</p>
                <p className="text-sm text-gray-900">{r.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label={t("inquiryDetail.backToActivity.aria")}>
          {t("inquiryDetail.backToActivity")}
        </button>
      </div>
    </div>
  );
}