import { useState } from "react";
import type { Car } from "../types";
import { t, formatPrice } from "../i18n/index";

interface Props {
  cars: Car[];
  onSelectCar: (id: string) => void;
  onClearFilters: () => void;
}

type SortKey = "price_asc" | "price_desc" | "newest" | "popular";

export default function SearchResultsScreen({ cars, onSelectCar, onClearFilters }: Props) {
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  const sorted = [...cars].sort((a, b) => {
    switch (sortBy) {
      case "price_asc": return a.price - b.price;
      case "price_desc": return b.price - a.price;
      case "newest": return b.year - a.year;
      default: return 0;
    }
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-gray-600">{t("results.count", { count: cars.length })}</p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-gray-600">{t("results.sortBy")}</label>
          <select id="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} className="px-2 py-1 border border-gray-300 rounded text-sm" aria-label={t("results.sortBy.aria")}>
            <option value="price_asc">{t("results.sort.priceLow")}</option>
            <option value="price_desc">{t("results.sort.priceHigh")}</option>
            <option value="newest">{t("results.sort.newest")}</option>
            <option value="popular">{t("results.sort.popular")}</option>
          </select>
        </div>
      </div>
      <button onClick={onClearFilters} className="self-start text-sm text-blue-600 hover:underline" aria-label={t("results.clearFilters.aria")}>
        {t("results.clearFilters")}
      </button>
      {sorted.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t("results.empty")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sorted.map(car => (
            <li key={car.id}>
              <button onClick={() => onSelectCar(car.id)} className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow" aria-label={`${car.make} ${car.model} ${car.year}`}>
                <img src={car.thumbnailUrl} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover" />
                <div className="p-3 flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-gray-900">{car.make} {car.model}</h3>
                  <p className="text-sm text-gray-600">{car.year}</p>
                  <p className="text-lg font-bold text-blue-700">{formatPrice(car.price, car.currency)}</p>
                  <p className="text-xs text-gray-500">{car.summarySpecs}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}