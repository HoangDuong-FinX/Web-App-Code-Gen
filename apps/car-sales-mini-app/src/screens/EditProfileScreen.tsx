import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId, UserProfile } from '../types';
import { getSaveProfileOutcome } from '../fixtures/auth';

interface EditProfileScreenProps {
  user: UserProfile | null;
  onNavigate: (screen: ScreenId) => void;
  onSave: (updated: UserProfile) => void;
}

export default function EditProfileScreen({ user, onNavigate, onSave }: EditProfileScreenProps) {
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    if (!name || !phone || !email) { setError(t('addCar.validationError')); return; }
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const outcome = getSaveProfileOutcome();
      if (outcome === 'success' && user) {
        onSave({ ...user, name, phone, email });
        onNavigate('profile');
      } else {
        setError(t('common.error'));
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <button onClick={() => onNavigate('profile')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('editProfile.title')}</h1>
      </header>

      <div className="px-4 py-6 max-w-sm mx-auto space-y-4">
        {/* Avatar */}
        <div className="flex justify-center">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={t('editProfile.photo')} className="w-20 h-20 rounded-full" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">\u263A</div>
          )}
        </div>

        <div>
          <label htmlFor="ep-name" className="text-sm font-medium text-gray-700 block mb-1">{t('register.fullName')}</label>
          <input id="ep-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" aria-label={t('register.fullName')} />
        </div>
        <div>
          <label htmlFor="ep-phone" className="text-sm font-medium text-gray-700 block mb-1">{t('register.phone')}</label>
          <input id="ep-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" aria-label={t('register.phone')} />
        </div>
        <div>
          <label htmlFor="ep-email" className="text-sm font-medium text-gray-700 block mb-1">{t('register.email')}</label>
          <input id="ep-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" aria-label={t('register.email')} />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('profile')}
            className="flex-1 border border-gray-200 py-3 rounded-xl font-medium text-gray-700"
            aria-label={t('editProfile.cancel')}
          >
            {t('editProfile.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            aria-label={t('editProfile.save')}
            data-testid="save-profile"
          >
            {isSubmitting ? t('common.loading') : t('editProfile.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
