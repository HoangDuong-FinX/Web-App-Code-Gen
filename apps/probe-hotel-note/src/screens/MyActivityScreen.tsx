import { useState } from "react";
import { t } from "../i18n";
import { activityItems } from "../fixtures/activities";
import BottomNav from "../components/BottomNav";
import type { ScreenProps } from "./types";

type TabId = "inquiries" | "test-drives" | "reservations";

export default function MyActivityScreen({ navigate, goBack, setCurrentActivity }: ScreenProps) {
  const [activeTab, setActiveTab] = useState<TabId>("inquiries");

  const tabs: { id: TabId; label: string; testId: string }[] = [
    { id: "inquiries", label: t("myActivity.tab.inquiries"), testId: "tab-inquiries" },
    { id: "test-drives", label: t("myActivity.tab.testDrives"), testId: "tab-test-drives" },
    { id: "reservations", label: t("myActivity.tab.reservations"), testId: "tab-reservations" },
  ];

  const filteredItems = activityItems.filter((item) => {
    if (activeTab === "inquiries") return item.type === "inquiry";
    if (activeTab === "test-drives") return item.type === "test-drive";
    return item.type === "reservation";
  });

  return (
    <div className="flex flex-col min-h-screen pb-14">
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
        <h1 className="text-xl font-bold">{t("myActivity.title")}</h1>
      </div>

      {/* Tabs */}
      <div aria-label={t("myActivity.title")} className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-testid={tab.testId}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium text-center border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3 p-4">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            aria-label={item.carName}
            data-testid={`${item.type}-item`}
            onClick={() => setCurrentActivity(item.id)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left flex flex-col gap-1"
          >
            <span className="font-semibold text-sm">{item.carName}</span>
            {item.inquiryDate && (
              <span className="text-xs text-gray-500">{item.inquiryDate}</span>
            )}
            {item.bookingDatetime && (
              <span className="text-xs text-gray-500">{item.bookingDatetime}</span>
            )}
            {item.showroomName && (
              <span className="text-xs text-gray-500">{item.showroomName}</span>
            )}
            {item.reservationDate && (
              <span className="text-xs text-gray-500">{item.reservationDate}</span>
            )}
            {item.depositAmount && (
              <span className="text-xs text-blue-600">{item.depositAmount}</span>
            )}
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium w-fit ${
                item.statusVariant === "success"
                  ? "bg-green-100 text-green-700"
                  : item.statusVariant === "warning"
                    ? "bg-amber-100 text-amber-700"
                    : item.statusVariant === "error"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
              }`}
              aria-label={t("common.status", { status: item.statusLabel })}
            >
              {item.statusLabel}
            </span>
          </button>
        ))}
      </div>

      <BottomNav activeScreen="my-activity" onNavigate={navigate} />
    </div>
  );
}
