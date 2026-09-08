import React from "react";
import type { Car } from "../types";
import { formatCurrency } from "../utils/format";
import { t } from "../i18n";
import { useNavigation } from "../context/NavigationContext";
import { useCompare } from "../context/CompareContext";
import { useAuth } from "../context/AuthContext";
import { StatusBadge } from "./StatusBadge";

interface CarCardProps {
  car: Car;
  wishlisted?: boolean;
  onToggleWishlist?: (carId: string) => void;
  showCompare?: boolean;
  showWishlist?: boolean;
  showRemoveWishlist?: boolean;
  onRemoveWishlist?: (carId: string) => void;
  onCompareLimitReached?: () => void;
}

export function CarCard({
  car,
  wishlisted = false,
  onToggleWishlist,
  showCompare = true,
  showWishlist = true,
  showRemoveWishlist = false,
  onRemoveWishlist,
  onCompareLimitReached,
}: CarCardProps) {
  const { navigate } = useNavigation();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const { isAuthenticated } = useAuth();
  const inCompare = isInCompare(car.id);

  const handleCompareToggle = () => {
    if (inCompare) {
      removeFromCompare(car.id);
    } else {
      const added = addToCompare(car);
      if (!added && onCompareLimitReached) {
        onCompareLimitReached();
      }
    }
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      navigate("login");
      return;
    }
    onToggleWishlist?.(car.id);
  };

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
      data-testid={`car-card-${car.id}`}
    >
      <button
        type="button"
        className="relative w-full"
        onClick={() => navigate("car-detail", { carId: car.id })}
        aria-label={car.name}
      >
        <img src={car.thumbnailUrl} alt={car.name} className="h-40 w-full object-cover sm:h-48" loading="lazy" />
        <div className="absolute right-2 top-2">
          <StatusBadge status={car.status} />
        </div>
      </button>
      <div className="flex flex-col gap-1.5 p-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{car.name}</h3>
        <p className="text-base font-bold text-blue-700">{formatCurrency(car.price)}</p>
        <div className="flex items-center gap-2 pt-1">
          {showWishlist && (
            <button
              type="button"
              className={`text-lg ${wishlisted ? "text-red-500" : "text-gray-400"}`}
              onClick={handleWishlistToggle}
              aria-label={wishlisted ? t("wishlist.remove") : t("nav.wishlist")}
            >
              {wishlisted ? "\u2764" : "\u2661"}
            </button>
          )}
          {showCompare && (
            <button
              type="button"
              className={`rounded px-2 py-0.5 text-xs font-medium ${inCompare ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
              onClick={handleCompareToggle}
              aria-label={inCompare ? t("compare.remove") : t("car.compare")}
            >
              {inCompare ? "\u2713 " : ""}{t("car.compare")}
            </button>
          )}
          {showRemoveWishlist && (
            <button
              type="button"
              className="ml-auto text-xs text-red-500 hover:text-red-700"
              onClick={() => onRemoveWishlist?.(car.id)}
              aria-label={t("wishlist.remove")}
            >
              {t("wishlist.remove")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
