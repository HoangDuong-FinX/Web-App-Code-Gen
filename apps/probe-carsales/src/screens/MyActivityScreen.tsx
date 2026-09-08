import { useState } from "react";
import type { TestDriveBooking, PurchaseInquiry } from "../types";
import { t, formatPrice } from "../i18n/index";

interface Props {
  testDrives: TestDriveBooking[];
  inquiries: PurchaseInquiry[];
  onSelectInquiry: (id: string) => void;
  onBackToCatalog: () => void;
}

type Tab = "test-drives" | "inquiries";

const statusColor: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  responded: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MyActivityScreen({ testDrives, inquiries, onSelectInquiry, onBackToCatalog }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("test-drives");

  return (
    <div className="flex flex-col gap-4 p-4">
      <button onClick={onBackToCatalog} className="self-start text-sm text-blue-600 hover:underline" aria-label={t("activity.back.aria")}>
        \u2190 {t("activity.back")}
      </button>
      <h1 className="text-2xl font-bold text-gray-900">{t("activity.title")}</h1>
      <div className="flex border-b border-gray-200" role="tablist" aria-label={t("activity.title")}>
        <button onClick={() => setActiveTab("test-drives")} className={`flex-1 py-2 text-sm font-medium text-center border-b-2 ${activeTab === "test-drives" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500"}`} role="tab" aria-selected={activeTab === "test-drives"} aria-label={t("activity.testDrives")}>
          {t("activity.testDrives")}
        </button>
        <button onClick={() => setActiveTab("inquiries")} className={`flex-1 py-2 text-sm font-medium text-center border-b-2 ${activeTab === "inquiries" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500"}`} role="tab" aria-selected={activeTab === "inquiries"} aria-label={t("activity.inquiries")}>
          {t("activity.inquiries")}
        </button>
      </div>
      {activeTab === "test-drives" && (
        <div role="tabpanel">
          {testDrives.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t("activity.emptyTestDrives")}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {testDrives.map(td => (
                <li key={td.id} className="bg-white p-3 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-900">{td.carMakeModel}</h3>
                  <p className="text-sm text-gray-600">{td.date} {td.time}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${statusColor[td.status] ?? "bg-gray-100 text-gray-700"}`}>{td.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {activeTab === "inquiries" && (
        <div role="tabpanel">
          {inquiries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t("activity.emptyInquiries")}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {inquiries.map(inq => (
                <li key={inq.id}>
                  <button onClick={() => onSelectInquiry(inq.id)} className="w-full text-left bg-white p-3 rounded-lg border border-gray-100 hover:shadow-sm" aria-label={`${inq.carMakeModel} - ${inq.status}`}>
                    <h3 className="font-semibold text-gray-900">{inq.carMakeModel}</h3>
                    {inq.offerPrice > 0 && <p className="text-sm text-gray-600">{t("activity.offer", { price: formatPrice(inq.offerPrice, "VND") })}</p>}
                    <p className="text-xs text-gray-500">{t("activity.submitted", { date: inq.submittedDate })}</p>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${statusColor[inq.status] ?? "bg-gray-100 text-gray-700"}`}>{inq.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}