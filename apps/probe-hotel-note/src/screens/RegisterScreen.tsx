import { useState } from "react";
import { t } from "../i18n";
import { simulateRegister } from "../fixtures/auth";
import type { ScreenProps } from "./types";

export default function RegisterScreen({ navigate, goBack }: ScreenProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !phone || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setError(t("register.error.generic"));
      return;
    }
    setLoading(true);
    setError(null);
    const result = await simulateRegister(name, phone, email, password);
    setLoading(false);
    if (result.success) {
      navigate("login");
    } else {
      setError(t("register.error.generic"));
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
        <h1 className="text-xl font-bold">{t("register.title")}</h1>
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div>
          <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
            {t("register.name.label")}
          </label>
          <input
            id="register-name"
            data-testid="register-name"
            aria-label={t("register.name.label")}
            type="text"
            placeholder={t("register.name.placeholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 mb-1">
            {t("register.phone.label")}
          </label>
          <input
            id="register-phone"
            data-testid="register-phone"
            aria-label={t("register.phone.label")}
            type="tel"
            inputMode="tel"
            placeholder={t("register.phone.placeholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-500 mt-1">{t("register.phone.helper")}</span>
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
            {t("register.email.label")}
          </label>
          <input
            id="register-email"
            data-testid="register-email"
            aria-label={t("register.email.label")}
            type="email"
            inputMode="email"
            placeholder={t("register.email.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
            {t("register.password.label")}
          </label>
          <input
            id="register-password"
            data-testid="register-password"
            aria-label={t("register.password.label")}
            type="password"
            placeholder={t("register.password.placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            {t("register.confirmPassword.label")}
          </label>
          <input
            id="register-confirm-password"
            data-testid="register-confirm-password"
            aria-label={t("register.confirmPassword.label")}
            type="password"
            placeholder={t("register.confirmPassword.placeholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div
            data-testid="register-error"
            aria-live="polite"
            className="w-full text-sm text-red-600 bg-red-50 p-3 rounded-lg"
          >
            {error}
          </div>
        )}

        <button
          data-testid="register-submit"
          aria-label={t("register.submit")}
          onClick={handleSubmit}
          disabled={loading || !name || !phone || !password || !confirmPassword}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "..." : t("register.submit")}
        </button>

        <div className="flex gap-1 items-center justify-center">
          <span className="text-sm text-gray-600">{t("register.hasAccount")}</span>
          <button
            data-testid="login-link"
            aria-label={t("register.login")}
            onClick={() => navigate("login")}
            className="text-blue-600 text-sm font-medium"
          >
            {t("register.login")}
          </button>
        </div>
      </div>
    </div>
  );
}
