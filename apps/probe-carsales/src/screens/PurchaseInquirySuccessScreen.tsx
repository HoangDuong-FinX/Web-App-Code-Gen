import { t } from "../i18n/index";

interface Props {
  result: { referenceNumber: string; carMakeModel: string; offerPrice: string; financing: string };
  onContinueShopping: () => void;
  onViewInquiries: () => void;
}

export default function PurchaseInquirySuccessScreen({ result, onContinueShopping, onViewInquiries }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 p-4 pt-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <span className="text-3xl text-green-600" aria-hidden="true">\u2713</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 text-center">{t("inquiry.success.title")}</h1>
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        <dl className="flex flex-col gap-2">
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("inquiry.success.vehicle")}</dt><dd className="text-sm font-medium text-gray-900">{result.carMakeModel}</dd></div>
          {result.offerPrice && <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("inquiry.success.offerPrice")}</dt><dd className="text-sm font-medium text-gray-900">{result.offerPrice}</dd></div>}
          {result.financing && <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("inquiry.success.financing")}</dt><dd className="text-sm font-medium text-gray-900">{result.financing}</dd></div>}
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("inquiry.success.reference")}</dt><dd className="text-sm font-medium text-gray-900">{result.referenceNumber}</dd></div>
        </dl>
      </div>
      <p className="text-sm text-gray-500 text-center">{t("inquiry.success.responseTime")}</p>
      <div className="flex gap-2">
        <button onClick={onContinueShopping} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label={t("inquiry.success.continueShopping.aria")}>
          {t("inquiry.success.continueShopping")}
        </button>
        <button onClick={onViewInquiries} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" aria-label={t("inquiry.success.viewInquiries.aria")}>
          {t("inquiry.success.viewInquiries")}
        </button>
      </div>
    </div>
  );
}