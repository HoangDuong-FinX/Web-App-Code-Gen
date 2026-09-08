import type { Car } from "../types";
import { t, formatPrice } from "../i18n/index";

interface Props {
  cars: Car[];
  onSelectCar: (id: string) => void;
  onOpenFilter: () => void;
}

export default function CatalogScreen({ cars, onSelectCar, onOpenFilter }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t("catalog.title")}</h1>
        <button
          onClick={onOpenFilter}
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
          aria-label={t("catalog.filterBtn.aria")}
        >
          {t("catalog.filterBtn")}
        </button>
      </div>
      {cars.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t("catalog.empty")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {cars.map((car) => (
            <li key={car.id}>
              <button
                onClick={() => onSelectCar(car.id)}
                className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                aria-label={`${car.make} ${car.model} ${car.year}`}
              >
                <img
                  src={car.thumbnailUrl}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
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