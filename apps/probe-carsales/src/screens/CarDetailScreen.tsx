import type { Car, Favorite } from "../types";
import { t, formatPrice } from "../i18n/index";

interface Props {
  car: Car;
  isAuthenticated: boolean;
  compareList: string[];
  favorites: Favorite[];
  onBack: () => void;
  onSaveFavorite: (carId: string) => void;
  onAddToCompare: (carId: string) => void;
  onGoToComparison: () => void;
  onRequestTestDrive: () => void;
  onMakeOffer: () => void;
  onGoToFavorites: () => void;
}

export default function CarDetailScreen({ car, isAuthenticated, compareList, favorites, onBack, onSaveFavorite, onAddToCompare, onGoToComparison, onRequestTestDrive, onMakeOffer, onGoToFavorites }: Props) {
  const isFavorite = favorites.some(f => f.id === car.id);
  const isInCompare = compareList.includes(car.id);
  const compareFull = compareList.length >= 5;
  const favoriteFull = favorites.length >= 50;
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="p-4">
        <button onClick={onBack} className="text-sm text-blue-600 hover:underline" aria-label={t("detail.back.aria")}>
          ← {t("detail.back")}
        </button>
      </div>
      <div className="relative">
        <img src={car.photos[activePhoto]?.url ?? car.thumbnailUrl} alt={car.photos[activePhoto]?.alt ?? `${car.make} ${car.model}`} className="w-full h-64 object-cover" />
        {car.photos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {car.photos.map((_, i) => (
              <button key={i} onClick={() => setActivePhoto(i)} className={`w-2 h-2 rounded-full ${i === activePhoto ? "bg-white" : "bg-white/50"}`} aria-label={`Photo ${i + 1}`} />
            ))}
          </div>
        )}
      </div>
      <div className="px-4 flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{car.make} {car.model} {car.year}</h1>
        <div className="flex items-center gap-2">
          <p className="text-xl font-bold text-blue-700">{formatPrice(car.price, car.currency)}</p>
          {car.priceNegotiable && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{t("detail.negotiable")}</span>}
        </div>
        <div className="flex gap-2">
          {isAuthenticated && (
            <button onClick={() => isFavorite ? onGoToFavorites() : favoriteFull ? undefined : onSaveFavorite(car.id)} disabled={favoriteFull && !isFavorite} className={`flex-1 py-2 text-sm font-medium rounded-lg border ${isFavorite ? "bg-red-50 text-red-600 border-red-200" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"} disabled:opacity-50`} aria-label={t("detail.save.aria")}>
              {isFavorite ? "♥" : "♡"} {t("detail.save")}
            </button>
          )}
          <button onClick={() => isInCompare ? onGoToComparison() : onAddToCompare(car.id)} disabled={compareFull && !isInCompare} className="flex-1 py-2 text-sm font-medium rounded-lg border bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 disabled:opacity-50" aria-label={t("detail.compare.aria")}>
            {t("detail.compare")} {isInCompare ? "✓" : ""}
          </button>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("detail.specs")}</h2>
          <dl className="grid grid-cols-2 gap-2">
            {([
              [t("detail.engine"), car.engine],
              [t("detail.transmission"), car.transmission],
              [t("detail.fuelType"), car.fuelType],
              [t("detail.mileage"), `${car.mileage.toLocaleString()} km`],
              [t("detail.color"), car.color],
              [t("detail.interior"), car.interior],
            ] as const).map(([label, value]) => (
              <div key={label} className="bg-gray-50 p-2 rounded">
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="text-sm font-medium text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("detail.features")}</h2>
          <div className="flex flex-wrap gap-2">
            {car.features.map(f => (
              <span key={f} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">✓ {f}</span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("detail.seller")}</h2>
          <p className="text-sm text-gray-700">{car.seller.name}</p>
          <p className="text-sm text-gray-500">{car.seller.contact}</p>
        </div>
        {isAuthenticated && (
          <div className="flex gap-2 mt-2">
            <button onClick={onRequestTestDrive} className="flex-1 py-3 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100" aria-label={t("detail.testDrive.aria")}>
              {t("detail.testDrive")}
            </button>
            <button onClick={onMakeOffer} className="flex-1 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" aria-label={t("detail.makeOffer.aria")}>
              {t("detail.makeOffer")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}