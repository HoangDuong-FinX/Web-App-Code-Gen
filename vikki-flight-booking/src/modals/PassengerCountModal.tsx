import React, { useState } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { t } from '../i18n';

interface PassengerCountModalProps {
  adults: number;
  children: number;
  infants: number;
  onConfirm: (adults: number, children: number, infants: number) => void;
  onClose: () => void;
}

export function PassengerCountModal({
  adults: initAdults,
  children: initChildren,
  infants: initInfants,
  onConfirm,
  onClose,
}: PassengerCountModalProps): React.ReactElement {
  const [adults, setAdults] = useState(initAdults);
  const [children, setChildren] = useState(initChildren);
  const [infants, setInfants] = useState(initInfants);

  function clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
  }

  const rows = [
    {
      key: 'adults',
      label: t('passengerCount.adults'),
      desc: t('passengerCount.adults.desc'),
      value: adults,
      min: 1,
      max: 4,
      set: (v: number) => {
        const a = clamp(v, 1, 4);
        setAdults(a);
        // Infant max = adult count
        if (infants > a) setInfants(a);
      },
    },
    {
      key: 'children',
      label: t('passengerCount.children'),
      desc: t('passengerCount.children.desc'),
      value: children,
      min: 0,
      max: 4,
      set: (v: number) => setChildren(clamp(v, 0, 4)),
    },
    {
      key: 'infants',
      label: t('passengerCount.infants'),
      desc: t('passengerCount.infants.desc'),
      value: infants,
      min: 0,
      max: adults,
      set: (v: number) => setInfants(clamp(v, 0, adults)),
    },
  ];

  return (
    <Modal
      title={t('passengerCount.title')}
      dismissible
      onClose={() => onConfirm(adults, children, infants)}
      data-testid="passenger-count-modal"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
        <Text variant="footnote">{t('passengerCount.specialHelp')}</Text>
        {rows.map(row => (
          <div
            key={row.key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px',
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius-8)',
            }}
          >
            <Text variant="body-semibold">{row.label}</Text>
            <Text variant="footnote">{row.desc}</Text>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                variant="secondary"
                onClick={() => row.set(row.value - 1)}
                disabled={row.value <= row.min}
                ariaLabel={t('passengerCount.decrement.ariaLabel', { type: row.label })}
                data-testid="decrement-button"
                style={{ minWidth: '40px', padding: '8px 12px' }}
              >
                −
              </Button>
              <Text variant="headline" style={{ minWidth: '24px', textAlign: 'center' }}>{row.value}</Text>
              <Button
                variant="secondary"
                onClick={() => row.set(row.value + 1)}
                disabled={row.value >= row.max}
                ariaLabel={t('passengerCount.increment.ariaLabel', { type: row.label })}
                data-testid="increment-button"
                style={{ minWidth: '40px', padding: '8px 12px' }}
              >
                +
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="primary"
          onClick={() => onConfirm(adults, children, infants)}
          ariaLabel={t('passengerCount.confirm.ariaLabel')}
          data-testid="confirm-button"
          fullWidth
        >
          {t('passengerCount.confirm')}
        </Button>
      </div>
    </Modal>
  );
}
