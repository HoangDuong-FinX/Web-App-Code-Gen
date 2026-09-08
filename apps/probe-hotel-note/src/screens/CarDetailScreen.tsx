import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { loadCarDetail } from '../fixtures/cars';
import type { Car } from '../types';

export default function CarDetailScreen(): React.JSX.Element {
  const { navigate, currentCarId } = useApp();
  const { isLoggedIn } = useAuth();
  const { isInCompare, addToCompare, removeFromCompare, compareList } = useCompare();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<'inquiry' | 'test-drive' | 'reserve' | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showCompareFullWarning, setShowCompareFullWarning] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!currentCarId) return;
      try {
        const data = await loadCarDetail(currentCarId);
        if (!cancelled) setCar(data);
      } catch {
        // error state
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [currentCarId]);

  function handleTransactionalAction(action: 'inquiry' | 'test-drive' | 'reserve'): void {
    if (!isLoggedIn) {
      setPendingAction(action);
      setShowLoginPrompt(true);
      return;
    }
    if (action === 'inquiry') navigate('inquiry-form', { currentCarId, selectedCar: car });
    else if (action === 'test-drive') navigate('td-select-showroom', { currentCarId, selectedCar: car });
    else if (action === 'reserve') navigate('reservation-terms', { currentCarId, selectedCar: car });
  }

  function handleCompareToggle(): void {
    if (!car) return;
    if (isInCompare(car.id)) {
      removeFromCompare(car.id);
    } else if (compareList.length >= 3) {
      setShowCompareFullWarning(true);
    } else {
      addToCompare(car);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-gray-500 mb-4">{t('catalog.emptyTitle')}</p>
        <button type="button" onClick={() => navigate('catalog')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{t('catalog.back')}</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('catalog')} aria-label={t('carDetail.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold flex-1">{t('carDetail.title')}</h1>
        <button type="button" aria-label={t('carDetail.share')} data-testid="share-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        </button>
      </header>

      <section aria-label={t('carDetail.gallery')} className="relative">
        <img src={car.photos[photoIndex]?.url} alt={car.photos[photoIndex]?.label} className="w-full aspect-video object-cover" />
        {car.photos.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {car.photos.map((photo: { url: string; label: string }, i: number) => (
              <button key={i} type="button" onClick={() => setPhotoIndex(i)} aria-label={photo.label} className={`w-2 h-2 rounded-full ${i === photoIndex ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </section>

      <section className="p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold">{car.name}</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${car.condition === 'M\u1edbi' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{car.condition}</span>
        <span className="text-2xl font-bold text-blue-600">{car.formattedPrice}</span>
        {car.hasActivePromo && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 w-fit">{car.promoLabel}</span>}
        <span className="text-sm text-gray-500">{t('carDetail.installment', { amount: car.monthlyInstallment })}</span>
      </section>

      <section className="p-4">
        <h3 className="text-lg font-bold mb-2">{t('carDetail.specs')}</h3>
        <div className="divide-y">
          {car.specs.map((spec: { label: string; value: string }) => (
            <div key={spec.label} className="flex justify-between py-2">
              <span className="text-sm text-gray-500">{spec.label}</span>
              <span className="text-sm font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="p-4">
        <h3 className="text-lg font-bold mb-2">{t('carDetail.dealer')}</h3>
        <div className="flex flex-col gap-1">
          <span className="font-medium">{car.dealer.name}</span>
          <span className="text-sm text-gray-500">{car.dealer.address}</span>
          <a href={`tel:${car.dealer.phone}`} aria-label={`${t('carDetail.callDealer')} ${car.dealer.name}`} data-testid="dealer-phone" className="text-sm text-blue-600">{car.dealer.phone}</a>
        </div>
      </section>

      <section className="p-4 flex flex-col gap-3 pb-8">
        <button type="button" onClick={() => handleTransactionalAction('inquiry')} aria-label={t('carDetail.inquiryAria')} data-testid="inquiry-cta" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">{t('carDetail.inquiry')}</button>
        <button type="button" onClick={() => handleTransactionalAction('test-drive')} aria-label={t('carDetail.testDriveAria')} data-testid="test-drive-cta" className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50">{t('carDetail.testDrive')}</button>
        {car.status === 'available' && (
          <button type="button" onClick={() => handleTransactionalAction('reserve')} aria-label={t('carDetail.reserveAria')} data-testid="reserve-cta" className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50">{t('carDetail.reserve')}</button>
        )}
        <button type="button" onClick={handleCompareToggle} aria-label={t('carDetail.compareAria')} data-testid="compare-cta" className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${isInCompare(car.id) ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          {t('carDetail.compare')}
        </button>
      </section>

      {/* Compare Tray */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white shadow-lg border-t p-3 flex items-center gap-2 z-10">
          <div className="flex gap-2 flex-1">
            {compareList.map(c => (
              <div key={c.id} className="flex flex-col items-center gap-1">
                <img src={c.thumbnailUrl} alt={c.name} className="w-12 h-9 object-cover rounded" />
                <button type="button" onClick={() => removeFromCompare(c.id)} aria-label={`${t('compareTray.removeAria')} ${c.name}`} className="text-gray-400 hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => navigate('compare')} aria-label={t('compareTray.openAria')} data-testid="open-compare" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium">
            {t('compareTray.open')} ({compareList.length})
          </button>
        </div>
      )}

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-label={t('modal.loginPrompt.title')} data-testid="login-prompt-dialog">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">{t('modal.loginPrompt.title')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('modal.loginPrompt.body')}</p>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={() => { setShowLoginPrompt(false); navigate('login', { returnTo: 'car-detail', returnAction: pendingAction }); }} aria-label={t('modal.loginPrompt.loginAria')} data-testid="go-to-login" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium">{t('modal.loginPrompt.login')}</button>
              <button type="button" onClick={() => setShowLoginPrompt(false)} aria-label={t('modal.loginPrompt.dismissAria')} data-testid="dismiss-login-prompt" className="w-full py-3 text-gray-600 rounded-lg font-medium hover:bg-gray-100">{t('modal.loginPrompt.dismiss')}</button>
            </div>
          </div>
        </div>
      )}

      {showCompareFullWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-label={t('modal.compareFull.title')} data-testid="compare-full-dialog">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">{t('modal.compareFull.title')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('modal.compareFull.body')}</p>
            <button type="button" onClick={() => setShowCompareFullWarning(false)} aria-label={t('modal.compareFull.dismissAria')} data-testid="dismiss-compare-warning" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium">{t('modal.compareFull.dismiss')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
