import { useState, useMemo } from "react";
import { t } from "../i18n";
import { searchCars, featuredCars } from "../fixtures/cars";
import type { ScreenProps } from "./types";

export default function SearchScreen({ goBack, setCurrentCar }: ScreenProps) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => (query.length >= 2 ? searchCars(query) : []), [query]);
  const hasResults = query.length >= 2 && results.length > 0;
  const noResults = query.length >= 2 && results.length === 0;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center p-4 gap-3">
        <button data-testid="back-action" aria-label={t("common.back")} onClick={goBack} className="p-2 text-gray-600">
          {"\u2190"}
        </button>
        <input
          data-testid="search-input"
          aria-label={t("search.placeholder")}
          type="text"
          placeholder={t("search.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {hasResults && (
        <div className="flex flex-col gap-3 p-4">
          {results.map((car) => (
            <button
              key={car.id}
              aria-label={car.name}
              data-testid="search-result-card"
              onClick={() => setCurrentCar(car.id)}
              className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left"
            >
              <img src={car.thumbnailUrl} alt={car.name} className="w-24 aspect-[4/3] object-cover" />
              <div className="flex-1 p-3 flex flex-col gap-1">
                <span className="font-semibold text-sm">{car.name}</span>
                <span className="font-semibold text-sm text-blue-600">{car.formattedPrice}</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium w-fit ${car.condition === "M\u1edbi" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  aria-label={t("common.condition", { condition: car.condition })}
                >
                  {car.condition}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {noResults && (
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">{"\uD83D\uDD0D"}</div>
          <p className="text-center text-gray-700">{t("search.noResults")}</p>
          <h3 className="text-lg font-bold mt-4">{t("search.popular")}</h3>
          <div className="flex flex-col gap-3 w-full">
            {featuredCars.slice(0, 3).map((car) => (
              <button key={car.id} aria-label={car.name} onClick={() => setCurrentCar(car.id)} className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left">
                <img src={car.thumbnailUrl} alt={car.name} className="w-20 aspect-[4/3] object-cover" />
                <div className="flex-1 p-3">
                  <span className="font-semibold text-sm">{car.name}</span>
                  <span className="block text-sm text-blue-600">{car.formattedPrice}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {query.length < 2 && (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3">{t("search.recent")}</h3>
          <p className="text-sm text-gray-400">{t("search.placeholder")}</p>
        </div>
      )}
    </div>
  );
}
