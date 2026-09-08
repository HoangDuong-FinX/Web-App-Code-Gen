import type { InventoryCar } from "../types";
import { t, formatPrice } from "../i18n/index";

interface Props {
  inventory: InventoryCar[];
  onAddCar: () => void;
  onEditCar: (id: string) => void;
  onDeleteCar: (id: string) => void;
  onBack: () => void;
}

const statusColor: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  sold: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function InventoryManagementScreen({ inventory, onAddCar, onEditCar, onDeleteCar, onBack }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-sm text-blue-600 hover:underline" aria-label={t("inventory.back.aria")}>
            \u2190 {t("inventory.back")}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t("inventory.title")}</h1>
        </div>
        <button onClick={onAddCar} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" aria-label={t("inventory.addCar.aria")}>
          + {t("inventory.addCar")}
        </button>
      </div>
      <p className="text-sm text-gray-500">{t("inventory.count", { count: inventory.length })}</p>
      {inventory.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t("inventory.empty")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {inventory.map(car => (
            <li key={car.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
              <img src={car.thumbnailUrl} alt={`${car.make} ${car.model}`} className="w-20 h-15 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{car.make} {car.model}</h3>
                <p className="text-sm text-gray-600">{car.year}</p>
                <p className="text-sm font-bold text-blue-700">{formatPrice(car.price, "VND")}</p>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${statusColor[car.status] ?? "bg-gray-100 text-gray-700"}`}>{car.status}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => onEditCar(car.id)} className="p-2 text-gray-500 hover:text-blue-600" aria-label={t("inventory.edit.aria")}>
                  \u270E
                </button>
                <button onClick={() => onDeleteCar(car.id)} className="p-2 text-gray-500 hover:text-red-600" aria-label={t("inventory.delete.aria")}>
                  \uD83D\uDDD1
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}