import React, { useState, useEffect, useCallback } from 'react';
import type { Car } from '../types';
import { t } from '../i18n';
import { getAdminListings, markCarSoldFixture, deleteCarListingFixture } from '../fixtures/cars';
import { formatPrice } from '../utils/format';
import Toast from '../components/Toast';

interface AdminListingsScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
}

const STATUS_FILTERS = [
  { key: 'all', label: 'adminListings.filterAll' },
  { key: 'active', label: 'adminListings.filterActive' },
  { key: 'sold', label: 'adminListings.filterSold' },
  { key: 'reserved', label: 'adminListings.filterReserved' },
  { key: 'draft', label: 'adminListings.filterDraft' },
];

export default function AdminListingsScreen({ onNavigate }: AdminListingsScreenProps): React.JSX.Element {
  const [listings, setListings] = useState<Car[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ type: 'delete' | 'sold'; carId: string; carName: string } | null>(null);

  const loadListings = useCallback((filter: string) => {
    setListings(getAdminListings(filter));
  }, []);

  useEffect(() => {
    loadListings(statusFilter);
  }, [statusFilter, loadListings]);

  const handleMarkSold = useCallback((carId: string, carName: string) => {
    setConfirmModal({ type: 'sold', carId, carName });
  }, []);

  const handleDelete = useCallback((carId: string, carName: string) => {
    setConfirmModal({ type: 'delete', carId, carName });
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (!confirmModal) return;
    if (confirmModal.type === 'sold') {
      const result = markCarSoldFixture();
      if (result.success) {
        setToastMsg(t('common.successToast'));
        setToastVisible(true);
        loadListings(statusFilter);
      } else {
        setToastMsg(t('common.errorRetry'));
        setToastVisible(true);
      }
    } else {
      const result = deleteCarListingFixture();
      if (result.success) {
        setToastMsg(t('common.successToast'));
        setToastVisible(true);
        loadListings(statusFilter);
      } else {
        setToastMsg(t('common.errorRetry'));
        setToastVisible(true);
      }
    }
    setConfirmModal(null);
  }, [confirmModal, statusFilter, loadListings]);

  const statusBadgeClass = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'sold': return 'bg-gray-100 text-gray-600';
      case 'reserved': return 'bg-yellow-100 text-yellow-700';
      case 'draft': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">{t('adminListings.title')}</h1>
        <button type="button" aria-label={t('adminListings.addCarAria')} data-testid="add-car-action" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium" onClick={() => onNavigate('admin-add-car')}>
          {t('adminListings.addCar')}
        </button>
      </header>

      <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b border-gray-100">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            data-testid="status-filter-tab"
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${statusFilter === f.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
            onClick={() => setStatusFilter(f.key)}
            aria-label={t('catalog.filterBy', { name: t(f.label) })}
          >
            {t(f.label)}
          </button>
        ))}
      </div>

      {listings.length > 0 ? (
        <div className="flex flex-col gap-3 p-4">
          {listings.map((car) => (
            <div key={car.id} className="flex gap-3 items-center p-3 rounded-xl border border-gray-200 bg-white">
              <img src={car.thumbnailUrl} alt={car.name} className="w-16 h-12 object-cover rounded-lg" />
              <div className="flex flex-col gap-1 flex-1">
                <h3 className="font-semibold text-gray-900">{car.name}</h3>
                <p className="text-gray-700 text-sm">{formatPrice(car.price)}</p>
                <span className={`inline-block w-fit px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(car.status)}`} data-testid="listing-status-badge">
                  {t('status.' + car.status)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <button type="button" aria-label={t('adminListings.editAria', { name: car.name })} data-testid="edit-listing-action" className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded" onClick={() => onNavigate('admin-add-car', { carId: car.id })}>
                  \u270e
                </button>
                <button type="button" aria-label={t('adminListings.markSoldAria', { name: car.name })} data-testid="mark-sold-action" className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded" onClick={() => handleMarkSold(car.id, car.name)}>
                  \u2713
                </button>
                <button type="button" aria-label={t('adminListings.deleteAria', { name: car.name })} data-testid="delete-listing-action" className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded" onClick={() => handleDelete(car.id, car.name)}>
                  \ud83d\uddd1
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 p-8" data-testid="empty-state">
          <img src="https://placehold.co/200x150/f1f5f9/94a3b8?text=No+Cars" alt={t('adminListings.emptyAlt')} data-testid="empty-state-illustration" className="w-48 h-36 object-contain" />
          <p className="text-gray-600">{t('adminListings.emptyTitle')}</p>
          <button type="button" aria-label={t('adminListings.addCarAria')} data-testid="add-car-action-empty" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => onNavigate('admin-add-car')}>
            {t('adminListings.addCar')}
          </button>
        </div>
      )}

      <div className="p-4">
        <button
          type="button"
          aria-label={t('adminListings.manageInquiriesAria')}
          data-testid="nav-to-inquiries-action"
          className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-center"
          onClick={() => onNavigate('admin-inquiries')}
        >
          {t('adminListings.manageInquiries')}
        </button>
      </div>

      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full flex flex-col gap-4" role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-gray-900">
              {confirmModal.type === 'delete' ? t('adminListings.deleteConfirmTitle') : t('adminListings.soldConfirmTitle')}
            </h2>
            <p className="text-gray-600">
              {confirmModal.type === 'delete' ? t('adminListings.deleteConfirmMessage') : t('adminListings.soldConfirmMessage')}
            </p>
            <div className="flex gap-3">
              <button type="button" className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100" onClick={() => setConfirmModal(null)}>
                {t('adminListings.confirmCancel')}
              </button>
              <button type="button" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleConfirmAction}>
                {t('adminListings.confirmYes')}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  );
}
