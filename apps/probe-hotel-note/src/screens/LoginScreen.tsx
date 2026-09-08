import { useState } from "react";
import { t } from "../i18n";
import { simulateLogin } from "../fixtures/auth";
import type { ScreenProps } from "./types";

export default function LoginScreen({ navigate, goBack, onLoginSuccess, incrementLoginAttempts, state }: ScreenProps) {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isLocked = state.lockUntil !== null && Date.now() < state.lockUntil;

  const handleSubmit = async () => {
    if (!identity || !password) return;
    if (isLocked) { setError(t("login.error.locked")); return; }
    setLoading(true);
    setError(null);
    const result = await simulateLogin(identity, password);
    setLoading(false);
    if (result.success && result.buyer) {
      onLoginSuccess(result.buyer);
    } else if (result.locked) {
      incrementLoginAttempts();
      setError(t("login.error.locked"));
    } else {
      incrementLoginAttempts();
      setError(t("login.error.invalid"));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center p-4 gap-3">
        <button data-testid="back-action" aria-label={t("common.back")} onClick={goBack} className="p-2 text-gray-600">{"\u2190"}</button>
        <h1 className="text-xl font-bold">{t("login.title")}</h1>
      </div>
      <div className="flex flex-col items-center gap-6 p-6">
        <img src="https://placehold.co/120x48/e2e8f0/475569?text=Vikki+Auto" alt={t("app.title")} className="h-12" />
        <div className="w-full flex flex-col gap-4">
          <div>
            <label htmlFor="login-identity" className="block text-sm font-medium text-gray-700 mb-1">{t("login.identity.label")}</label>
            <input id="login-identity" data-testid="login-identity" aria-label={t("login.identity.label")} type="text" placeholder={t("login.identity.placeholder")} value={identity} onChange={(e) => setIdentity(e.target.value)} required className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">{t("login.password.label")}</label>
            <input id="login-password" data-testid="login-password" aria-label={t("login.password.label")} type="password" placeholder={t("login.password.placeholder")} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        {error && (<div data-testid="login-error" aria-live="polite" className="w-full text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>)}
        <button data-testid="login-submit" aria-label={t("login.submit")} onClick={handleSubmit} disabled={loading || !identity || !password} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50">{loading ? "..." : t("login.submit")}</button>
        <button data-testid="forgot-password" aria-label={t("login.forgot")} className="text-blue-600 text-sm font-medium">{t("login.forgot")}</button>
        <div className="flex gap-1 items-center">
          <span className="text-sm text-gray-600">{t("login.noAccount")}</span>
          <button data-testid="register-link" aria-label={t("login.register")} onClick={() => navigate("register")} className="text-blue-600 text-sm font-medium">{t("login.register")}</button>
        </div>
      </div>
    </div>
  );
}
