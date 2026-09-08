import React from "react";
import { t } from "../i18n";
import { useNavigation } from "../context/NavigationContext";

export function BackButton() {
  const { goBack } = useNavigation();
  return (
    <button
      type="button"
      className="mb-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      onClick={goBack}
      aria-label={t("nav.back")}
    >
      <span aria-hidden="true">&larr;</span> {t("nav.back")}
    </button>
  );
}
