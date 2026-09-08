import { t } from '../i18n';
import type { ScreenId, Car } from '../types';
import { getCarById } from '../fixtures/cars';
import { formatPrice } from '../utils';

interface CarDetailScreenProps {
  carId: string | null;
  onNavigate: (screen: ScreenId) => void;
  isAuthenticated: boolean;
  onAuthGate: (target: ScreenId) => void;
  wishlistIds: string[];
  onToggleWishlist: (carId: string) => void;
  compareList: string[];
  onToggleCompare: (carId: string) => void;
  onOpenGallery: () => void;
  onOpenContactOptions: () => void;
}

export default function CarDetailScreen({
  carId,
  onNavigate,
  isAuthenticated,
  onAuthGate,
  wishlistIds,
  onToggleWishlist,
  compareList,
  onToggleCompare,
  onOpenGallery,
  onOpenContactOptions,
}: CarDetailScreenProps) {
  const car: Car | undefined = carId ? getCarById(carId) : undefined;

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-500">{t('common.error')}</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 text-blue-600"
          aria-label={t('nav.back')}
        >
          {t('nav.back')}
        </button>
      </div>
    );
  }

  const isWishlisted = wishlistIds.includes(car.id);
  const isCompared = compareList.includes(car.id);

  const handleBuy = () => {
    if (!isAuthenticated) { onAuthGate('order-review'); return; }
    onNavigate('order-review');
  };

  const handleTestDrive = () => {
    if (!isAuthenticated) { onAuthGate('test-drive-booking'); return; }
    onNavigate('test-drive-booking');
  };

  const handleWishlist = () => {
    if (!isAuthenticated) { onAuthGate('car-detail'); return; }
    onToggleWishlist(car.id);
  };

  const specs = [
    { label: t('carDetail.brand'), value: car.brand },
    { label: t('carDetail.model'), value: car.model },
    { label: t('carDetail.year'), value: String(car.year) },
    { label: t('carDetail.mileage'), value: `${car.mileage.toLocaleString()} ${t('common.km')}` },
    { label: t('carDetail.fuelType'), value: car.fuelType },
    { label: t('carDetail.transmission'), value: car.transmission },
    { label: t('carDetail.engine'), value: car.engine },
    { label: t('carDetail.exteriorColor'), value: car.exteriorColor },
    { label: t('carDetail.interiorColor'), value: car.interiorColor },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button onClick={() => onNavigate('search-results')} className="text-gray-700 p-1" aria-label={t('nav.back')}>\u2190</button>
        <div className="flex gap-2">
          <button onClick={() => {}} className="text-gray-500 p-1" aria-label={t('carDetail.share')}>\u21B1</button>
          <button
            onClick={handleWishlist}
            className={`p-1 ${isWishlisted ? 'text-red-500' : 'text-gray-500'}`}
            aria-label={t('wishlist.title')}
            data-testid="wishlist-toggle"
          >
            {isWishlisted ? '\u2665' : '\u2661'}
          </button>
        </div>
      </header>

      {/* Gallery thumbnails */}
      <div className="flex gap-1 overflow-x-auto p-2">
        {car.photos.map((photo, idx) => (
          <button
            key={idx}
            onClick={onOpenGallery}
            className="flex-shrink-0"
            aria-label={`${t('gallery.imageCounter', { current: idx + 1, total: car.photos.length })}`}
          >
            <img src={photo.thumbnailUrl} alt={`${car.name} ${idx + 1}`} className="w-32 h-20 sm:w-40 sm:h-28 object-cover rounded-lg" />
          </button>
        ))}
      </div>

      {/* Name, Price, Tag */}
      <section className="px-4 mt-2">
        <h1 className="text-xl font-bold text-gray-900">{car.name}</h1>
        <p className="text-2xl font-bold text-blue-600 mt-1">{formatPrice(car.price)}</p>
        <div className="flex gap-2 mt-2">
          {car.tag && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{car.tag}</span>}
          <span className={`text-xs px-2 py-0.5 rounded-full ${car.condition === 'new' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {car.condition === 'new' ? t('carDetail.new') : t('carDetail.used')}
          </span>
        </div>
      </section>

      {/* Specifications */}
      <section className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('carDetail.specifications')}</h2>
        <div className="bg-white rounded-xl divide-y divide-gray-100">
          {specs.map((spec) => (
            <div key={spec.label} className="flex justify-between px-4 py-3">
              <span className="text-sm text-gray-500">{spec.label}</span>
              <span className="text-sm font-medium text-gray-900">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('carDetail.description')}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{car.description}</p>
      </section>

      {/* Dealer */}
      <section className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('carDetail.dealer')}</h2>
        <div className="bg-white rounded-xl p-4 flex items-center gap-3">
          <img src={car.dealer.avatarUrl} alt={car.dealer.name} className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">{car.dealer.name}</p>
            <p className="text-sm text-gray-500">{car.dealer.location}</p>
            <p className="text-sm text-yellow-500">\u2605 {car.dealer.rating}</p>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="px-4 mt-6">
        <button
          onClick={handleBuy}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors"
          aria-label={t('carDetail.buyDeposit')}
          data-testid="buy-button"
        >
          {t('carDetail.buyDeposit')}
        </button>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          <button
            onClick={handleTestDrive}
            className="bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
            aria-label={t('carDetail.testDrive')}
            data-testid="test-drive-button"
          >
            {t('carDetail.testDrive')}
          </button>
          <button
            onClick={() => onNavigate('financing-calculator')}
            className="bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
            aria-label={t('carDetail.financing')}
          >
            {t('carDetail.financing')}
          </button>
          <button
            onClick={() => onToggleCompare(car.id)}
            className={`border py-2.5 rounded-xl text-sm font-medium ${isCompared ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            aria-label={t('carDetail.compare')}
          >
            {t('carDetail.compare')}
          </button>
          <button
            onClick={onOpenContactOptions}
            className="bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
            aria-label={t('carDetail.contactDealer')}
          >
            {t('carDetail.contactDealer')}
          </button>
        </div>
      </section>
    </div>
  );
}
