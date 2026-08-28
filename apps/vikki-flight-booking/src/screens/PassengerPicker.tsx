import React, { useState } from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import IconButton from '../components/IconButton';

interface StepperRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  ariaLabel: string;
}

function StepperRow({ label, value, min, max, onChange, ariaLabel }: StepperRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--line-normal)' }} aria-label={ariaLabel}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-012)' }}>
        <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label={`Giam ${label}`} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--line-normal)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: value <= min ? 0.3 : 1 }}>-</button>
        <span style={{ fontSize: 16, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{value}</span>
        <button type="button" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={`Tang ${label}`} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--line-normal)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: value >= max ? 0.3 : 1 }}>+</button>
      </div>
    </div>
  );
}

export default function PassengerPicker(props: ScreenProps) {
  const { navigate, booking } = props;
  const [adults, setAdults] = useState(booking.searchParams?.passengers.adults ?? 1);
  const [children, setChildren] = useState(booking.searchParams?.passengers.children ?? 0);
  const [infants, setInfants] = useState(booking.searchParams?.passengers.infants ?? 0);

  const handleConfirm = () => {
    navigate('search-home');
  };

  return (
    <div className="overlay" aria-label={t('passenger.overlay.aria')}>
      <div className="overlay-content">
        <div className="header-row">
          <Text variant="title-2" as="h2">{t('passenger.title')}</Text>
          <IconButton icon="close" onClick={() => navigate('search-home')} ariaLabel={t('common.back.aria')} />
        </div>
        <StepperRow label={t('passenger.adult.label')} value={adults} min={1} max={4} onChange={setAdults} ariaLabel={t('passenger.adult.aria')} />
        <StepperRow label={t('passenger.child.label')} value={children} min={0} max={4} onChange={setChildren} ariaLabel={t('passenger.child.aria')} />
        <StepperRow label={t('passenger.infant.label')} value={infants} min={0} max={adults} onChange={setInfants} ariaLabel={t('passenger.infant.aria')} />
        <Button variant="gradient" onClick={handleConfirm} ariaLabel={t('passenger.confirm.aria')}>
          {t('passenger.confirm')}
        </Button>
      </div>
    </div>
  );
}
