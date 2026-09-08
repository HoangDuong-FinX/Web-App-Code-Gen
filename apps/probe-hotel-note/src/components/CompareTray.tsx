import { t } from "../i18n";
import { getCarById } from "../fixtures/cars";

interface CompareTrayProps {
  compareList: string[];
  onOpen: () => void;
  onRemove: (carId: string) => void;
}

export default function CompareTray({ compareList, onOpen, onRemove }: CompareTrayProps) {
  return (
    <div className="fixed bottom-14 left-0 right-0 max-w-md mx-auto bg-white shadow-lg border-t border-gray-200 p-3 flex items-center gap-2 z-10">
      <div className="flex gap-2 flex-1">
        {compareList.map((carId) => {
          const car = getCarById(carId);
          if (!car) return null;
          return (
            <div key={carId} className="flex flex-col items-center gap-1">
              <img src={car.thumbnailUrl} alt={car.name} className="w-12 h-9 object-cover rounded" />
              <button
                aria-label={t("compare.remove", { name: car.name })}
                onClick={() => onRemove(carId)}
                className="text-xs text-gray-400 hover:text-red-500"
              >
                {"\u2715"}
              </button>
            </div>
          );
        })}
      </div>
      <button
        data-testid="open-compare"
        aria-label={t("compare.title")}
        onClick={onOpen}
        className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg font-medium"
      >
        {t("compare.title")} ({compareList.length})
      </button>
    </div>
  );
}
