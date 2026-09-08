import { t } from '../i18n';
import type { ScreenId, TimeSlot } from '../types';

interface TestDriveFailedScreenProps {
  alternativeSlots: TimeSlot[];
  onNavigate: (screen: ScreenId) => void;
}

export default function TestDriveFailedScreen({ alternativeSlots, onNavigate }: TestDriveFailedScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="text-6xl text-red-500 mb-4">\u2717</div>
      <h1 className="text-2xl font-bold text-gray-900">{t('testDrive.failedTitle')}</h1>
      <p className="mt-2 text-gray-600 text-center">{t('testDrive.failedMessage')}</p>

      {alternativeSlots.length > 0 && (
        <section className="mt-6 w-full max-w-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3">{t('testDrive.alternativeSlots')}</h2>
          <div className="space-y-2">
            {alternativeSlots.map((slot) => (
              <div key={slot.slotId} className="bg-white rounded-lg p-3 border border-gray-200 text-sm">
                {slot.startTime} - {slot.endTime}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 w-full max-w-sm">
        <button
          onClick={() => onNavigate('test-drive-booking')}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          aria-label={t('testDrive.selectAlternative')}
        >
          {t('testDrive.selectAlternative')}
        </button>
      </div>
    </div>
  );
}
