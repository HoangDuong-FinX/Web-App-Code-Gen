import { t } from '../i18n';
import type { ScreenId } from '../types';
import { getOrders } from '../fixtures/orders';
import { formatPrice, formatDate } from '../utils';
import BottomNav from '../components/BottomNav';

interface MyOrdersScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectOrder: (orderId: string) => void;
  isAuthenticated: boolean;
}

const statusColors: Record<string, string> = {
  DepositPaid: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  ReadyForDelivery: 'bg-green-100 text-green-700',
  Delivered: 'bg-green-200 text-green-800',
  CancellationRequested: 'bg-orange-100 text-orange-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function MyOrdersScreen({ onNavigate, onSelectOrder, isAuthenticated }: MyOrdersScreenProps) {
  const orders = getOrders();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white px-4 py-3 border-b border-gray-200">
        <h1 className="text-lg font-semibold">{t('myOrders.title')}</h1>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <p className="text-gray-500 text-lg">{t('myOrders.empty')}</p>
          <button
            onClick={() => onNavigate('home')}
            className="mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium"
            aria-label={t('myOrders.emptyAction')}
          >
            {t('myOrders.emptyAction')}
          </button>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => onSelectOrder(order.id)}
              className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 text-left"
              aria-label={`${order.carName} - ${order.orderNumber}`}
            >
              <img src={order.carThumbnail} alt={order.carName} className="w-16 h-12 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{order.carName}</p>
                <p className="text-xs text-gray-500">{order.orderNumber} | {formatDate(order.date)}</p>
                <p className="text-sm font-bold text-blue-600 mt-0.5">{formatPrice(order.amount)}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                {t(`myOrders.status.${order.status}`)}
              </span>
            </button>
          ))}
        </div>
      )}

      <BottomNav currentScreen="my-orders" onNavigate={onNavigate} isAuthenticated={isAuthenticated} />
    </div>
  );
}
