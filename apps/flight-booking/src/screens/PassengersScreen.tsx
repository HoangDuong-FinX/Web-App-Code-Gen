import { useEffect, useState } from 'react';
import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId, PassengerForm } from '../types';
import type { NavigationState } from '../App';
import { HoldTimerBadge } from '../components/HoldTimerBadge';
import { sdk } from '../sdk';

interface PassengersScreenProps { navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void; }

export function PassengersScreen({ navigate }: PassengersScreenProps) {
  const t = useT(); const state = useAppState(); const dispatch = useAppDispatch();
  const [selfToggle, setSelfToggle] = useState(false); const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null); const [loading, setLoading] = useState(false);
  if (!state.outboundSession) { navigate('search'); return null; }

  useEffect(() => {
    if (state.passengerForms.length === 0) {
      const forms: PassengerForm[] = [];
      for (let i = 0; i < state.adults; i++) forms.push({ type: 'adult', lastName: '', firstName: '', gender: 'Male', dob: '', phone: '', email: '' });
      for (let i = 0; i < state.children; i++) forms.push({ type: 'child', lastName: '', firstName: '', gender: 'Male', dob: '', phone: '', email: '' });
      for (let i = 0; i < state.infants; i++) forms.push({ type: 'infant', lastName: '', firstName: '', gender: 'Male', dob: '', phone: '', email: '' });
      dispatch({ type: 'SET_PASSENGER_FORMS', payload: forms });
    }
  }, []);

  function handleSelfToggle() {
    const next = !selfToggle; setSelfToggle(next);
    if (next && state.passengerForms.length > 0) { dispatch({ type: 'UPDATE_PASSENGER', payload: { index: 0, form: { ...state.passengerForms[0], lastName: 'Nguyen', firstName: 'Van A' } } }); }
    else if (!next && state.passengerForms.length > 0) { dispatch({ type: 'UPDATE_PASSENGER', payload: { index: 0, form: { ...state.passengerForms[0], lastName: '', firstName: '' } } }); }
  }
  function updateField(index: number, field: keyof PassengerForm, value: string) { dispatch({ type: 'UPDATE_PASSENGER', payload: { index, form: { ...state.passengerForms[index], [field]: value } as PassengerForm } }); }
  function validate(): boolean { for (const form of state.passengerForms) { if (!form.lastName.trim() || !form.firstName.trim()) return false; if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return false; } return true; }

  async function handleSubmit() {
    setValidationError(null); setSubmitError(null);
    if (!validate()) { setValidationError(t.passengers.validationError); return; }
    if (state.holdExpired) return;
    setLoading(true);
    const passengers = state.passengerForms.map((f: PassengerForm) => ({ lastName: f.lastName, firstName: f.firstName, gender: f.gender, dateOfBirth: f.dob && /^\d{4}-\d{2}-\d{2}$/.test(f.dob) ? f.dob : null, phone: f.phone || null, email: f.email || null }));
    const res = await sdk.http.post<{ passengers: Array<{ passenger_id: string }> }>(`/sessions/${state.outboundSession!.sessionId}/passengers`, { passengers });
    if (!res.isSuccess || !res.data) { setSubmitError(t.passengers.error); setLoading(false); return; }
    const updatedForms = state.passengerForms.map((f: PassengerForm, i: number) => ({ ...f, passengerId: res.data!.passengers[i]?.passenger_id ?? `pax_${i + 1}` }));
    if (state.tripType === 'roundTrip' && state.returnSession) { await sdk.http.post(`/sessions/${state.returnSession.sessionId}/passengers`, { passengers }); }
    dispatch({ type: 'SET_PASSENGER_FORMS', payload: updatedForms }); setLoading(false); navigate('services');
  }

  function getTypeLabel(type: string): string { if (type === 'adult') return t.passengers.adult; if (type === 'child') return t.passengers.child; return t.passengers.infant; }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">{t.passengers.heading}</h1>
      <HoldTimerBadge navigate={navigate} />
      <label className="flex items-center gap-3 cursor-pointer">
        <div className={`relative w-10 h-6 rounded-full transition-colors ${selfToggle ? 'bg-red-600' : 'bg-gray-300'}`} onClick={handleSelfToggle} data-testid="self-toggle" aria-label={t.passengers.iAmPassenger} aria-checked={selfToggle}><div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${selfToggle ? 'translate-x-4' : 'translate-x-0.5'}`} /></div>
        <span className="text-sm text-gray-700">{t.passengers.iAmPassenger}</span>
      </label>
      {state.passengerForms.map((form: PassengerForm, idx: number) => (
        <div key={idx} className="border border-gray-200 rounded-lg p-4" data-testid="passenger-form">
          <h2 className="text-lg font-semibold text-gray-900 mb-3" data-testid="passenger-header">{t.passengers.passengerLabel.replace('{i}', String(idx + 1)).replace('{type}', getTypeLabel(form.type))}</h2>
          <div className="flex flex-col gap-3">
            <div><label className="block text-xs text-gray-500 mb-1">{t.passengers.lastName} *</label><input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" value={form.lastName} onChange={(e) => updateField(idx, 'lastName', e.target.value)} aria-label={t.passengers.lastName} data-testid="last-name-input" required /></div>
            <div><label className="block text-xs text-gray-500 mb-1">{t.passengers.firstMiddleName} *</label><input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" value={form.firstName} onChange={(e) => updateField(idx, 'firstName', e.target.value)} aria-label={t.passengers.firstMiddleName} data-testid="first-middle-name-input" required /></div>
            <div><label className="block text-xs text-gray-500 mb-1">{t.passengers.gender}</label><select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white" value={form.gender} onChange={(e) => updateField(idx, 'gender', e.target.value)} aria-label={t.passengers.gender} data-testid="gender-selector"><option value="Male">{t.passengers.male}</option><option value="Female">{t.passengers.female}</option></select></div>
            <div><label className="block text-xs text-gray-500 mb-1">{t.passengers.dob}</label><input type="date" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" value={form.dob} onChange={(e) => updateField(idx, 'dob', e.target.value)} aria-label={t.passengers.dob} data-testid="dob-input" /><p className="text-xs text-gray-400 mt-0.5">{t.passengers.dobFormat}</p></div>
            <div><label className="block text-xs text-gray-500 mb-1">{t.passengers.phone}</label><input type="tel" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" value={form.phone} onChange={(e) => updateField(idx, 'phone', e.target.value)} aria-label={t.passengers.phone} data-testid="phone-input" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">{t.passengers.email}</label><input type="email" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" value={form.email} onChange={(e) => updateField(idx, 'email', e.target.value)} aria-label={t.passengers.email} data-testid="email-input" /></div>
          </div>
        </div>
      ))}
      {validationError && <p className="text-red-600 text-xs" data-testid="validation-error-message" aria-live="assertive">{validationError}</p>}
      <button className={`w-full py-3 rounded-lg text-white font-semibold text-sm transition-colors ${!loading && !state.holdExpired ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`} disabled={loading || state.holdExpired} onClick={handleSubmit} aria-label={t.passengers.continueBtn} data-testid="passengers-continue">{loading ? t.common.loading : t.passengers.continueBtn}</button>
      {submitError && <p className="text-red-600 text-xs" data-testid="passenger-error-message" aria-live="assertive">{submitError}</p>}
    </div>
  );
}
