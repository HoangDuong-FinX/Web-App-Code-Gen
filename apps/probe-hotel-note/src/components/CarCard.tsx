import React from 'react';
import type { Car } from '../types';
import { t } from '../i18n';
import { formatPrice } from '../utils/format';

interface CarCardProps {
  car: Car;
  isFavorite: boolean;
  isInCompare: boolean;
  onTap: (carId: string) => void;
  onToggleFavorite: (carId: string) => void;
  onToggleCompare: (carId: string) => void;
}

export default function CarCard({ car, isFavorite, isInCompare, onTap, onToggleFavorite, onToggleCompare }: CarCardProps): React.JSX.Element {
  return (
    <div
      className="flex flex-col gap-2 p-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:shadow-md transition-shadow"
      data-testid="car-card"
      onClick={() => onTap(car.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(car.id); } }}
      tabIndex={0}
      aria-label={car.name}
    >
      <img
        src={car.thumbnailUrl}
        alt={car.name}
        className="w-full aspect-[4/3] object-cover rounded-lg"
      />
      <h3 className="font-semibold text-gray-900">{car.name}</h3>
      <div className="flex items-center gap-2">
        {car.promoPrice ? (
          <>
            <span className="text-red-600 font-semibold">{formatPrice(car.promoPrice)}</span>
            <span className="text-gray-400 line-through text-sm">{formatPrice(car.price)}</span>
          </>
        ) : (
          <span className="text-gray-900 font-semibold">{formatPrice(car.price)}</span>
        )}
      </div>
      <p className="text-sm text-gray-500">{car.keySpecs}</p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          aria-label={isFavorite ? t('common.removeFromFavorite') : t('common.addToFavorite')}
          data-testid="favorite-toggle"
          className={`p-1.5 rounded-full text-lg ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-100`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(car.id); }}
        >
          {isFavorite ? '\u2764' : '\u2661'}
        </button>
        <button
          type="button"
          aria-label={isInCompare ? t('common.removeFromCompare') : t('common.addToCompare')}
          data-testid="compare-toggle"
          className={`p-1.5 rounded-full text-lg ${isInCompare ? 'text-blue-500' : 'text-gray-400'} hover:bg-gray-100`}
          onClick={(e) => { e.stopPropagation(); onToggleCompare(car.id); }}
        >
          \u21d4
        </button>
      </div>
    </div>
  );
}
