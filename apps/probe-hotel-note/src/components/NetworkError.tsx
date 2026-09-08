import { t } from "../i18n";

interface NetworkErrorProps {
  onRetry: () => void;
  onDismiss: () => void;
}

export default function NetworkErrorModal({ onRetry, onDismiss }: NetworkErrorProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-label={t("networkError.title")}
      data-testid="network-error-dialog"
    >
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold mb-2">{t("networkError.title")}</h3>
        <p className="text-gray-600 mb-4">{t("networkError.message")}</p>
        <div className="flex flex-col gap-2 pt-4">
          <button
            data-testid="retry-action"
            aria-label={t("networkError.retry")}
            onClick={onRetry}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            {t("networkError.retry")}
          </button>
          <button
            data-testid="dismiss-error"
            aria-label={t("networkError.dismiss")}
            onClick={onDismiss}
            className="w-full text-gray-500 py-3 rounded-lg font-medium"
          >
            {t("networkError.dismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
