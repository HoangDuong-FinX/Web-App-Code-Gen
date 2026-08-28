import React, { useEffect, useState } from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import { httpGet, unwrap } from '../sdk/http';
import type { AncillaryOption } from '../types';
import { comingSoonServices } from '../fixtures/coming-soon-services';
import Text from '../components/Text';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import AlertNote from '../components/AlertNote';

export default function ServicesHub(props: ScreenProps) {
  const { booking, navigate, setAncillaryOptions, setReturnAncillaryOptions } = props;
  const [catalogueError, setCatalogueError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMeals, setHasMeals] = useState(false);
  const [hasBaggage, setHasBaggage] = useState(false);

  const loadCatalogue = async () => {
    setLoading(true);
    setCatalogueError(false);
    try {
      const offerId = booking.selectedOutboundOffer?.offerId ?? '';
      const sessionId = booking.outboundSession?.sessionId ?? '';
      const res = await httpGet<AncillaryOption[]>(`/sessions/${sessionId}/ancillary-options?offer_id=${offerId}`, 'booking');
      const options = unwrap(res);
      setAncillaryOptions(options);
      setHasMeals(options.some(o => o.category === 'meal'));
      setHasBaggage(options.some(o => o.category === 'baggage'));

      if (booking.tripType === 'round' && booking.returnSession && booking.selectedReturnOffer) {
        const res2 = await httpGet<AncillaryOption[]>(`/sessions/${booking.returnSession.sessionId}/ancillary-options?offer_id=${booking.selectedReturnOffer.offerId}`, 'booking');
        setReturnAncillaryOptions(unwrap(res2));
      }
      setLoading(false);
    } catch {
      setCatalogueError(true);
      setLoading(false);
    }
  };

  useEffect(() => { loadCatalogue(); }, []);

  const handleContinue = () => { navigate('review-detail'); };

  return (
    <div className="screen">
      <div className="header-row">
        <IconButton icon="back" onClick={() => navigate('enter-passengers')} ariaLabel={t('common.back.aria')} />
        <Text variant="title-2" as="h1">{t('services.title')}</Text>
        <div style={{ width: 40 }} />
      </div>

      <Text variant="footnote" ariaLabel={t('services.step.aria')}>{t('services.step.aria')}</Text>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-012)' }}>
        <ServiceTile label={t('services.seat')} enabled={true} onClick={() => navigate('seat-map')} ariaLabel={t('services.seat.aria')} />
        <ServiceTile label={t('services.meal')} enabled={hasMeals && !loading} onClick={() => navigate('meal-selection')} ariaLabel={t('services.meal.aria')} />
        <ServiceTile label={t('services.baggage')} enabled={hasBaggage && !loading} onClick={() => navigate('baggage-selection')} ariaLabel={t('services.baggage.aria')} />
        {comingSoonServices.map(svc => (
          <ServiceTile key={svc.id} label={t(svc.labelKey)} enabled={false} badge={t(svc.badge)} ariaLabel={`${t(svc.labelKey)} - ${t(svc.badge)}`} />
        ))}
      </div>

      <AlertNote visible={catalogueError} variant="error" actionLabel={t('services.catalogueError.retry')} onAction={loadCatalogue}>
        {t('services.catalogueError')}
      </AlertNote>

      <Button variant="gradient" onClick={handleContinue} ariaLabel={t('services.continue.aria')}>
        {t('services.continue')}
      </Button>
    </div>
  );
}

function ServiceTile({ label, enabled, badge, onClick, ariaLabel }: { label: string; enabled: boolean; badge?: string; onClick?: () => void; ariaLabel?: string }) {
  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '16px 8px', borderRadius: 'var(--radius-012)', border: '1px solid var(--line-normal)',
        background: enabled ? 'var(--common-100)' : 'var(--interaction-disable)',
        opacity: enabled ? 1 : 0.6, position: 'relative', minHeight: 80, gap: 'var(--gap-004)',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'center' }}>{label}</span>
      {badge && <span style={{ fontSize: 10, color: 'var(--status-cautionary)', fontWeight: 600 }}>{badge}</span>}
    </button>
  );
}
