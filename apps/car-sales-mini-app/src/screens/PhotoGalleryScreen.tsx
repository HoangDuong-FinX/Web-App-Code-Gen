import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { getCarById } from '../fixtures/cars';

interface PhotoGalleryScreenProps {
  carId: string | null;
  onNavigate: (screen: ScreenId) => void;
}

export default function PhotoGalleryScreen({ carId, onNavigate }: PhotoGalleryScreenProps) {
  const car = carId ? getCarById(carId) : undefined;
  const photos = car?.photos ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, photos.length - 1));
  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => onNavigate('car-detail')}
          className="text-white text-2xl p-1"
          aria-label={t('gallery.close')}
        >
          \u00D7
        </button>
        <span className="text-white text-sm">
          {t('gallery.imageCounter', { current: currentIndex + 1, total: photos.length })}
        </span>
        <div className="w-8" />
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center relative">
        {photos.length > 0 && (
          <img
            src={photos[currentIndex].url}
            alt={`${car?.name ?? ''} ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        )}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
            aria-label={t('testDrive.previous')}
          >
            \u2190
          </button>
        )}
        {currentIndex < photos.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
            aria-label={t('testDrive.next')}
          >
            \u2192
          </button>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {photos.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`flex-shrink-0 rounded-lg overflow-hidden border-2 ${
              idx === currentIndex ? 'border-white' : 'border-transparent opacity-60'
            }`}
            aria-label={t('gallery.imageCounter', { current: idx + 1, total: photos.length })}
          >
            <img src={photo.thumbnailUrl} alt={`${idx + 1}`} className="w-16 h-10 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
