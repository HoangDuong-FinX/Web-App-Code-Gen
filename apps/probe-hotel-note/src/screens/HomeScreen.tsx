import { t } from "../i18n";
import { featuredCars } from "../fixtures/cars";
import { promotions } from "../fixtures/promotions";
import BottomNav from "../components/BottomNav";
import type { ScreenProps } from "./types";

export default function HomeScreen({ navigate, setCurrentCar, setCurrentPromo, setCatalogFilter, state }: ScreenProps) {
  const bodyTypes = ["Sedan", "SUV", "Truck", "Hatchback"];

  return (
    <div className="flex flex-col min-h-screen pb-14">
      <div className="flex items-center justify-between p-4">
        <img src="https://placehold.co/120x32/e2e8f0/475569?text=Vikki+Auto" alt={t("app.title")} className="h-8" />
        <div className="flex items-center gap-3">
          <button
            data-testid="search-trigger"
            aria-label={t("common.search")}
            onClick={() => navigate("search")}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {"\uD83D\uDD0D"}
          </button>
          <button
            data-testid="profile-trigger"
            aria-label={t("common.account")}
            onClick={() => navigate(state.isLoggedIn ? "my-activity" : "login")}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {"\uD83D\uDC64"}
          </button>
        </div>
      </div>

      <div aria-label={t("home.promoBanner.ariaLabel")} className="relative overflow-hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory">
          {promotions.map((promo) => (
            <button
              key={promo.id}
              onClick={() => setCurrentPromo(promo.id)}
              className="flex-shrink-0 w-full snap-center"
              aria-label={promo.title}
            >
              <img src={promo.bannerUrl} alt={promo.title} className="w-full aspect-video object-cover" />
            </button>
          ))}
        </div>
      </div>

      <section className="p-4">
        <h2 className="text-lg font-bold">{t("home.quickFilter.title")}</h2>
        <div className="flex flex-wrap gap-2 pt-3">
          {bodyTypes.map((type) => (
            <button
              key={type}
              data-testid={`quick-filter-${type.toLowerCase()}`}
              aria-label={t("catalog.filter.body") + " " + type}
              onClick={() => setCatalogFilter(type)}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <section className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{t("home.featured.title")}</h2>
          <button
            data-testid="view-all-featured"
            aria-label={t("home.featured.viewAll")}
            onClick={() => setCatalogFilter(null)}
            className="text-blue-600 text-sm font-medium"
          >
            {t("home.featured.viewAll")}
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pt-3 pb-2 -mx-4 px-4">
          {featuredCars.map((car) => (
            <button
              key={car.id}
              aria-label={car.name}
              data-testid="featured-car-card"
              onClick={() => setCurrentCar(car.id)}
              className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left"
            >
              <img src={car.thumbnailUrl} alt={car.name} className="w-full aspect-[4/3] object-cover" />
              <div className="p-3 flex flex-col gap-1">
                <span className="font-semibold text-sm">{car.name}</span>
                <span className="font-semibold text-sm text-blue-600">{car.formattedPrice}</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium w-fit ${car.condition === "M\u1edbi" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  aria-label={t("common.condition", { condition: car.condition })}
                >
                  {car.condition}
                </span>
                <span className="text-xs text-gray-500">{car.specsSummary}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{t("home.promos.title")}</h2>
          <button
            data-testid="view-all-promos"
            aria-label={t("home.promos.viewAll")}
            onClick={() => navigate("promotions")}
            className="text-blue-600 text-sm font-medium"
          >
            {t("home.promos.viewAll")}
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pt-3 pb-2 -mx-4 px-4">
          {promotions.map((promo) => (
            <button
              key={promo.id}
              aria-label={promo.title}
              data-testid="promo-card"
              onClick={() => setCurrentPromo(promo.id)}
              className="flex-shrink-0 w-64 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left"
            >
              <img src={promo.bannerUrl} alt={promo.title} className="w-full aspect-video object-cover" />
              <div className="p-3 flex flex-col gap-1">
                <span className="font-semibold text-sm">{promo.title}</span>
                <span className="text-xs text-gray-500">{promo.validity}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <BottomNav activeScreen="home" onNavigate={navigate} />
    </div>
  );
}
