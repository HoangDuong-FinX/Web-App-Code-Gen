import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { getSubmitCarListingOutcome } from '../fixtures/dealer';

interface AddEditCarScreenProps {
  editingCarId: string | null;
  onNavigate: (screen: ScreenId) => void;
}

export default function AddEditCarScreen({ editingCarId, onNavigate }: AddEditCarScreenProps) {
  const isEdit = !!editingCarId;
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<'new' | 'used'>('new');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [engine, setEngine] = useState('');
  const [exteriorColor, setExteriorColor] = useState('');
  const [interiorColor, setInteriorColor] = useState('');
  const [description, setDescription] = useState('');
  const [photoCount, setPhotoCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!brand || !model || !year || !price) errs.push(t('addCar.validationError'));
    if (photoCount < 3) errs.push(t('addCar.photoMinError'));
    if (photoCount > 20) errs.push(t('addCar.photoMaxError'));
    return errs;
  };

  const handlePublish = (isDraft: boolean) => {
    if (!isDraft) {
      const validationErrors = validate();
      if (validationErrors.length > 0) { setErrors(validationErrors); return; }
    }
    setErrors([]);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const outcome = getSubmitCarListingOutcome();
      if (outcome === 'success') {
        onNavigate('dealer-dashboard');
      } else {
        setErrors([t('addCar.validationError')]);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2 sticky top-0 z-10">
        <button onClick={() => onNavigate('dealer-dashboard')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{isEdit ? t('addCar.titleEdit') : t('addCar.titleAdd')}</h1>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Photos */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">{t('addCar.photos')}</h2>
          <p className="text-xs text-gray-500 mb-2">{t('addCar.photosHint')}</p>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3">
            <button
              onClick={() => setPhotoCount((c) => Math.min(c + 1, 20))}
              className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-2xl"
              aria-label={t('addCar.photos')}
            >
              +
            </button>
            <span className="text-sm text-gray-600">{photoCount}/20</span>
          </div>
        </section>

        {/* Basic Info */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">{t('addCar.basicInfo')}</h2>
          <div className="bg-white rounded-xl p-4 space-y-3">
            <div>
              <label htmlFor="ac-brand" className="text-sm text-gray-600 block mb-1">{t('carDetail.brand')}</label>
              <input id="ac-brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label={t('carDetail.brand')} />
            </div>
            <div>
              <label htmlFor="ac-model" className="text-sm text-gray-600 block mb-1">{t('carDetail.model')}</label>
              <input id="ac-model" type="text" value={model} onChange={(e) => setModel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label={t('carDetail.model')} />
            </div>
            <div>
              <label htmlFor="ac-year" className="text-sm text-gray-600 block mb-1">{t('carDetail.year')}</label>
              <input id="ac-year" type="number" value={year} onChange={(e) => setYear(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label={t('carDetail.year')} />
            </div>
            <div>
              <label htmlFor="ac-price" className="text-sm text-gray-600 block mb-1">{t('compare.price')}</label>
              <input id="ac-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label={t('compare.price')} />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">{t('carDetail.condition')}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setCondition('new')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${condition === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  aria-label={t('common.new')}
                >{t('common.new')}</button>
                <button
                  onClick={() => setCondition('used')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${condition === 'used' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  aria-label={t('common.used')}
                >{t('common.used')}</button>
              </div>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">{t('addCar.specifications')}</h2>
          <div className="bg-white rounded-xl p-4 space-y-3">
            <div>
              <label htmlFor="ac-mileage" className="text-sm text-gray-600 block mb-1">{t('carDetail.mileage')}</label>
              <input id="ac-mileage" type="number" value={mileage} onChange={(e) => setMileage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label={t('carDetail.mileage')} />
            </div>
            <div>
              <label htmlFor="ac-fuel" className="text-sm text-gray-600 block mb-1">{t('carDetail.fuelType')}</label>
              <input id="ac-fuel" type="text" value={fuelType} onChange={(e) => setFuelType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label={t('carDetail.fuelType')} />
            </div>
            <div>
              <label htmlFor="ac-trans" className="text-sm text-gray-600 block mb-1">{t('carDetail.transmission')}</label>
              <input id="ac-trans" type="text" value={transmission} onChange={(e) => setTransmission(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label={t('carDetail.transmission')} />
            </div>
            <div>
              <label htmlFor="ac-engine" className="text-sm text-gray-600 block mb-1">{t('carDetail.engine')}</label>
              <input id="ac-engine" type="text" value={engine} onChange={(e) => setEngine(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label={t('carDetail.engine')} />
            </div>
            <div>
              <label htmlFor="ac-ext" className="text-sm text-gray-600 block mb-1">{t('carDetail.exteriorColor')}</label>
              <input id="ac-ext" type="text" value={exteriorColor} onChange={(e) => setExteriorColor(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label={t('carDetail.exteriorColor')} />
            </div>
            <div>
              <label htmlFor="ac-int" className="text-sm text-gray-600 block mb-1">{t('carDetail.interiorColor')}</label>
              <input id="ac-int" type="text" value={interiorColor} onChange={(e) => setInteriorColor(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label={t('carDetail.interiorColor')} />
            </div>
          </div>
        </section>

        {/* Description */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">{t('addCar.description')}</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none"
            aria-label={t('addCar.description')}
          />
        </section>

        {/* Validation errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 p-3 rounded-lg" data-testid="listing-errors">
            {errors.map((err, idx) => (
              <p key={idx} className="text-sm text-red-500">{err}</p>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => handlePublish(true)}
            className="flex-1 border border-gray-200 py-3 rounded-xl font-medium text-gray-700"
            aria-label={t('addCar.saveDraft')}
          >
            {t('addCar.saveDraft')}
          </button>
          <button
            onClick={() => handlePublish(false)}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            aria-label={t('addCar.publish')}
            data-testid="publish-listing"
          >
            {isSubmitting ? t('common.loading') : t('addCar.publish')}
          </button>
        </div>
      </div>
    </div>
  );
}
