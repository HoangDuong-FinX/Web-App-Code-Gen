import React, { useState, useEffect, useCallback } from 'react';
import type { Car } from '../types';
import { t } from '../i18n';
import { loadCarDetail } from '../fixtures/cars';
import { toggleFavorite, isFavorite } from '../state/favorites';
import { toggleCompare, isInCompare } from '../state/compare';
import { formatPrice } from '../utils/format';
import Toast from '../components/Toast';

interface CarDetailScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
  params: Record<string, unknown>;
}

export default function CarDetailScreen({ onNavigate, params }: CarDetailScreenProps): React.JSX.Element {
  const carId = params.carId as string;
  const [car, setCar] = useState<Car | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [fav, setFav] = useState(false);
  const [inCompare, setInCompare] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const detail = loadCarDetail(carId);
    setCar(detail);
    setFav(isFavorite(carId));
    setInCompare(isInCompare(carId));
  }, [carId]);

  const handleShare = useCallback(async () => {
    if (car && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: car.name, url: window.location.href });
      } catch {
        setToastMsg(t('common.shareError'));
        setToastVisible(true);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setToastMsg(t('common.shareCopied'));
        setToastVisible(true);
      } catch {
        setToastMsg(t('common.shareError'));
        setToastVisible(true);
      }
    }
  }, [car]);

  const handleToggleFavorite = useCallback(() => {
    const result = toggleFavorite(carId);
    setFav(result.ids.includes(carId));
    if (!result.saved) {
      setToastMsg(t('common.saveFailed'));
      setToastVisible(true);
    }
  }, [carId]);

  const handleToggleCompare = useCallback(() => {
    const result = toggleCompare(carId);
    setInCompare(result.ids.includes(carId));
    if (result.limitReached) {
      setToastMsg(t('compare.limitToast'));
      setToastVisible(true);
    }
  }, [carId]);

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">{t('common.error')}</p>
        <button type="button" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => onNavigate('home')}>{t('nav.backToHome')}</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button type="button" aria-label={t('nav.back')} data-testid="back-action" className="p-2 text-lg text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => onNavigate('catalog')}>
          \u2190
        </button>
        <div className="flex gap-3">
          <button type="button" aria-label={t('carDetail.share')} data-testid="share-action" className="p-2 text-lg text-gray-600 hover:bg-gray-100 rounded-full" onClick={handleShare}>
            \u2197
          </button>
          <button type="button" aria-label={fav ? t('common.removeFromFavorite') : t('common.addToFavorite')} data-testid="favorite-toggle" className={`p-2 text-lg rounded-full hover:bg-gray-100 ${fav ? 'text-red-500' : 'text-gray-400'}`} onClick={handleToggleFavorite}>
            {fav ? '\u2764' : '\u2661'}
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-1">
        <img
          src={car.photos[photoIndex]}
          alt={t('carDetail.galleryAlt', { name: car.name })}
          className="w-full aspect-[16/9] object-cover"
          data-testid="photo-gallery"
        />
        <div className="flex justify-center gap-2 py-2">
          {car.photos.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={t('carDetail.galleryIndicator', { current: idx + 1, total: car.photos.length })}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === photoIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
              onClick={() => setPhotoIndex(idx)}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-500" data-testid="gallery-indicator">
          {t('carDetail.galleryIndicator', { current: photoIndex + 1, total: car.photos.length })}
        </p>
      </div>

      <section className="flex flex-col gap-2 p-4">
        <h1 className="text-2xl font-bold text-gray-900" data-testid="car-name">{car.name}</h1>
        <span className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-medium ${car.condition === 'M\u1edbi' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`} data-testid="car-condition-badge">
          {car.condition}
        </span>
        <div data-testid="car-price" className="flex items-center gap-2">
          {car.promoPrice ? (
            <>
              <span className="text-xl font-bold text-red-600">{formatPrice(car.promoPrice)}</span>
              <span className="text-gray-400 line-through">{formatPrice(car.price)}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-900">{formatPrice(car.price)}</span>
          )}
        </div>
        {car.installment && (
          <p className="text-sm text-gray-500" data-testid="installment-estimate">
            {t('carDetail.installment', { amount: car.installment })}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('carDetail.specs')}</h2>
        {car.specs.map((spec) => (
          <div key={spec.label} className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">{spec.label}</span>
            <span className="text-sm text-gray-900">{spec.value}</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('carDetail.description')}</h2>
        <p className="text-gray-700 leading-relaxed" data-testid="car-description">{car.description}</p>
      </section>

      <div className="px-4 pb-4">
        <button type="button" aria-label={inCompare ? t('common.removeFromCompare') : t('common.addToCompare')} data-testid="compare-toggle" className={`w-full py-2 rounded-lg border text-center transition-colors ${inCompare ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`} onClick={handleToggleCompare}>
          \u21d4 {t('carDetail.compare')}
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex gap-3 p-4 bg-white border-t border-gray-200 z-30">
        <button type="button" aria-label={t('carDetail.contactSeller')} data-testid="contact-seller-action" className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium" onClick={() => onNavigate('inquiry-form', { carId: car.id, carName: car.name, carPrice: formatPrice(car.promoPrice ?? car.price), carThumbnailUrl: car.thumbnailUrl })}>
          {t('carDetail.contactSeller')}
        </button>
        <button type="button" aria-label={t('carDetail.reserve')} data-testid="reserve-car-action" className="flex-1 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium" onClick={() => onNavigate('reservation-form', { carId: car.id, carName: car.name, carPrice: formatPrice(car.promoPrice ?? car.price), carThumbnailUrl: car.thumbnailUrl })}>
          {t('carDetail.reserve')}
        </button>
      </div>

      <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  );
}
