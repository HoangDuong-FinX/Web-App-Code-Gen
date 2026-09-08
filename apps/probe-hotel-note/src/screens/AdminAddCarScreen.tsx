import React, { useState, useEffect, useCallback } from 'react';
import { t } from '../i18n';
import { loadCarDetail, saveCarListingFixture, uploadCarPhotoFixture } from '../fixtures/cars';
import Toast from '../components/Toast';

interface AdminAddCarScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
  params: Record<string, unknown>;
}

export default function AdminAddCarScreen({ onNavigate, params }: AdminAddCarScreenProps): React.JSX.Element {
  const editCarId = params.carId as string | undefined;
  const isEdit = Boolean(editCarId);

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [condition, setCondition] = useState('');
  const [color, setColor] = useState('');
  const [seats, setSeats] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [engineCapacity, setEngineCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (editCarId) {
      const car = loadCarDetail(editCarId);
      if (car) {
        setBrand(car.brand);
        setModel(car.model);
        setYear(String(car.year));
        setCondition(car.condition);
        setColor(car.color);
        setSeats(String(car.seats));
        setMileage(String(car.mileage));
        setFuelType(car.fuelType);
        setTransmission(car.transmission);
        setEngineCapacity(car.engineCapacity);
        setPrice(String(car.price));
        setPromoPrice(car.promoPrice ? String(car.promoPrice) : '');
        setDescription(car.description);
        setPhotos(car.photos);
      }
    }
  }, [editCarId]);

  const validatePublish = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!brand.trim()) errs.brand = t('validation.brandRequired');
    if (!model.trim()) errs.model = t('validation.modelRequired');
    if (!year.trim()) errs.year = t('validation.yearRequired');
    if (!price.trim()) errs.price = t('validation.priceRequired');
    if (!condition) errs.condition = t('validation.conditionRequired');
    if (photos.length === 0) errs.photos = t('validation.photoRequired');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [brand, model, year, price, condition, photos]);

  const handleSave = useCallback((status: 'active' | 'draft') => {
    setSubmitError('');
    if (status === 'active' && !validatePublish()) return;
    const result = saveCarListingFixture();
    if (result.success) {
      setToastMsg(t('common.successToast'));
      setToastVisible(true);
      setTimeout(() => onNavigate('admin-listings'), 500);
    } else {
      setSubmitError(t('common.errorRetry'));
    }
  }, [validatePublish, onNavigate]);

  const handleAddPhoto = useCallback(() => {
    const result = uploadCarPhotoFixture();
    if (result.success) {
      setPhotos((prev) => [...prev, result.photoUrl]);
    } else {
      setToastMsg(t('common.errorRetry'));
      setToastVisible(true);
    }
  }, []);

  const handleRemovePhoto = useCallback((idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
        <button type="button" aria-label={t('nav.back')} data-testid="back-action" className="p-2 text-lg text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => onNavigate('admin-listings')}>
          \u2190
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{isEdit ? t('adminAddCar.titleEdit') : t('adminAddCar.titleAdd')}</h1>
      </header>

      <section className="flex flex-col gap-2 p-4">
        <h2 className="text-base font-semibold text-gray-900">{t('adminAddCar.photos')}</h2>
        <div className="flex flex-wrap gap-2">
          {photos.map((url, idx) => (
            <div key={idx} className="relative">
              <img src={url} alt={t('adminAddCar.photoPreviewAlt')} className="w-20 h-15 object-cover rounded-lg" data-testid="photo-preview" />
              <button type="button" aria-label={t('adminAddCar.removePhotoAria')} data-testid="remove-photo-action" className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center" onClick={() => handleRemovePhoto(idx)}>
                \u2715
              </button>
            </div>
          ))}
        </div>
        {errors.photos && <p className="text-sm text-red-500">{errors.photos}</p>}
        <button type="button" aria-label={t('adminAddCar.addPhotoAria')} data-testid="add-photo-action" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 w-fit" onClick={handleAddPhoto}>
          {t('adminAddCar.addPhoto')}
        </button>
      </section>

      <section className="flex flex-col gap-4 p-4">
        <h2 className="text-base font-semibold text-gray-900">{t('adminAddCar.basicInfo')}</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-brand" className="text-sm font-medium text-gray-700">{t('adminAddCar.brand')} *</label>
          <input id="ac-brand" type="text" placeholder={t('adminAddCar.brandPlaceholder')} aria-label={t('adminAddCar.brand')} data-testid="brand-input" className={`px-4 py-3 rounded-lg border ${errors.brand ? 'border-red-500' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 outline-none`} value={brand} onChange={(e) => setBrand(e.target.value)} />
          {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-model" className="text-sm font-medium text-gray-700">{t('adminAddCar.model')} *</label>
          <input id="ac-model" type="text" placeholder={t('adminAddCar.modelPlaceholder')} aria-label={t('adminAddCar.model')} data-testid="model-input" className={`px-4 py-3 rounded-lg border ${errors.model ? 'border-red-500' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 outline-none`} value={model} onChange={(e) => setModel(e.target.value)} />
          {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-year" className="text-sm font-medium text-gray-700">{t('adminAddCar.year')} *</label>
          <input id="ac-year" type="number" placeholder={t('adminAddCar.yearPlaceholder')} aria-label={t('adminAddCar.year')} data-testid="year-input" className={`px-4 py-3 rounded-lg border ${errors.year ? 'border-red-500' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 outline-none`} value={year} onChange={(e) => setYear(e.target.value)} />
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-condition" className="text-sm font-medium text-gray-700">{t('adminAddCar.condition')} *</label>
          <select id="ac-condition" aria-label={t('adminAddCar.condition')} data-testid="condition-input" className={`px-4 py-3 rounded-lg border ${errors.condition ? 'border-red-500' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 outline-none`} value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="">{t('adminAddCar.condition')}</option>
            <option value="M\u1edbi">{t('adminAddCar.conditionNew')}</option>
            <option value="\u0110\u00e3 s\u1eed d\u1ee5ng">{t('adminAddCar.conditionUsed')}</option>
          </select>
          {errors.condition && <p className="text-sm text-red-500">{errors.condition}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-color" className="text-sm font-medium text-gray-700">{t('adminAddCar.color')}</label>
          <input id="ac-color" type="text" placeholder={t('adminAddCar.colorPlaceholder')} aria-label={t('adminAddCar.color')} data-testid="color-input" className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-seats" className="text-sm font-medium text-gray-700">{t('adminAddCar.seats')}</label>
          <input id="ac-seats" type="number" placeholder={t('adminAddCar.seatsPlaceholder')} aria-label={t('adminAddCar.seats')} data-testid="seats-input" className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={seats} onChange={(e) => setSeats(e.target.value)} />
        </div>
      </section>

      <section className="flex flex-col gap-4 p-4">
        <h2 className="text-base font-semibold text-gray-900">{t('adminAddCar.techSpecs')}</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-mileage" className="text-sm font-medium text-gray-700">{t('adminAddCar.mileage')}</label>
          <input id="ac-mileage" type="number" placeholder={t('adminAddCar.mileagePlaceholder')} aria-label={t('adminAddCar.mileage')} data-testid="mileage-input" className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={mileage} onChange={(e) => setMileage(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-fuel" className="text-sm font-medium text-gray-700">{t('adminAddCar.fuelType')}</label>
          <select id="ac-fuel" aria-label={t('adminAddCar.fuelType')} data-testid="fuel-type-input" className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
            <option value="">{t('adminAddCar.fuelType')}</option>
            <option value="X\u0103ng">{t('adminAddCar.fuelGas')}</option>
            <option value="D\u1ea7u">{t('adminAddCar.fuelDiesel')}</option>
            <option value="\u0110i\u1ec7n">{t('adminAddCar.fuelElectric')}</option>
            <option value="Hybrid">{t('adminAddCar.fuelHybrid')}</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-trans" className="text-sm font-medium text-gray-700">{t('adminAddCar.transmission')}</label>
          <select id="ac-trans" aria-label={t('adminAddCar.transmission')} data-testid="transmission-input" className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
            <option value="">{t('adminAddCar.transmission')}</option>
            <option value="T\u1ef1 \u0111\u1ed9ng">{t('adminAddCar.transmissionAuto')}</option>
            <option value="S\u1ed1 s\u00e0n">{t('adminAddCar.transmissionManual')}</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-engine" className="text-sm font-medium text-gray-700">{t('adminAddCar.engineCapacity')}</label>
          <input id="ac-engine" type="text" placeholder={t('adminAddCar.engineCapacityPlaceholder')} aria-label={t('adminAddCar.engineCapacity')} data-testid="engine-capacity-input" className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={engineCapacity} onChange={(e) => setEngineCapacity(e.target.value)} />
        </div>
      </section>

      <section className="flex flex-col gap-4 p-4">
        <h2 className="text-base font-semibold text-gray-900">{t('adminAddCar.priceAndDesc')}</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-price" className="text-sm font-medium text-gray-700">{t('adminAddCar.price')} *</label>
          <input id="ac-price" type="number" placeholder={t('adminAddCar.pricePlaceholder')} aria-label={t('adminAddCar.price')} data-testid="price-input" className={`px-4 py-3 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 outline-none`} value={price} onChange={(e) => setPrice(e.target.value)} />
          {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-promo" className="text-sm font-medium text-gray-700">{t('adminAddCar.promoPrice')}</label>
          <input id="ac-promo" type="number" placeholder={t('adminAddCar.promoPricePlaceholder')} aria-label={t('adminAddCar.promoPrice')} data-testid="promo-price-input" className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={promoPrice} onChange={(e) => setPromoPrice(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ac-desc" className="text-sm font-medium text-gray-700">{t('adminAddCar.description')}</label>
          <textarea id="ac-desc" placeholder={t('adminAddCar.descriptionPlaceholder')} aria-label={t('adminAddCar.description')} data-testid="description-input" rows={6} className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </section>

      {submitError && (
        <div className="mx-4 p-3 rounded-lg bg-red-50 border border-red-200" data-testid="error-banner">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      <div className="flex gap-3 p-4">
        <button type="button" aria-label={t('adminAddCar.saveDraftAria')} data-testid="save-draft-action" className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium" onClick={() => handleSave('draft')}>
          {t('adminAddCar.saveDraft')}
        </button>
        <button type="button" aria-label={t('adminAddCar.publishAria')} data-testid="publish-action" className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium" onClick={() => handleSave('active')}>
          {t('adminAddCar.publish')}
        </button>
      </div>

      <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  );
}
