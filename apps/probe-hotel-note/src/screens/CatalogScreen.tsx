import { useState, useMemo } from "react";
import { t } from "../i18n";
import { filterCars } from "../fixtures/cars";
import BottomNav from "../components/BottomNav";
import type { ScreenProps } from "./types";

export default function CatalogScreen({
  navigate,
  goBack,
  setCurrentCar,
  toggleCompare,
  state,
}: ScreenProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(state.catalogFilter);
  const cars = useMemo(() => filterCars(activeFilter), [activeFilter]);
  const hasActiveFilters = activeFilter !== null;

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
        <h1 className="text-xl font-bold flex-1">{t("catalog.title")}</h1>
        <button
          data-testid="search-trigger"
          aria-label={t("common.search")}
          onClick={() => navigate("search")}
          className="p-2 text-gray-600"
        >
          \u{1F50D}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto">
        {["Sedan", "SUV", "Truck", "Hatchback"].map((type) => (
          <button
            key={type}
            data-testid={`filter-${type.toLowerCase()}`}
            aria-label={t("catalog.filter.body") + " " + type}
            onClick={() => setActiveFilter(activeFilter === type ? null : type)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeFilter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs text-gray-500">
          {t("catalog.resultsCount", { count: String(cars.length) })}
        </span>
        {hasActiveFilters && (
          <button
            data-testid="clear-filters"
            aria-label={t("catalog.clearFilters")}
            onClick={() => setActiveFilter(null)}
            className="text-blue-600 text-xs font-medium"
          >
            {t("catalog.clearFilters")}
          </button>
        )}
      </div>

      {/* Car list */}
      {cars.length > 0 ? (
        <div className="flex flex-col gap-3 p-4">
          {cars.map((car) => (
            <button
              key={car.id}
              aria-label={car.name}
              data-testid="car-list-card"
              onClick={() => setCurrentCar(car.id)}
              className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left"
            >
              <img
                src={car.thumbnailUrl}
                alt={car.name}
                className="w-28 aspect-[4/3] object-cover"
              />
              <div className="flex-1 p-3 flex flex-col gap-1">
                <span className="font-semibold text-sm">{car.name}</span>
                <span className="font-semibold text-sm text-blue-600">{car.formattedPrice}</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium w-fit ${
                    car.condition === "M\u1edbi" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                  aria-label={t("common.condition", { condition: car.condition })}
                >
                  {car.condition}
                </span>
                <span className="text-xs text-gray-500">{car.specsSummary}</span>
                <button
                  aria-label={t("carDetail.compare") + " " + car.name}
                  data-testid="compare-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompare(car.id);
                  }}
                  className={`mt-1 text-xs font-medium self-start px-2 py-1 rounded ${
                    state.compareList.includes(car.id)
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  disabled={state.compareList.length >= 3 && !state.compareList.includes(car.id)}
                >
                  \u2696 {t("carDetail.compare")}
                </button>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">\u{1F697}</div>
          <p className="text-center text-gray-700">{t("catalog.empty.title")}</p>
          <p className="text-center text-sm text-gray-500">{t("catalog.empty.subtitle")}</p>
        </div>
      )}

      <BottomNav activeScreen="catalog" onNavigate={navigate} />
    </div>
  );
}
