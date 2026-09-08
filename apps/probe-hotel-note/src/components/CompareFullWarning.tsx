import { t } from "../i18n";

interface CompareFullWarningProps {
  onDismiss: () => void;
}

export default function CompareFullWarning({ onDismiss }: CompareFullWarningProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-label={t("compare.fullWarning.title")}
      data-testid="compare-full-dialog"
    >
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold mb-2">{t("compare.fullWarning.title")}</h3>
        <p className="text-gray-600 mb-4">{t("compare.fullWarning.message")}</p>
        <button
          data-testid="dismiss-compare-warning"
          aria-label={t("compare.fullWarning.dismiss")}
          onClick={onDismiss}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
        >
          {t("compare.fullWarning.dismiss")}
        </button>
      </div>
    </div>
  );
}
