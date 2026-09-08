import { t } from "../i18n";
import type { ScreenId } from "../types";

interface BottomNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const navItems: { icon: string; labelKey: string; screen: ScreenId; testId: string }[] = [
  { icon: "\u2302", labelKey: "nav.home", screen: "home", testId: "nav-home" },
  { icon: "\uD83D\uDE97", labelKey: "nav.catalog", screen: "catalog", testId: "nav-catalog" },
  { icon: "\uD83C\uDFF7", labelKey: "nav.promotions", screen: "promotions", testId: "nav-promotions" },
  { icon: "\uD83D\uDCCB", labelKey: "nav.activity", screen: "my-activity", testId: "nav-activity" },
];

export default function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  return (
    <nav
      aria-label={t("nav.home")}
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex"
    >
      {navItems.map((item) => {
        const isActive = item.screen === activeScreen;
        return (
          <button
            key={item.screen}
            data-testid={item.testId}
            aria-label={t(item.labelKey)}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onNavigate(item.screen)}
            className={`flex-1 flex flex-col items-center py-2 text-xs ${isActive ? "text-blue-600 font-semibold" : "text-gray-500"}`}
          >
            <span className="text-lg" aria-hidden="true">{item.icon}</span>
            <span>{t(item.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
