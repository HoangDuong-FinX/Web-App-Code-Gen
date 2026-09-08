import { t } from "../i18n/index";

interface Props {
  userName: string;
  onManageInventory: () => void;
  onManageInquiries: () => void;
  onBackToCatalog: () => void;
}

export default function AdminDashboardScreen({ userName, onManageInventory, onManageInquiries, onBackToCatalog }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">{t("admin.title")}</h1>
      <p className="text-sm text-gray-600">{t("admin.welcome", { name: userName, role: "staff" })}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={onManageInventory} className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow" aria-label={t("admin.inventory")}>
          <span className="text-4xl" aria-hidden="true">\uD83D\uDE97</span>
          <h2 className="text-lg font-semibold text-gray-900">{t("admin.inventory")}</h2>
          <p className="text-xs text-gray-500 text-center">{t("admin.inventory.desc")}</p>
        </button>
        <button onClick={onManageInquiries} className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow" aria-label={t("admin.inquiries")}>
          <span className="text-4xl" aria-hidden="true">\uD83D\uDCE5</span>
          <h2 className="text-lg font-semibold text-gray-900">{t("admin.inquiries")}</h2>
          <p className="text-xs text-gray-500 text-center">{t("admin.inquiries.desc")}</p>
        </button>
      </div>
      <button onClick={onBackToCatalog} className="self-start text-sm text-blue-600 hover:underline mt-4" aria-label={t("admin.backToCatalog.aria")}>
        \u2190 {t("admin.backToCatalog")}
      </button>
    </div>
  );
}