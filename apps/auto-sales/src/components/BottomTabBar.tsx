import React from "react";
import { t } from "../i18n";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";
import type { ScreenId } from "../types";

export function BottomTabBar() {
  const { currentScreen, navigate } = useNavigation();
  const { isAdmin } = useAuth();

  if (isAdmin) {
    const adminTabs: { id: ScreenId; label: string; icon: string }[] = [
      { id: "admin-dashboard", label: t("nav.admin.dashboard"), icon: "\u2302" },
      { id: "admin-car-list", label: t("nav.admin.cars"), icon: "\u26FD" },
      { id: "admin-orders", label: t("nav.admin.orders"), icon: "\u2709" },
      { id: "admin-test-drives", label: t("nav.admin.testDrives"), icon: "\u231A" },
      { id: "admin-sales-report", label: t("nav.admin.reports"), icon: "\u2615" },
    ];
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-200 bg-white" aria-label={t("nav.admin.dashboard")}>
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`flex flex-1 flex-col items-center py-2 text-xs ${currentScreen === tab.id ? "text-blue-600 font-semibold" : "text-gray-500"}`}
            onClick={() => navigate(tab.id)}
            aria-label={tab.label}
            aria-current={currentScreen === tab.id ? "page" : undefined}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="mt-0.5">{tab.label}</span>
          </button>
        ))}
      </nav>
    );
  }

  const tabs: { id: ScreenId; label: string; icon: string }[] = [
    { id: "home", label: t("nav.home"), icon: "\u2302" },
    { id: "search-results", label: t("nav.search"), icon: "\u2315" },
    { id: "wishlist", label: t("nav.wishlist"), icon: "\u2665" },
    { id: "profile", label: t("nav.profile"), icon: "\u263A" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-200 bg-white" aria-label={t("nav.home")}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`flex flex-1 flex-col items-center py-2 text-xs ${currentScreen === tab.id ? "text-blue-600 font-semibold" : "text-gray-500"}`}
          onClick={() => navigate(tab.id)}
          aria-label={tab.label}
          aria-current={currentScreen === tab.id ? "page" : undefined}
        >
          <span className="text-lg">{tab.icon}</span>
          <span className="mt-0.5">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
