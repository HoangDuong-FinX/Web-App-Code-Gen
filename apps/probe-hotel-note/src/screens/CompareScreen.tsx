import { t } from "../i18n";
import { getCarById } from "../fixtures/cars";
import type { ScreenProps } from "./types";

export default function CompareScreen({ goBack, setCurrentCar, toggleCompare, navigate, state }: ScreenProps) {
  const cars = state.compareList.map((id) => getCarById(id)).filter(Boolean);

  const allSpecLabels = Array.from(
    new Set(cars.flatMap((c) => (c ? c.specs.map((s) => s.label) : []))),
  );

  return (
    <div className="flex flex-col min-h-screen">
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
        <h1 className="text-xl font-bold">{t("compare.title")}</h1>
      </div>

      {/* Car Headers */}
      <div className="flex gap-4 px-4 overflow-x-auto">
        {cars.map((car) => {
          if (!car) return null;
          return (
            <div key={car.id} className="flex flex-col items-center gap-2 w-1/3 flex-shrink-0">
              <button onClick={() => setCurrentCar(car.id)} aria-label={car.name}>
                <img
                  src={car.thumbnailUrl}
                  alt={car.name}
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                />
              </button>
              <span className="text-xs font-semibold text-center">{car.name}</span>
              <span className="text-xs text-blue-600 text-center">{car.formattedPrice}</span>
              <button
                data-testid="remove-compare"
                aria-label={t("compare.remove", { name: car.name })}
                onClick={() => toggleCompare(car.id)}
                className="text-xs text-gray-400 hover:text-red-500"
              >
                \u2715
              </button>
            </div>
          );
        })}
      </div>

      {/* Spec Table */}
      <div className="p-4">
        {allSpecLabels.map((label) => (
          <div key={label} className="flex py-2.5 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 w-[30%]">{label}</span>
            <div className="flex flex-1 gap-2">
              {cars.map((car) => {
                const spec = car?.specs.find((s) => s.label === label);
                return (
                  <span key={car?.id} className="flex-1 text-sm text-center">
                    {spec?.value ?? "\u2014"}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add Car Button */}
      {state.compareList.length < 3 && (
        <button
          data-testid="add-car-compare"
          aria-label={t("compare.addCar")}
          onClick={() => navigate("catalog")}
          className="mx-4 mb-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium"
        >
          + {t("compare.addCar")}
        </button>
      )}
    </div>
  );
}
