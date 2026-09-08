import { t } from '../i18n';
import type { ScreenId } from '../types';

interface TestDriveSuccessScreenProps {
  referenceNumber: string | null;
  onNavigate: (screen: ScreenId) => void;
}

export default function TestDriveSuccessScreen({ referenceNumber, onNavigate }: TestDriveSuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="text-6xl text-green-500 mb-4">\u2713</div>
      <h1 className="text-2xl font-bold text-gray-900">{t('testDrive.successTitle')}</h1>
      {referenceNumber && (
        <p className="mt-3 text-gray-600">
          {t('testDrive.referenceNumber')}: <span className="font-mono font-bold text-gray-900">{referenceNumber}</span>
        </p>
      )}
      <div className="mt-8 w-full max-w-sm space-y-3">
        <button
          onClick={() => onNavigate('car-detail')}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          aria-label={t('testDrive.backToDetail')}
        >
          {t('testDrive.backToDetail')}
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="w-full border border-gray-200 py-3 rounded-xl font-medium text-gray-700"
          aria-label={t('testDrive.goHome')}
        >
          {t('testDrive.goHome')}
        </button>
      </div>
    </div>
  );
}
