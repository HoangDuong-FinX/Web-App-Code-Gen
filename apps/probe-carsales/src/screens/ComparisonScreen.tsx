import type { Car } from "../types";
import { t, formatPrice } from "../i18n/index";

interface Props {
  cars: Car[];
  compareList: string[];
  onBack: () => void;
  onViewCar: (id: string) => void;
  onRemoveFromCompare: (id: string) => void;
  onAddMore: () => void;
}

export default function ComparisonScreen({ cars, compareList, onBack, onViewCar, onRemoveFromCompare, onAddMore }: Props) {
  const compareFull = compareList.length >= 5;

  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 pt-8">
        <p className="text-gray-500">{t("comparison.empty")}</p>
        <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-blue-600 hover:underline" aria-label={t("comparison.back.aria")}>
          {t("comparison.back")}
        </button>
      </div>
    );
  }

  const specRows: { label: string; getValue: (c: Car) => string }[] = [
    { label: t("comparison.price"), getValue: c => formatPrice(c.price, c.currency) },
    { label: t("comparison.year"), getValue: c => String(c.year) },
    { label: t("comparison.engine"), getValue: c => c.engine },
    { label: t("comparison.transmission"), getValue: c => c.transmission },
    { label: t("comparison.fuelType"), getValue: c => c.fuelType },
    { label: t("comparison.mileage"), getValue: c => `${c.mileage.toLocaleString()} km` },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <button onClick={onBack} className="self-start text-sm text-blue-600 hover:underline" aria-label={t("comparison.back.aria")}>
        ← {t("comparison.back")}
      </button>
      <h1 className="text-2xl font-bold text-gray-900">{t("comparison.title")}</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label={t("comparison.table.aria")}>
          <thead>
            <tr>
              <th className="text-left p-2 bg-gray-50 font-medium text-gray-600 sticky left-0">{t("comparison.spec")}</th>
              {cars.map(car => (
                <th key={car.id} className="p-2 bg-gray-50 text-center min-w-[120px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold text-gray-900">{car.make} {car.model}</span>
                    <button onClick={() => onRemoveFromCompare(car.id)} className="text-xs text-red-500 hover:underline" aria-label={`Remove ${car.make} ${car.model}`}>✕</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map(row => (
              <tr key={row.label} className="border-t border-gray-100">
                <td className="p-2 font-medium text-gray-600 sticky left-0 bg-white">{row.label}</td>
                {cars.map(car => (
                  <td key={car.id} className="p-2 text-center text-gray-900">{row.getValue(car)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={onAddMore} disabled={compareFull} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50" aria-label={t("comparison.addMore.aria")}>
          {t("comparison.addMore")}
        </button>
        {cars.length > 0 && (
          <button onClick={() => onViewCar(cars[0].id)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" aria-label={t("comparison.viewCar.aria")}>
            {t("comparison.viewCar")}
          </button>
        )}
      </div>
    </div>
  );
}