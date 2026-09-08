import { t } from '../i18n';
import type { ScreenId, ModalId } from '../types';
import { dealerDashboardData, getRemoveCarListingOutcome } from '../fixtures/dealer';
import Modal from '../components/Modal';
import { formatDate } from '../utils';

const statusColors: Record<string, string> = {
  DepositPaid: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Delivered: 'bg-green-200 text-green-800',
};

interface DealerDashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onEditCar: (carId: string | null) => void;
  activeModal: ModalId;
  onSetModal: (modal: ModalId) => void;
}

export default function DealerDashboardScreen({ onNavigate, onEditCar, activeModal, onSetModal }: DealerDashboardScreenProps) {
  const data = dealerDashboardData;

  const handleRemoveConfirm = () => {
    onSetModal(null);
    const outcome = getRemoveCarListingOutcome();
    if (outcome === 'success') {
      // In a real app, refresh the listing
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <button onClick={() => onNavigate('profile')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('dealer.dashboard')}</h1>
      </header>

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4">
          <p className="text-sm text-gray-500">{t('dealer.inventory')}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.inventoryCount}</p>
          <div className="mt-2 space-y-1">
            <button onClick={() => onEditCar(null)} className="text-sm text-blue-600 block" aria-label={t('dealer.addCar')}>{t('dealer.addCar')}</button>
            <button onClick={() => {}} className="text-sm text-blue-600 block" aria-label={t('dealer.viewListings')}>{t('dealer.viewListings')}</button>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <p className="text-sm text-gray-500">{t('dealer.activeLeads')}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.activeLeadsCount}</p>
          <button onClick={() => onNavigate('dealer-leads')} className="mt-2 text-sm text-blue-600" aria-label={t('dealer.viewLeads')}>{t('dealer.viewLeads')}</button>
        </div>
      </div>

      {/* Recent Orders */}
      <section className="px-4 mt-4">
        <h2 className="text-base font-semibold text-gray-900 mb-2">{t('dealer.recentOrders')}</h2>
        <div className="bg-white rounded-xl divide-y divide-gray-100">
          {data.recentOrders.map((order, idx) => (
            <div key={idx} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{order.carName}</p>
                <p className="text-xs text-gray-500">{order.buyerName} | {formatDate(order.date)}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                {t(`myOrders.status.${order.status}`)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Remove Listing Confirm Modal */}
      <Modal isOpen={activeModal === 'remove-listing-confirm'} onClose={() => onSetModal(null)}>
        <h3 className="text-lg font-semibold text-gray-900">{t('modal.removeListing.title')}</h3>
        <p className="text-sm text-gray-600 mt-2">{t('modal.removeListing.message')}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSetModal(null)}
            className="flex-1 border border-gray-200 py-2.5 rounded-xl font-medium text-gray-700"
            aria-label={t('modal.removeListing.dismiss')}
          >
            {t('modal.removeListing.dismiss')}
          </button>
          <button
            onClick={handleRemoveConfirm}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold"
            aria-label={t('modal.removeListing.confirm')}
          >
            {t('modal.removeListing.confirm')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
