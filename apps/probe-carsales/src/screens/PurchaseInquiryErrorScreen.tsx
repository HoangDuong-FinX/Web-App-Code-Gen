import { t } from "../i18n/index";

interface Props {
  error: { message: string; details: string } | null;
  onRetry: () => void;
  onBackToDetail: () => void;
}

export default function PurchaseInquiryErrorScreen({ error, onRetry, onBackToDetail }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 p-4 pt-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <span className="text-3xl text-red-600" aria-hidden="true">\u2717</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 text-center">{t("inquiry.error.title")}</h1>
      <p className="text-sm text-gray-700 text-center" role="alert">{error?.message ?? t("inquiry.error.generic")}</p>
      {error?.details && <p className="text-xs text-gray-500 text-center">{error.details}</p>}
      <div className="flex gap-2">
        <button onClick={onBackToDetail} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label={t("inquiry.error.backToDetail.aria")}>
          {t("inquiry.error.backToDetail")}
        </button>
        <button onClick={onRetry} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" aria-label={t("inquiry.error.retry.aria")}>
          {t("inquiry.error.retry")}
        </button>
      </div>
    </div>
  );
}