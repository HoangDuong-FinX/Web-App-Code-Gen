import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId, ModalId } from '../types';
import { getOrderById, getCancelOrderOutcome } from '../fixtures/orders';
import { formatPrice, formatDate } from '../utils';
import Modal from '../components/Modal';

const statusColors: Record<string, string> = {
  DepositPaid: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  ReadyForDelivery: 'bg-green-100 text-green-700',
  Delivered: 'bg-green-200 text-green-800',
  CancellationRequested: 'bg-orange-100 text-orange-700',
  Cancelled: 'bg-red-100 text-red-700',
};

interface OrderDetailScreenProps {
  orderId: string | null;
  onNavigate: (screen: ScreenId) => void;
  activeModal: ModalId;
  onSetModal: (modal: ModalId) => void;
}

export default function OrderDetailScreen({ orderId, onNavigate, activeModal, onSetModal }: OrderDetailScreenProps) {
  const order = orderId ? getOrderById(orderId) : undefined;
  const [cancelDeniedMsg, setCancelDeniedMsg] = useState('');
  const [localStatus, setLocalStatus] = useState(order?.status ?? 'DepositPaid');

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-500">{t('common.error')}</p>
        <button onClick={() => onNavigate('my-orders')} className="mt-4 text-blue-600" aria-label={t('nav.back')}>{t('nav.back')}</button>
      </div>
    );
  }

  const canCancel = localStatus === 'DepositPaid' || localStatus === 'Processing';

  const handleCancelConfirm = () => {
    onSetModal(null);
    const outcome = getCancelOrderOutcome();
    if (outcome === 'success') {
      setLocalStatus('CancellationRequested');
      setCancelDeniedMsg('');
    } else {
      setCancelDeniedMsg(t('orderDetail.cancelDenied'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2 sticky top-0 z-10">
        <button onClick={() => onNavigate('my-orders')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('orderDetail.title')}</h1>
      </header>

      {/* Status */}
      <section className="px-4 mt-4">
        <h2 className="text-base font-semibold text-gray-900 mb-2">{t('orderDetail.status')}</h2>
        <div className="bg-white rounded-xl p-4">
          <span className={`text-sm px-3 py-1 rounded-full ${statusColors[localStatus] ?? 'bg-gray-100 text-gray-700'}`}>
            {t(`myOrders.status.${localStatus}`)}
          </span>
          {/* Timeline */}
          {order.statusTimeline && order.statusTimeline.length > 0 && (
            <div className="mt-4 space-y-3">
              {order.statusTimeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t(`myOrders.status.${item.status}`)}</p>
                    <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Car Info */}
      {order.car && (
        <section className="px-4 mt-4">
          <h2 className="text-base font-semibold text-gray-900 mb-2">{t('orderDetail.carInfo')}</h2>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3">
            <img src={order.car.thumbnail} alt={order.car.name} className="w-20 h-14 rounded object-cover" />
            <div>
              <p className="font-medium text-gray-900">{order.car.name}</p>
              <p className="text-xs text-gray-500">{order.car.keySpecs}</p>
            </div>
          </div>
        </section>
      )}

      {/* Payment Info */}
      <section className="px-4 mt-4">
        <h2 className="text-base font-semibold text-gray-900 mb-2">{t('orderDetail.paymentInfo')}</h2>
        <div className="bg-white rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('payment.title')}</span>
            <span className="font-medium">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('orderReview.deposit')}</span>
            <span className="font-bold text-blue-600">{formatPrice(order.amountPaid ?? 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('orderReview.remaining')}</span>
            <span className="font-medium">{formatPrice(order.remainingBalance ?? 0)}</span>
          </div>
        </div>
      </section>

      {/* Dealer Contact */}
      {order.dealer && (
        <section className="px-4 mt-4">
          <h2 className="text-base font-semibold text-gray-900 mb-2">{t('orderDetail.dealerContact')}</h2>
          <div className="bg-white rounded-xl p-4 space-y-1">
            <p className="text-sm font-medium">{order.dealer.name}</p>
            <p className="text-sm text-gray-500">{order.dealer.phone}</p>
            <p className="text-sm text-gray-500">{order.dealer.notes}</p>
          </div>
        </section>
      )}

      {/* Cancel action BR-06 */}
      {canCancel && (
        <div className="px-4 mt-6">
          <button
            onClick={() => onSetModal('cancel-order-confirm')}
            className="w-full border border-red-300 text-red-600 py-3 rounded-xl font-medium"
            aria-label={t('orderDetail.cancelOrder')}
            data-testid="cancel-order"
          >
            {t('orderDetail.cancelOrder')}
          </button>
        </div>
      )}

      {cancelDeniedMsg && (
        <div className="px-4 mt-3">
          <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg" data-testid="cancel-denied">{cancelDeniedMsg}</p>
        </div>
      )}

      {/* Cancel Order Confirm Modal */}
      <Modal isOpen={activeModal === 'cancel-order-confirm'} onClose={() => onSetModal(null)}>
        <h3 className="text-lg font-semibold text-gray-900">{t('modal.cancelOrder.title')}</h3>
        <p className="text-sm text-gray-600 mt-2">{t('modal.cancelOrder.message')}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSetModal(null)}
            className="flex-1 border border-gray-200 py-2.5 rounded-xl font-medium text-gray-700"
            aria-label={t('modal.cancelOrder.dismiss')}
          >
            {t('modal.cancelOrder.dismiss')}
          </button>
          <button
            onClick={handleCancelConfirm}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold"
            aria-label={t('modal.cancelOrder.confirm')}
            data-testid="confirm-cancel"
          >
            {t('modal.cancelOrder.confirm')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
