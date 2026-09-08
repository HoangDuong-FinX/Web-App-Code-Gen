import type { Favorite } from "../types";
import { t, formatPrice } from "../i18n/index";

interface Props {
  favorites: Favorite[];
  onSelectCar: (id: string) => void;
  onRemoveFavorite: (id: string) => void;
  onBackToCatalog: () => void;
  onCompareSelected: () => void;
}

export default function FavoritesScreen({ favorites, onSelectCar, onRemoveFavorite, onBackToCatalog, onCompareSelected }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <button onClick={onBackToCatalog} className="self-start text-sm text-blue-600 hover:underline" aria-label={t("favorites.back.aria")}>
        ← {t("favorites.back")}
      </button>
      <h1 className="text-2xl font-bold text-gray-900">{t("favorites.title")}</h1>
      <p className="text-sm text-gray-500">{t("favorites.count", { count: favorites.length })}</p>
      {favorites.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t("favorites.empty")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {favorites.map(fav => (
            <li key={fav.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button onClick={() => onSelectCar(fav.id)} className="w-full text-left" aria-label={`${fav.make} ${fav.model} ${fav.year}`}>
                <img src={fav.thumbnailUrl} alt={`${fav.make} ${fav.model}`} className="w-full h-40 object-cover" />
                <div className="p-3 flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-gray-900">{fav.make} {fav.model}</h3>
                  <p className="text-sm text-gray-600">{fav.year}</p>
                  <p className="text-lg font-bold text-blue-700">{formatPrice(fav.price, fav.currency)}</p>
                </div>
              </button>
              <div className="px-3 pb-3">
                <button onClick={() => onRemoveFavorite(fav.id)} className="text-sm text-red-500 hover:underline" aria-label={t("favorites.remove.aria")}>
                  {t("favorites.remove")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 justify-center">
        <button onClick={onBackToCatalog} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label={t("favorites.backToCatalog.aria")}>
          {t("favorites.backToCatalog")}
        </button>
        {favorites.length > 1 && (
          <button onClick={onCompareSelected} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" aria-label={t("favorites.compareSelected.aria")}>
            {t("favorites.compareSelected")}
          </button>
        )}
      </div>
    </div>
  );
}