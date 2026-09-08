import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { getCarById } from '../fixtures/cars';
import { testDriveSlots, dealerLocations, getSubmitTestDriveOutcome } from '../fixtures/dealer';

interface TestDriveBookingScreenProps {
  carId: string | null;
  onNavigate: (screen: ScreenId) => void;
  onSuccess: (refNumber: string) => void;
  onFailed: (altSlots: { slotId: string; startTime: string; endTime: string }[]) => void;
  userName?: string;
  userPhone?: string;
}

export default function TestDriveBookingScreen({
  carId,
  onNavigate,
  onSuccess,
  onFailed,
  userName = '',
  userPhone = '',
}: TestDriveBookingScreenProps) {
  const car = carId ? getCarById(carId) : undefined;
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [contactName, setContactName] = useState(userName);
  const [contactPhone, setContactPhone] = useState(userPhone);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    t('testDrive.step1'),
    t('testDrive.step2'),
    t('testDrive.step3'),
    t('testDrive.step4'),
  ];

  const availableSlots = testDriveSlots.filter((s) => s.available);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const outcome = getSubmitTestDriveOutcome();
      if (outcome === 'success') {
        onSuccess('TD-' + Date.now().toString(36).toUpperCase());
      } else {
        onFailed(availableSlots.map((s) => ({ slotId: s.slotId, startTime: s.startTime, endTime: s.endTime })));
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2 sticky top-0 z-10">
        <button onClick={() => onNavigate('car-detail')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('testDrive.title')}</h1>
      </header>

      {/* Step indicator */}
      <div className="px-4 py-3 flex gap-1">
        {steps.map((label, idx) => (
          <div key={idx} className="flex-1">
            <div className={`h-1 rounded-full ${idx + 1 <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <p className={`text-xs mt-1 ${idx + 1 === step ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Car summary */}
      {car && (
        <div className="px-4 py-2 flex items-center gap-3 bg-white border-b border-gray-100">
          <img src={car.thumbnail} alt={car.name} className="w-14 h-9 rounded object-cover" />
          <p className="text-sm font-medium">{car.name}</p>
        </div>
      )}

      <div className="px-4 py-4">
        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="td-date" className="text-sm font-medium text-gray-700 block mb-1">{t('testDrive.selectDate')}</label>
              <input
                id="td-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                aria-label={t('testDrive.selectDate')}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">{t('testDrive.selectTime')}</label>
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.slotId}
                    onClick={() => setSelectedSlotId(slot.slotId)}
                    className={`py-2.5 rounded-lg text-sm font-medium border ${
                      selectedSlotId === slot.slotId ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'
                    }`}
                    aria-label={`${slot.startTime} - ${slot.endTime}`}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedDate || !selectedSlotId}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
              aria-label={t('testDrive.next')}
            >
              {t('testDrive.next')}
            </button>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700 block">{t('testDrive.step2')}</label>
            {dealerLocations.map((loc) => (
              <button
                key={loc.locationId}
                onClick={() => setSelectedLocationId(loc.locationId)}
                className={`w-full text-left p-4 rounded-xl border ${
                  selectedLocationId === loc.locationId ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
                aria-label={loc.name}
              >
                <p className="font-medium text-gray-900">{loc.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{loc.address}</p>
              </button>
            ))}
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 py-3 rounded-xl font-medium text-gray-700" aria-label={t('testDrive.previous')}>
                {t('testDrive.previous')}
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedLocationId}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                aria-label={t('testDrive.next')}
              >
                {t('testDrive.next')}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="td-name" className="text-sm font-medium text-gray-700 block mb-1">{t('testDrive.name')}</label>
              <input
                id="td-name"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                aria-label={t('testDrive.name')}
              />
            </div>
            <div>
              <label htmlFor="td-phone" className="text-sm font-medium text-gray-700 block mb-1">{t('testDrive.phone')}</label>
              <input
                id="td-phone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                aria-label={t('testDrive.phone')}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 py-3 rounded-xl font-medium text-gray-700" aria-label={t('testDrive.previous')}>
                {t('testDrive.previous')}
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!contactName || !contactPhone}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                aria-label={t('testDrive.next')}
              >
                {t('testDrive.next')}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 space-y-2">
              <p className="text-sm"><span className="text-gray-500">{t('testDrive.selectDate')}:</span> <span className="font-medium">{selectedDate}</span></p>
              <p className="text-sm"><span className="text-gray-500">{t('testDrive.selectTime')}:</span> <span className="font-medium">{testDriveSlots.find((s) => s.slotId === selectedSlotId)?.startTime} - {testDriveSlots.find((s) => s.slotId === selectedSlotId)?.endTime}</span></p>
              <p className="text-sm"><span className="text-gray-500">{t('testDrive.step2')}:</span> <span className="font-medium">{dealerLocations.find((l) => l.locationId === selectedLocationId)?.name}</span></p>
              <p className="text-sm"><span className="text-gray-500">{t('testDrive.name')}:</span> <span className="font-medium">{contactName}</span></p>
              <p className="text-sm"><span className="text-gray-500">{t('testDrive.phone')}:</span> <span className="font-medium">{contactPhone}</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(3)} className="flex-1 border border-gray-200 py-3 rounded-xl font-medium text-gray-700" aria-label={t('testDrive.previous')}>
                {t('testDrive.previous')}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                aria-label={t('testDrive.confirm')}
                data-testid="confirm-booking"
              >
                {isSubmitting ? t('common.loading') : t('testDrive.confirm')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
