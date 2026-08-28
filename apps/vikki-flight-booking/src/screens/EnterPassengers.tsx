import React, { useState, useEffect } from 'react';
import type { ScreenProps, PassengerData } from '../types';
import { t } from '../i18n';
import { getHostIdentity } from '../sdk/host';
import Text from '../components/Text';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import InlineError from '../components/InlineError';
import AlertNote from '../components/AlertNote';

function emptyPassenger(): PassengerData {
  return { lastName: '', firstName: '', gender: '', dateOfBirth: '', phone: '', email: '' };
}

export default function EnterPassengers(props: ScreenProps) {
  const { booking, navigate, handleSubmitPassengers } = props;
  const pax = booking.searchParams?.passengers ?? { adults: 1, children: 0, infants: 0 };
  const totalPax = pax.adults + pax.children + pax.infants;

  const [passengers, setPassengers] = useState<PassengerData[]>(() => {
    if (booking.passengers.length > 0) return booking.passengers;
    return Array.from({ length: totalPax }, () => emptyPassenger());
  });
  const [iamPassenger, setIamPassenger] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (iamPassenger) {
      const identity = getHostIdentity();
      if (identity) {
        const parts = identity.name.split(' ');
        const lastName = parts[0] ?? '';
        const firstName = parts.slice(1).join(' ');
        setPassengers(prev => {
          const copy = [...prev];
          copy[0] = { ...copy[0], lastName, firstName };
          return copy;
        });
      }
    }
  }, [iamPassenger]);

  const updatePassenger = (idx: number, field: keyof PassengerData, value: string) => {
    setPassengers(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const getPassengerType = (idx: number): string => {
    if (idx < pax.adults) return t('passengers.type.adult');
    if (idx < pax.adults + pax.children) return t('passengers.type.child');
    return t('passengers.type.infant');
  };

  const handleSubmit = async () => {
    setSubmitError(false);
    setSubmitting(true);
    const result = await handleSubmitPassengers(passengers);
    setSubmitting(false);
    if (!result.success) { setSubmitError(true); }
  };

  return (
    <div className="screen">
      <div className="header-row">
        <IconButton icon="back" onClick={() => navigate('booking-summary')} ariaLabel={t('common.back.aria')} />
        <Text variant="title-2" as="h1">{t('passengers.title')}</Text>
        <div style={{ width: 40 }} />
      </div>

      <Text variant="footnote" ariaLabel={t('passengers.step.aria')}>{t('passengers.step.aria')}</Text>

      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-008)', cursor: 'pointer' }}>
        <input type="checkbox" checked={iamPassenger} onChange={e => setIamPassenger(e.target.checked)} aria-label={t('passengers.iamPassenger.aria')} />
        <span style={{ fontSize: 14 }}>{t('passengers.iamPassenger')}</span>
      </label>

      {passengers.map((p, idx) => (
        <div key={idx} style={{ padding: '12px', borderRadius: 'var(--radius-012)', border: '1px solid var(--line-normal)', display: 'flex', flexDirection: 'column', gap: 'var(--gap-008)' }}>
          <Text variant="body-semibold">{t('passengers.label')} {idx + 1} - {getPassengerType(idx)}</Text>
          <input type="text" placeholder={t('passengers.lastName')} value={p.lastName} onChange={e => updatePassenger(idx, 'lastName', e.target.value)} aria-label={`${t('passengers.lastName')} ${idx + 1}`} style={{ padding: '10px 12px', borderRadius: 'var(--radius-008)', border: '1px solid var(--line-normal)', fontSize: 14, width: '100%' }} />
          <input type="text" placeholder={t('passengers.firstName')} value={p.firstName} onChange={e => updatePassenger(idx, 'firstName', e.target.value)} aria-label={`${t('passengers.firstName')} ${idx + 1}`} style={{ padding: '10px 12px', borderRadius: 'var(--radius-008)', border: '1px solid var(--line-normal)', fontSize: 14, width: '100%' }} />
          <select value={p.gender} onChange={e => updatePassenger(idx, 'gender', e.target.value)} aria-label={`${t('passengers.gender')} ${idx + 1}`} style={{ padding: '10px 12px', borderRadius: 'var(--radius-008)', border: '1px solid var(--line-normal)', fontSize: 14, width: '100%', background: 'var(--common-100)' }}>
            <option value="">{t('passengers.gender')}</option>
            <option value="male">{t('passengers.gender.male')}</option>
            <option value="female">{t('passengers.gender.female')}</option>
          </select>
          <input type="date" placeholder={t('passengers.dob')} value={p.dateOfBirth} onChange={e => updatePassenger(idx, 'dateOfBirth', e.target.value)} aria-label={`${t('passengers.dob')} ${idx + 1}`} style={{ padding: '10px 12px', borderRadius: 'var(--radius-008)', border: '1px solid var(--line-normal)', fontSize: 14, width: '100%' }} />
          <input type="tel" placeholder={t('passengers.phone')} value={p.phone} onChange={e => updatePassenger(idx, 'phone', e.target.value)} aria-label={`${t('passengers.phone')} ${idx + 1}`} style={{ padding: '10px 12px', borderRadius: 'var(--radius-008)', border: '1px solid var(--line-normal)', fontSize: 14, width: '100%' }} />
          <input type="email" placeholder={t('passengers.email')} value={p.email} onChange={e => updatePassenger(idx, 'email', e.target.value)} aria-label={`${t('passengers.email')} ${idx + 1}`} style={{ padding: '10px 12px', borderRadius: 'var(--radius-008)', border: '1px solid var(--line-normal)', fontSize: 14, width: '100%' }} />
        </div>
      ))}

      <InlineError visible={submitError} ariaLabel={t('passengers.submitError.aria')}>{t('passengers.submitError')}</InlineError>

      <Button variant="gradient" onClick={handleSubmit} disabled={submitting} ariaLabel={t('passengers.continue.aria')}>
        {submitting ? t('common.loading') : t('passengers.continue')}
      </Button>
    </div>
  );
}
