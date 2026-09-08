import { t } from '../i18n';
import type { ScreenId } from '../types';

interface InquirySentScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export default function InquirySentScreen({ onNavigate }: InquirySentScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="text-6xl text-green-500 mb-4">\u2713</div>
      <h1 className="text-2xl font-bold text-gray-900">{t('inquiry.sentTitle')}</h1>
      <p className="mt-2 text-gray-600 text-center">{t('inquiry.sentMessage')}</p>
      <div className="mt-8 w-full max-w-sm">
        <button
          onClick={() => onNavigate('car-detail')}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          aria-label={t('inquiry.backToDetail')}
        >
          {t('inquiry.backToDetail')}
        </button>
      </div>
    </div>
  );
}
