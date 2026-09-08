import { t } from '../i18n';
import type { ScreenId, UserProfile, ModalId } from '../types';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';

interface ProfileScreenProps {
  user: UserProfile | null;
  onNavigate: (screen: ScreenId) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  activeModal: ModalId;
  onSetModal: (modal: ModalId) => void;
}

export default function ProfileScreen({ user, onNavigate, isAuthenticated, onLogout, activeModal, onSetModal }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white px-4 py-3 border-b border-gray-200">
        <h1 className="text-lg font-semibold">{t('profile.title')}</h1>
      </header>

      {/* Profile info */}
      <section className="px-4 mt-4">
        <div className="bg-white rounded-xl p-4 flex items-center gap-4">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">\u263A</div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{user?.name ?? ''}</p>
            <p className="text-sm text-gray-500">{user?.email ?? ''}</p>
            <p className="text-sm text-gray-500">{user?.phone ?? ''}</p>
          </div>
          <button
            onClick={() => onNavigate('edit-profile')}
            className="text-blue-600 text-sm font-medium"
            aria-label={t('profile.editProfile')}
          >
            {t('profile.editProfile')}
          </button>
        </div>
      </section>

      {/* Activity links */}
      <section className="px-4 mt-4">
        <h2 className="text-base font-semibold text-gray-900 mb-2">{t('profile.activity')}</h2>
        <div className="bg-white rounded-xl divide-y divide-gray-100">
          {[
            { label: t('profile.myOrders'), screen: 'my-orders' as ScreenId },
            { label: t('profile.myWishlist'), screen: 'wishlist' as ScreenId },
            { label: t('profile.myTestDrives'), screen: 'home' as ScreenId },
            { label: t('profile.settings'), screen: 'home' as ScreenId },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className="w-full text-left px-4 py-3.5 flex items-center justify-between hover:bg-gray-50"
              aria-label={item.label}
            >
              <span className="text-sm text-gray-900">{item.label}</span>
              <span className="text-gray-400">\u203A</span>
            </button>
          ))}
        </div>
      </section>

      {/* Dealer Dashboard link (if dealer) */}
      {user?.role === 'dealer' && (
        <section className="px-4 mt-4">
          <button
            onClick={() => onNavigate('dealer-dashboard')}
            className="w-full bg-white rounded-xl px-4 py-3.5 text-left text-sm font-medium text-blue-600"
            aria-label={t('dealer.dashboard')}
          >
            {t('dealer.dashboard')}
          </button>
        </section>
      )}

      {/* Logout */}
      <div className="px-4 mt-6">
        <button
          onClick={() => onSetModal('logout-confirm')}
          className="w-full border border-red-300 text-red-600 py-3 rounded-xl font-medium"
          aria-label={t('profile.logout')}
          data-testid="logout-button"
        >
          {t('profile.logout')}
        </button>
      </div>

      {/* Logout Confirm Modal */}
      <Modal isOpen={activeModal === 'logout-confirm'} onClose={() => onSetModal(null)}>
        <h3 className="text-lg font-semibold text-gray-900">{t('modal.logout.title')}</h3>
        <p className="text-sm text-gray-600 mt-2">{t('modal.logout.message')}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSetModal(null)}
            className="flex-1 border border-gray-200 py-2.5 rounded-xl font-medium text-gray-700"
            aria-label={t('modal.logout.dismiss')}
          >
            {t('modal.logout.dismiss')}
          </button>
          <button
            onClick={() => { onSetModal(null); onLogout(); }}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold"
            aria-label={t('modal.logout.confirm')}
            data-testid="confirm-logout"
          >
            {t('modal.logout.confirm')}
          </button>
        </div>
      </Modal>

      <BottomNav currentScreen="profile" onNavigate={onNavigate} isAuthenticated={isAuthenticated} />
    </div>
  );
}
