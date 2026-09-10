import React, { useState, useEffect } from 'react';
import type { PassengerDetail } from '../types';
import { t } from '../i18n/vi';
import { useHoldTimer } from '../hooks/useHoldTimer';

interface Props {
  passengers: PassengerDetail[];
  iAmPassenger: boolean;
  expiresAt: string | null;
  outboundSessionId: string;
  returnSessionId: string | null;
  onPassengersChange: (p: PassengerDetail[]) => void;
  onIAmPassengerToggle: (v: boolean) => void;
  onContinue: () => void;
  onBack: () => void;
  onExpired: () => void;
  onHoldExpiredSearch: () => void;
}

let submitOutcome: 'success' | 'fail' = 'success';
export function setSubmitPassengersOutcome(outcome: 'success' | 'fail'): void {
  submitOutcome = outcome;
}

export function PassengersScreen({ passengers, iAmPassenger, expiresAt, onPassengersChange, onIAmPassengerToggle, onContinue, onBack, onExpired, onHoldExpiredSearch }: Props) {
  const { display, isExpired } = useHoldTimer(expiresAt);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<PassengerDetail | null>(null);
  const [apiError, setApiError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (isExpired) onExpired(); }, [isExpired, onExpired]);

  const getTypeLabel = (type: string): string => {
    switch (type) { case 'adult': return t('passengers.type.adult'); case 'child': return t('passengers.type.child'); case 'infant': return t('passengers.type.infant'); default: return type; }
  };

  const validatePassenger = (p: PassengerDetail): boolean => {
    if (!p.lastName.trim() || !p.firstName.trim()) return false;
    if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return false;
    return true;
  };

  const handleEdit = (index: number) => { setEditingIndex(index); setEditForm({ ...passengers[index] }); };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editForm) return;
    const isValid = validatePassenger(editForm);
    const updated = [...passengers];
    updated[editingIndex] = { ...editForm, isValid };
    onPassengersChange(updated);
    setEditingIndex(null);
    setEditForm(null);
  };

  const handleCancelEdit = () => { setEditingIndex(null); setEditForm(null); };

  const handleIAmPassengerToggle = () => {
    const newValue = !iAmPassenger;
    onIAmPassengerToggle(newValue);
    if (newValue && passengers.length > 0) {
      const updated = [...passengers];
      updated[0] = { ...updated[0], lastName: 'Nguy\u1EC5n', firstName: 'V\u0103n A', isValid: validatePassenger({ ...updated[0], lastName: 'Nguy\u1EC5n', firstName: 'V\u0103n A' }) };
      onPassengersChange(updated);
    }
  };

  const handleContinue = async () => {
    const firstInvalid = passengers.findIndex((p) => !p.isValid);
    if (firstInvalid >= 0) { handleEdit(firstInvalid); return; }
    if (isExpired) return;
    setSubmitting(true);
    setApiError(false);
    try {
      await new Promise((r) => setTimeout(r, 500));
      if (submitOutcome === 'fail') throw new Error('FIXTURE: passengers submit failed');
      const updated = passengers.map((p, i) => ({ ...p, passengerId: `pax_${i + 1}_${Date.now()}` }));
      onPassengersChange(updated);
      onContinue();
    } catch { setApiError(true); } finally { setSubmitting(false); }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center px-4 py-3 bg-[#F9FBF9]">
        <button type="button" className="w-10 h-10 flex items-center justify-center text-[#1A1A1A]" aria-label={t('passengers.back')} data-testid="back-action" onClick={onBack}>\u2190</button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[#1A1A1A]">{t('passengers.title')}</h1>
        <span className="text-sm font-semibold text-[#E12127]" aria-label={t('results.holdTimer.aria')} data-testid="hold-timer-display">{display}</span>
      </header>

      <div className="flex items-center gap-2 px-4 py-3">
        <button type="button" className={`w-12 h-6 rounded-full relative transition-colors ${iAmPassenger ? 'bg-[#E12127]' : 'bg-gray-300'}`} aria-label={t('passengers.iAmPassenger')} data-testid="i-am-passenger-toggle" onClick={handleIAmPassengerToggle}>
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${iAmPassenger ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
        <span className="text-base text-[#1A1A1A]">{t('passengers.iAmPassenger')}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
        {passengers.map((pax, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-[0px_5px_10px_rgba(89,27,27,0.05)] p-4" data-testid="passenger-card">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-base text-[#1A1A1A]" data-testid="passenger-label">{t('passengers.passengerLabel', { i: String(idx + 1), type: getTypeLabel(pax.type) })}</h2>
              {pax.isValid && <span className="text-[#22C55E] text-lg" data-testid="passenger-validation-status" aria-label={t('passengers.validationStatus.aria')}>\u2713</span>}
            </div>
            <p className="text-sm text-[#6B7280] mt-1" data-testid="passenger-summary">{pax.isValid ? `${pax.lastName} ${pax.firstName}` : t('passengers.notFilled')}</p>
            <button type="button" className="text-sm text-[#E12127] font-semibold mt-2" aria-label={t('passengers.edit.aria')} data-testid="passenger-edit-action" onClick={() => handleEdit(idx)}>{t('passengers.edit')}</button>
          </div>
        ))}
      </div>

      <div className="p-4">
        <button type="button" className={`w-full h-14 rounded-lg text-white font-semibold text-base transition-colors ${!submitting && !isExpired ? 'bg-[#E12127] hover:bg-[#c91d22]' : 'bg-gray-300 cursor-not-allowed'}`} disabled={submitting || isExpired} aria-label={t('passengers.continue.aria')} data-testid="passengers-continue" onClick={handleContinue}>
          {submitting ? t('common.loading') : t('passengers.continue')}
        </button>
      </div>

      {apiError && (<div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" data-testid="passenger-api-error-message"><p className="text-sm text-red-700">{t('passengers.apiError')}</p></div>)}

      {isExpired && (<div className="mx-4 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg" role="alert" data-testid="hold-expired-message"><p className="text-sm text-yellow-700">{t('passengers.holdExpired')}</p><button type="button" className="text-sm text-[#E12127] font-semibold mt-1" onClick={onHoldExpiredSearch} aria-label={t('passengers.searchAgain')}>{t('passengers.searchAgain')}</button></div>)}

      {editingIndex !== null && editForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-[480px] rounded-t-2xl p-4" role="dialog" aria-label={t('passengers.edit.aria')}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('passengers.passengerLabel', { i: String(editingIndex + 1), type: getTypeLabel(editForm.type) })}</h3>
              <button type="button" className="text-[#6B7280] text-2xl" onClick={handleCancelEdit} aria-label={t('passengers.detail.cancel')}>\u00D7</button>
            </div>
            <div className="flex flex-col gap-3">
              <div><label className="text-sm text-[#6B7280] block mb-1">{t('passengers.detail.lastName')}</label><input type="text" className="w-full p-3 border border-[#E6E8E7] rounded-lg" aria-label={t('passengers.detail.lastName')} value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} /></div>
              <div><label className="text-sm text-[#6B7280] block mb-1">{t('passengers.detail.firstName')}</label><input type="text" className="w-full p-3 border border-[#E6E8E7] rounded-lg" aria-label={t('passengers.detail.firstName')} value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} /></div>
              <div><label className="text-sm text-[#6B7280] block mb-1">{t('passengers.detail.gender')}</label>
                <div className="flex gap-3">
                  {(['Nam', 'N\u1EEF'] as const).map((g) => (<button key={g} type="button" className={`flex-1 py-2 rounded-lg border text-center font-semibold ${editForm.gender === g ? 'border-[#E12127] text-[#E12127] bg-red-50' : 'border-[#E6E8E7] text-[#1A1A1A]'}`} aria-label={g === 'Nam' ? t('passengers.detail.gender.male') : t('passengers.detail.gender.female')} aria-pressed={editForm.gender === g} onClick={() => setEditForm({ ...editForm, gender: g })}>{g === 'Nam' ? t('passengers.detail.gender.male') : t('passengers.detail.gender.female')}</button>))}
                </div>
              </div>
              <div><label className="text-sm text-[#6B7280] block mb-1">{t('passengers.detail.dob')}</label><input type="date" className="w-full p-3 border border-[#E6E8E7] rounded-lg" aria-label={t('passengers.detail.dob')} value={editForm.dateOfBirth} onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })} /></div>
              <div><label className="text-sm text-[#6B7280] block mb-1">{t('passengers.detail.phone')}</label><input type="tel" className="w-full p-3 border border-[#E6E8E7] rounded-lg" aria-label={t('passengers.detail.phone')} value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></div>
              <div><label className="text-sm text-[#6B7280] block mb-1">{t('passengers.detail.email')}</label><input type="email" className="w-full p-3 border border-[#E6E8E7] rounded-lg" aria-label={t('passengers.detail.email')} value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
            </div>
            <button type="button" className="w-full mt-4 h-12 bg-[#E12127] text-white rounded-lg font-semibold" aria-label={t('passengers.detail.save')} onClick={handleSaveEdit}>{t('passengers.detail.save')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
