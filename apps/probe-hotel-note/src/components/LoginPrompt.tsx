import { t } from "../i18n";

interface LoginPromptProps {
  onLogin: () => void;
  onDismiss: () => void;
}

export default function LoginPromptModal({ onLogin, onDismiss }: LoginPromptProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-label={t("loginPrompt.title")}
      data-testid="login-prompt-dialog"
    >
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold mb-2">{t("loginPrompt.title")}</h3>
        <p className="text-gray-600 mb-4">{t("loginPrompt.message")}</p>
        <div className="flex flex-col gap-2 pt-4">
          <button
            data-testid="go-to-login"
            aria-label={t("loginPrompt.login")}
            onClick={onLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            {t("loginPrompt.login")}
          </button>
          <button
            data-testid="dismiss-login-prompt"
            aria-label={t("loginPrompt.dismiss")}
            onClick={onDismiss}
            className="w-full text-gray-500 py-3 rounded-lg font-medium"
          >
            {t("loginPrompt.dismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
