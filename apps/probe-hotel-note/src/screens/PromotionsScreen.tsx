import { t } from "../i18n";
import { promotions } from "../fixtures/promotions";
import BottomNav from "../components/BottomNav";
import type { ScreenProps } from "./types";

export default function PromotionsScreen({ navigate, goBack, setCurrentPromo }: ScreenProps) {
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
        <h1 className="text-xl font-bold">{t("promotions.title")}</h1>
      </div>

      {/* Promo List */}
      <div className="flex flex-col gap-4 p-4">
        {promotions.map((promo) => (
          <button
            key={promo.id}
            aria-label={promo.title}
            data-testid="promo-list-card"
            onClick={() => setCurrentPromo(promo.id)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left"
          >
            <img
              src={promo.bannerUrl}
              alt={promo.title}
              className="w-full aspect-video object-cover"
            />
            <div className="p-3 flex flex-col gap-1">
              <span className="font-semibold text-sm">{promo.title}</span>
              <span className="text-xs text-gray-500">{promo.validity}</span>
              <span className="text-xs text-gray-500">
                {t("common.applicableFor", { models: promo.applicableModelsPreview })}
              </span>
            </div>
          </button>
        ))}
      </div>

      <BottomNav activeScreen="promotions" onNavigate={navigate} />
    </div>
  );
}
