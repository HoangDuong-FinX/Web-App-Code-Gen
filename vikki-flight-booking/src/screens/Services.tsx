import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import type { AppState, MealOption, BaggageOption, SeatOption, SeatSelection } from '../types/state';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { AlertNote } from '../components/ui/AlertNote';
import { PriceHoldCountdown } from '../components/ui/PriceHoldCountdown';
import { ServiceTile } from '../components/ui/ServiceTile';
import { SeatMapModal } from '../components/modals/SeatMapModal';
import { MealPickerModal } from '../components/modals/MealPickerModal';
import { BaggagePickerModal } from '../components/modals/BaggagePickerModal';
import {
  fetchAncillaryCatalog,
  submitAncillarySelections,
  submitSeatSelections,
} from '../fixtures/ancillary';
import { fetchSeatMap } from '../fixtures/seatMap';

interface ServicesProps {
  state: AppState;
  onNavigate: (screen: AppState['screen']) => void;
  onUpdateState: (updates: Partial<AppState>) => void;
}

export function ServicesScreen({ state, onNavigate, onUpdateState }: ServicesProps) {
  const session = state.outboundSession;
  const [holdExpired, setHoldExpired] = useState(false);
  const [meals, setMeals] = useState<MealOption[]>([]);
  const [baggage, setBaggage] = useState<BaggageOption[]>([]);
  const [seats, setSeats] = useState<SeatOption[]>([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [catalogError, setCatalogError] = useState(false);
  const [seatMapError, setSeatMapError] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal visibility
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [showMeals, setShowMeals] = useState(false);
  const [showBaggage, setShowBaggage] = useState(false);

  // Selections (local, committed to state on submit)
  const [mealQty, setMealQty] = useState<Record<string, number>>({});
  const [baggageId, setBaggageId] = useState<string | null>(null);
  const [seatSelections, setSeatSelections] = useState<SeatSelection[]>([]);

  useEffect(() => {
    if (!session) { onNavigate('search'); return; }
    fetchAncillaryCatalog()
      .then(catalog => {
        setMeals(catalog.meals);
        setBaggage(catalog.baggage);
        setCatalogLoaded(true);
      })
      .catch(() => setCatalogError(true));
  }, [session, onNavigate]);

  const handleOpenSeatMap = async () => {
    setSeatMapError(false);
    try {
      const seatData = await fetchSeatMap();
      setSeats(seatData);
      setShowSeatMap(true);
    } catch {
      setSeatMapError(true);
    }
  };

  const handleSubmit = async () => {
    if (holdExpired) return;
    setSubmitError(false);
    setSubmitting(true);
    try {
      await submitAncillarySelections();
      await submitSeatSelections();
      onUpdateState({
        services: {
          mealSelections: mealQty,
          baggageSelectionId: baggageId,
          seatSelections,
        },
      });
      onNavigate('payment');
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) return null;

  const mealsEnabled = catalogLoaded && meals.length > 0;
  const baggageEnabled = catalogLoaded && baggage.length > 0;

  const selectedSeatNumbers = seatSelections.map(s => s.seatNumber);

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-[28px] font-bold leading-[1.35] font-display">{t('services.title')}</h1>

      <PriceHoldCountdown
        expiresAt={session.expiresAt}
        onExpired={() => setHoldExpired(true)}
        data-testid="price-hold-countdown"
      />

      {holdExpired && (
        <AlertNote tone="error" role="alert">
          {t('services.holdExpired')}
          <Button variant="ghost" onClick={() => onNavigate('search')} className="ml-2 !py-0 !px-1 text-[12px]">
            {t('services.searchAgain')}
          </Button>
        </AlertNote>
      )}

      {catalogError && (
        <AlertNote tone="warning" role="alert">
          {t('services.loadError')}
        </AlertNote>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-[17px] font-semibold leading-[1.4]">{t('services.sectionTitle')}</h2>

        <div className="grid grid-cols-3 gap-3">
          <ServiceTile
            label={t('services.tile.seat')}
            icon="airplane-seat"
            enabled
            aria-label={t('services.tile.seat')}
            data-testid="service-tile-seat"
            selected={seatSelections.length > 0}
            onClick={handleOpenSeatMap}
          />
          <ServiceTile
            label={t('services.tile.meals')}
            icon="utensils"
            enabled={mealsEnabled}
            aria-label={t('services.tile.meals')}
            data-testid="service-tile-meals"
            selected={Object.values(mealQty).some(q => q > 0)}
            onClick={() => setShowMeals(true)}
          />
          <ServiceTile
            label={t('services.tile.baggage')}
            icon="luggage"
            enabled={baggageEnabled}
            aria-label={t('services.tile.baggage')}
            data-testid="service-tile-baggage"
            selected={!!baggageId}
            onClick={() => setShowBaggage(true)}
          />
          {([
            { key: 'insurance', icon: 'shield', labelKey: 'services.tile.insurance' },
            { key: 'duty-free', icon: 'shopping-bag', labelKey: 'services.tile.dutyFree' },
            { key: 'souvenirs', icon: 'gift', labelKey: 'services.tile.souvenirs' },
            { key: 'hotel', icon: 'building', labelKey: 'services.tile.hotel' },
            { key: 'activities', icon: 'activity', labelKey: 'services.tile.activities' },
            { key: 'transfers', icon: 'car', labelKey: 'services.tile.transfers' },
          ] as const).map(tile => (
            <ServiceTile
              key={tile.key}
              label={t(tile.labelKey)}
              icon={tile.icon}
              enabled={false}
              badge={t('services.comingSoon')}
              aria-label={`${t(tile.labelKey)} - ${t('services.comingSoon')}`}
              data-testid={`service-tile-${tile.key}`}
            />
          ))}
        </div>
      </div>

      {seatMapError && (
        <AlertNote tone="error" role="alert">
          {t('services.seatMapError')}
        </AlertNote>
      )}

      <AlertNote tone="error" visible={submitError} role="alert" data-testid="services-submit-error">
        {t('services.submit.error')}
      </AlertNote>

      <Button
        variant="primary"
        fullWidth
        aria-label={t('services.continue.aria')}
        data-testid="submit-button"
        onClick={handleSubmit}
        disabled={holdExpired || submitting}
        loading={submitting}
      >
        {t('services.continue')}
      </Button>

      {/* Modals */}
      <SeatMapModal
        open={showSeatMap}
        seats={seats}
        selectedSeats={selectedSeatNumbers}
        passengers={state.passengers}
        onConfirm={newSelections => {
          setSeatSelections(newSelections);
          setShowSeatMap(false);
        }}
        onClose={() => setShowSeatMap(false)}
      />

      <MealPickerModal
        open={showMeals}
        meals={meals}
        quantities={mealQty}
        onConfirm={qty => {
          setMealQty(qty);
          setShowMeals(false);
        }}
        onClose={() => setShowMeals(false)}
      />

      <BaggagePickerModal
        open={showBaggage}
        baggageOptions={baggage}
        selectedId={baggageId}
        onConfirm={id => {
          setBaggageId(id);
          setShowBaggage(false);
        }}
        onClose={() => setShowBaggage(false)}
      />
    </div>
  );
}
