import React, { useState } from 'react';
import { ScreenId } from '../App';
import { useStore, Passenger } from '../store/useStore';
import { t } from '../i18n';
import { useTimer } from '../hooks/useTimer';
import { submitPassengers } from '../sdk/http';
import { getIdentity } from '../sdk/identity';

interface Props {
  navigate: (screen: ScreenId) => void;
}

interface PassengerForm extends Passenger {
  type: 'adult' | 'child' | 'infant';
}

export const Passengers: React.FC<Props> = ({ navigate }) => {
  const store = useStore();
  const { isExpired, formattedTime } = useTimer(store.expiresAt);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selfToggle, setSelfToggle] = useState(false);

  const totalPax = store.adults + store.children + store.infants;
  const buildInitialForms = (): PassengerForm[] => {
    const forms: PassengerForm[] = [];
    for (let i = 0; i < store.adults; i++) {
      forms.push({ lastName: '', firstName: '', gender: 'male', dob: null, phone: null, email: null, type: 'adult' });
    }
    for (let i = 0; i < store.children; i++) {
      forms.push({ lastName: '', firstName: '', gender: 'male', dob: null, phone: null, email: null, type: 'child' });
    }
    for (let i = 0; i < store.infants; i++) {
      forms.push({ lastName: '', firstName: '', gender: 'male', dob: null, phone: null, email: null, type: 'infant' });
    }
    return forms;
  };

  const [forms, setForms] = useState<PassengerForm[]>(buildInitialForms);
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});

  const handleSelfToggle = () => {
    const newVal = !selfToggle;
    setSelfToggle(newVal);
    if (newVal && forms.length > 0) {
      const identity = getIdentity();
      if (identity) {
        const updated = [...forms];
        updated[0] = { ...updated[0], lastName: identity.lastName, firstName: identity.firstName };
        setForms(updated);
      }
    }
  };

  const updateForm = (index: number, field: keyof PassengerForm, value: string) => {
    const updated = [...forms];
    if (field === 'gender') {
      updated[index] = { ...updated[index], gender: value as 'male' | 'female' };
    } else if (field === 'dob' || field === 'phone' || field === 'email') {
      updated[index] = { ...updated[index], [field]: value || null };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setForms(updated);
  };

  const validate = (): boolean => {
    const errors: Record<number, string[]> = {};
    forms.forEach((f, i) => {
      const errs: string[] = [];
      if (!f.lastName.trim()) errs.push('lastName');
      if (!f.firstName.trim()) errs.push('firstName');
      if (errs.length > 0) errors[i] = errs;
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (isExpired || loading) return;
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      const paxData = forms.map((f) => ({
        lastName: f.lastName.trim(),
        firstName: f.firstName.trim(),
        gender: f.gender,
        dob: f.dob,
        phone: f.phone,
        email: f.email,
      }));
      const result = await submitPassengers(store.sessionId!, paxData);
      const ids = result.passengers.map((p) => p.passenger_id);

      if (store.tripType === 'round-trip' && store.returnSessionId) {
        await submitPassengers(store.returnSessionId, paxData);
      }

      store.update({
        passengers: paxData.map((p) => ({ ...p, gender: p.gender as 'male' | 'female' })),
        passengerIds: ids,
      });
      navigate('services-grid');
    } catch {
      setApiError(t('passengers.error.api'));
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'adult': return t('passengers.type.adult');
      case 'child': return t('passengers.type.child');
      case 'infant': return t('passengers.type.infant');
      default: return '';
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button type="button" onClick={() => navigate('flight-results')} aria-label={t('common.back.ariaLabel')} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 20 }}>
          ←
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>{t('passengers.title')}</h1>
      </div>

      {/* Self toggle */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer', fontSize: 14 }}>
        <input
          type="checkbox"
          checked={selfToggle}
          onChange={handleSelfToggle}
          aria-label={t('passengers.selfToggle.ariaLabel')}
        />
        {t('passengers.selfToggle')}
      </label>

      {/* Passenger forms */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {forms.map((form, index) => (
          <div key={index} style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
              {t('passengers.passengerLabel', { index: String(index + 1), type: getTypeLabel(form.type) })}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>{t('passengers.lastName')} *</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => updateForm(index, 'lastName', e.target.value)}
                  aria-label={t('passengers.lastName')}
                  style={{ width: '100%', padding: 10, border: `1px solid ${validationErrors[index]?.includes('lastName') ? '#c62828' : '#e0e0e0'}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>{t('passengers.firstName')} *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => updateForm(index, 'firstName', e.target.value)}
                  aria-label={t('passengers.firstName')}
                  style={{ width: '100%', padding: 10, border: `1px solid ${validationErrors[index]?.includes('firstName') ? '#c62828' : '#e0e0e0'}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>{t('passengers.gender')}</label>
                <div style={{ display: 'flex', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, cursor: 'pointer' }}>
                    <input type="radio" name={`gender-${index}`} value="male" checked={form.gender === 'male'} onChange={() => updateForm(index, 'gender', 'male')} />
                    {t('passengers.gender.male')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, cursor: 'pointer' }}>
                    <input type="radio" name={`gender-${index}`} value="female" checked={form.gender === 'female'} onChange={() => updateForm(index, 'gender', 'female')} />
                    {t('passengers.gender.female')}
                  </label>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>{t('passengers.dob')}</label>
                <input
                  type="date"
                  value={form.dob ?? ''}
                  onChange={(e) => updateForm(index, 'dob', e.target.value)}
                  aria-label={t('passengers.dob')}
                  style={{ width: '100%', padding: 10, border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>{t('passengers.phone')}</label>
                <input
                  type="tel"
                  value={form.phone ?? ''}
                  onChange={(e) => updateForm(index, 'phone', e.target.value)}
                  aria-label={t('passengers.phone')}
                  style={{ width: '100%', padding: 10, border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>{t('passengers.email')}</label>
                <input
                  type="email"
                  value={form.email ?? ''}
                  onChange={(e) => updateForm(index, 'email', e.target.value)}
                  aria-label={t('passengers.email')}
                  style={{ width: '100%', padding: 10, border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {apiError && (
          <div role="alert" style={{ padding: 12, backgroundColor: '#ffebee', borderRadius: 8, color: '#c62828', fontSize: 13 }}>
            {apiError}
          </div>
        )}
        {isExpired && (
          <div role="alert" style={{ padding: 12, backgroundColor: '#fff3e0', borderRadius: 8, color: '#e65100', fontSize: 13 }}>
            {t('passengers.holdExpired')}
            <button type="button" onClick={() => { store.reset(); navigate('home-search'); }} style={{ marginLeft: 8, color: '#e65100', textDecoration: 'underline', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 13 }}>
              {t('passengers.holdExpired.action')}
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isExpired || loading}
          aria-label={t('passengers.submit.ariaLabel')}
          style={{
            width: '100%', padding: 14, borderRadius: 8, border: 'none',
            backgroundColor: (isExpired || loading) ? '#e0e0e0' : '#E31837',
            color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: (isExpired || loading) ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '...' : t('passengers.submit')}
        </button>
      </div>
    </div>
  );
};
