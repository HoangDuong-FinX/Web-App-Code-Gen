import { t } from '../i18n';
import type { ScreenId } from '../types';
import { featuredCars } from '../fixtures/cars';
import { formatPrice } from '../utils';
import BottomNav from '../components/BottomNav';

interface WishlistScreenProps {
  wishlistIds: string[];
  onToggleWishlist: (carId: string) => void;
  onSelectCar: (carId: string) => void;
  onNavigate: (screen: ScreenId) => void;
  isAuthenticated: boolean;
}

export default function WishlistScreen({
  wishlistIds,
  onToggleWishlist,
  onSelectCar,
  onNavigate,
  isAuthenticated,
}: WishlistScreenProps) {
  const wishlistCars = featuredCars.filter((c) => wishlistIds.includes(c.id));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <button onClick={() => onNavigate('profile')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('wishlist.title')}</h1>
      </header>

      {wishlistCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <p className="text-gray-500 text-lg">{t('wishlist.empty')}</p>
          <button
            onClick={() => onNavigate('home')}
            className="mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium"
            aria-label={t('wishlist.emptyAction')}
          >
            {t('wishlist.emptyAction')}
          </button>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {wishlistCars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex">
              <button onClick={() => onSelectCar(car.id)} className="flex-shrink-0" aria-label={car.name}>
                <img src={car.thumbnail} alt={car.name} className="w-28 h-24 object-cover" />
              </button>
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{car.name}</h3>
                  <p className="text-blue-600 font-bold text-sm mt-0.5">{formatPrice(car.price)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {car.year} | {car.mileage > 0 ? `${car.mileage.toLocaleString()} ${t('common.km')}` : t('common.new')} | {car.fuelType}
                  </p>
                </div>
                <button
                  onClick={() => onToggleWishlist(car.id)}
                  className="self-end text-xs text-red-500 mt-1"
                  aria-label={t('wishlist.remove')}
                >
                  {t('wishlist.remove')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav currentScreen="wishlist" onNavigate={onNavigate} isAuthenticated={isAuthenticated} />
    </div>
  );
}
