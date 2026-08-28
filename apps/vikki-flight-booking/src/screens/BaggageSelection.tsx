import React, { useState } from 'react';
import type { ScreenProps, AncillarySelection } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import IconButton from '../components/IconButton';

export default function BaggageSelection(props: ScreenProps) {
  const { booking, setBooking, navigate, ancillaryOptions, returnAncillaryOptions } = props;
  const [activeLeg, setActiveLeg] = useState<'outbound' | 'return'>('outbound');
  const [selections, setSelections] = useState<AncillarySelection[]>(booking.ancillarySelections.filter(s => ancillaryOptions.find(o => o.optionId === s.optionId && o.category === 'baggage')));

  const options = activeLeg === 'outbound'
    ? ancillaryOptions.filter(o => o.category === 'baggage')
    : returnAncillaryOptions.filter(o => o.category === 'baggage');

  const handleToggle = (optionId: string, passengerId: string) => {
    setSelections(prev => {
      const exists = prev.find(s => s.optionId === optionId && s.passengerId === passengerId);
      if (exists) return prev.filter(s => !(s.optionId === optionId && s.passengerId === passengerId));
      return [...prev, { optionId, passengerId }];
    });
  };

  const handleConfirm = () => {
    setBooking(prev => activeLeg === 'outbound'
      ? { ...prev, ancillarySelections: [...prev.ancillarySelections.filter(s => !ancillaryOptions.find(o => o.optionId === s.optionId && o.category === 'baggage')), ...selections] }
      : { ...prev, returnAncillarySelections: [...prev.returnAncillarySelections.filter(s => !returnAncillaryOptions.find(o => o.optionId === s.optionId && o.category === 'baggage')), ...selections] }
    );
    navigate('services-hub');
  };

  return (
    <div className="screen">
      <div className="header-row">
        <IconButton icon="back" onClick={() => navigate('services-hub')} ariaLabel={t('common.back.aria')} />
        <Text variant="title-2" as="h1">{t('baggage.title')}</Text>
        <div style={{ width: 40 }} />
      </div>

      {booking.tripType === 'round' && (
        <div style={{ display: 'flex', gap: 'var(--gap-008)' }} aria-label={t('baggage.tab.aria')}>
          <button type="button" onClick={() => setActiveLeg('outbound')} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-008)', background: activeLeg === 'outbound' ? 'var(--main-primary)' : 'var(--fill-normal)', color: activeLeg === 'outbound' ? 'var(--common-100)' : 'var(--label-normal)', fontSize: 13, fontWeight: 600 }}>{t('bookingSummary.outbound')}</button>
          <button type="button" onClick={() => setActiveLeg('return')} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-008)', background: activeLeg === 'return' ? 'var(--main-primary)' : 'var(--fill-normal)', color: activeLeg === 'return' ? 'var(--common-100)' : 'var(--label-normal)', fontSize: 13, fontWeight: 600 }}>{t('bookingSummary.return')}</button>
        </div>
      )}

      {options.length === 0 && <Text>{t('baggage.noOptions')}</Text>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-008)' }}>
        {options.map(opt => (
          <div key={opt.optionId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: 'var(--radius-008)', border: '1px solid var(--line-normal)' }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{opt.name}</span>
              <span style={{ fontSize: 12, color: 'var(--label-alternative)', marginLeft: 8 }}>{opt.unitPrice.toLocaleString('vi-VN')} VND</span>
            </div>
            <input
              type="checkbox"
              checked={selections.some(s => s.optionId === opt.optionId)}
              onChange={() => handleToggle(opt.optionId, booking.passengers[0]?.passengerId ?? '')}
              aria-label={`${opt.name} ${opt.unitPrice.toLocaleString('vi-VN')} VND`}
            />
          </div>
        ))}
      </div>

      <Button variant="gradient" onClick={handleConfirm} ariaLabel={t('baggage.confirm.aria')}>
        {t('baggage.confirm')}
      </Button>
    </div>
  );
}
