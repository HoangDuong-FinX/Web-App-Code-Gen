import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { AlertNote } from '../components/AlertNote';
import { PriceHoldCountdown } from '../components/PriceHoldCountdown';
import { HoldExpiredNote } from '../components/HoldExpiredNote';
import { ServiceTile } from '../components/ServiceTile';
import { SeatMapModal } from '../modals/SeatMapModal';
import { MealPickerModal } from '../modals/MealPickerModal';
import { BaggagePickerModal } from '../modals/BaggagePickerModal';
import { t } from '../i18n';
import { isExpired } from '../utils/date';
import {
  fixtureLoadAncillaryCatalog,
  fixtureSubmitAncillarySelections,
  fixtureSubmitSeatSelections,
  type MealOption,
  type BaggageOption,
} from '../fixtures/ancillary';
import type { AppState, AppAction, ScreenId, ServicesData, MealSelection, BaggageSelection, SeatSelection } from '../types/state';

interface ServicesScreenProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (s: ScreenId) => void;
}

type ServiceModal = 'seat' | 'meals' | 'baggage' | null;

export function ServicesScreen({ state, dispatch, navigate }: ServicesScreenProps): React.ReactElement {
  const [holdExpired, setHoldExpired] = useState(isExpired(state.expiresAt));
  const [modal, setModal] = useState<ServiceModal>(null);
  const [meals, setMeals] = useState<MealOption[]>([]);
  const [baggage, setBaggage] = useState<BaggageOption[]>([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [catalogError, setCatalogError] = useState('');

  // Load ancillary catalog on mount
  useEffect(() => {
    if (!state.sessionId) return;
    fixtureLoadAncillaryCatalog(state.sessionId)
      .then(catalog => {
        setMeals(catalog.meals);
        setBaggage(catalog.baggage);
        setCatalogLoaded(true);
      })
      .catch(() => {
        setCatalogError(t('services.loadError'));
        setCatalogLoaded(true);
      });
  }, [state.sessionId]);

  const mealsEnabled = catalogLoaded && !catalogError && meals.length > 0;
  const baggageEnabled = catalogLoaded && !catalogError && baggage.length > 0;

  const handleSubmit = useCallback(async () => {
    if (holdExpired) return;
    dispatch({ type: 'SET_SUBMITTING_SERVICES', value: true });

    try {
      const svc = state.outboundServices;
      // Build ancillary selections (BR-09: quantity as array repetition)
      const ancillarySelections: Array<{ passengerId: string; optionId: string }> = [];
      state.passengers.forEach(pax => {
        svc.meals.forEach(m => {
          for (let i = 0; i < m.quantity; i++) {
            ancillarySelections.push({ passengerId: pax.passengerId, optionId: m.optionId });
          }
        });
        if (svc.baggage) {
          ancillarySelections.push({ passengerId: pax.passengerId, optionId: svc.baggage.optionId });
        }
      });

      const seatSelections = svc.seats.map(s => ({
        passengerIndex: s.passengerIndex,
        seatNumber: s.seatNumber,
      }));

      // Submit outbound
      await fixtureSubmitAncillarySelections(state.sessionId, ancillarySelections);
      await fixtureSubmitSeatSelections(state.sessionId, seatSelections);

      // If round-trip, submit return leg too
      if (state.tripType === 'round-trip') {
        const retSvc = state.returnServices;
        const retAncillary: Array<{ passengerId: string; optionId: string }> = [];
        state.passengers.forEach(pax => {
          retSvc.meals.forEach(m => {
            for (let i = 0; i < m.quantity; i++) {
              retAncillary.push({ passengerId: pax.passengerId, optionId: m.optionId });
            }
          });
          if (retSvc.baggage) {
            retAncillary.push({ passengerId: pax.passengerId, optionId: retSvc.baggage.optionId });
          }
        });
        const retSeats = retSvc.seats.map(s => ({ passengerIndex: s.passengerIndex, seatNumber: s.seatNumber }));
        await fixtureSubmitAncillarySelections(state.sessionId, retAncillary);
        await fixtureSubmitSeatSelections(state.sessionId, retSeats);
      }

      dispatch({ type: 'SET_SUBMITTING_SERVICES', value: false });
      navigate('payment');
    } catch {
      dispatch({ type: 'SET_SERVICES_ERROR', error: t('services.error') });
    }
  }, [holdExpired, state, dispatch, navigate]);

  function updateOutboundServices(partial: Partial<ServicesData>) {
    dispatch({ type: 'SET_OUTBOUND_SERVICES', services: { ...state.outboundServices, ...partial } });
  }

  function handleMealConfirm(selections: MealSelection[]) {
    updateOutboundServices({ meals: selections });
    setModal(null);
  }

  function handleBaggageConfirm(selection: BaggageSelection | null) {
    updateOutboundServices({ baggage: selection });
    setModal(null);
  }

  function handleSeatConfirm(seats: SeatSelection[]) {
    updateOutboundServices({ seats });
    setModal(null);
  }

  const serviceTiles = [
    {
      id: 'seat',
      label: t('services.tile.seat'),
      icon: 'airplane-seat',
      enabled: true,
      ariaLabel: t('services.tile.seat.ariaLabel'),
      testId: 'service-tile-seat',
      selected: state.outboundServices.seats.length > 0,
      onClick: () => setModal('seat'),
    },
    {
      id: 'meals',
      label: t('services.tile.meals'),
      icon: 'utensils',
      enabled: mealsEnabled,
      ariaLabel: t('services.tile.meals.ariaLabel'),
      testId: 'service-tile-meals',
      selected: state.outboundServices.meals.some(m => m.quantity > 0),
      onClick: () => setModal('meals'),
    },
    {
      id: 'baggage',
      label: t('services.tile.baggage'),
      icon: 'luggage',
      enabled: baggageEnabled,
      ariaLabel: t('services.tile.baggage.ariaLabel'),
      testId: 'service-tile-baggage',
      selected: !!state.outboundServices.baggage,
      onClick: () => setModal('baggage'),
    },
    { id: 'insurance', label: t('services.tile.insurance'), icon: 'shield', enabled: false, badge: t('services.comingSoon'), ariaLabel: t('services.tile.insurance.ariaLabel'), testId: 'service-tile-insurance', onClick: undefined },
    { id: 'duty-free', label: t('services.tile.dutyFree'), icon: 'shopping-bag', enabled: false, badge: t('services.comingSoon'), ariaLabel: t('services.tile.dutyFree.ariaLabel'), testId: 'service-tile-duty-free', onClick: undefined },
    { id: 'souvenirs', label: t('services.tile.souvenirs'), icon: 'gift', enabled: false, badge: t('services.comingSoon'), ariaLabel: t('services.tile.souvenirs.ariaLabel'), testId: 'service-tile-souvenirs', onClick: undefined },
    { id: 'hotel', label: t('services.tile.hotel'), icon: 'building', enabled: false, badge: t('services.comingSoon'), ariaLabel: t('services.tile.hotel.ariaLabel'), testId: 'service-tile-hotel', onClick: undefined },
    { id: 'activities', label: t('services.tile.activities'), icon: 'activity', enabled: false, badge: t('services.comingSoon'), ariaLabel: t('services.tile.activities.ariaLabel'), testId: 'service-tile-activities', onClick: undefined },
    { id: 'transfers', label: t('services.tile.transfers'), icon: 'car', enabled: false, badge: t('services.comingSoon'), ariaLabel: t('services.tile.transfers.ariaLabel'), testId: 'service-tile-transfers', onClick: undefined },
  ];

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text variant="title-1" semantic="h1">{t('services.title')}</Text>

      {state.expiresAt && (
        <PriceHoldCountdown
          expiresAt={state.expiresAt}
          onExpired={() => setHoldExpired(true)}
          data-testid="price-hold-countdown"
        />
      )}

      {holdExpired && <HoldExpiredNote onSearchAgain={() => navigate('search')} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Text variant="headline" semantic="h2">{t('services.flightServices')}</Text>

        {catalogError && (
          <AlertNote tone="critical" visible role="alert">
            {catalogError}
          </AlertNote>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {serviceTiles.map(tile => (
            <ServiceTile
              key={tile.id}
              label={tile.label}
              icon={tile.icon}
              enabled={tile.enabled}
              badge={'badge' in tile ? tile.badge : undefined}
              ariaLabel={tile.ariaLabel}
              data-testid={tile.testId}
              onClick={tile.onClick}
              selected={'selected' in tile ? tile.selected : false}
            />
          ))}
        </div>
      </div>

      {state.servicesError && (
        <AlertNote tone="critical" visible role="alert" data-testid="services-submit-error">
          {state.servicesError}
        </AlertNote>
      )}

      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={holdExpired || state.isSubmittingServices}
        ariaLabel={t('services.submit.ariaLabel')}
        data-testid="submit-button"
        fullWidth
      >
        {state.isSubmittingServices ? t('common.loading') : t('services.submit')}
      </Button>

      {modal === 'seat' && (
        <SeatMapModal
          sessionId={state.sessionId}
          passengers={state.passengers}
          tripType={state.tripType}
          origin={state.selectedOutboundOffer?.origin ?? ''}
          destination={state.selectedOutboundOffer?.destination ?? ''}
          existingSeats={state.outboundServices.seats}
          onConfirm={handleSeatConfirm}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'meals' && (
        <MealPickerModal
          mealOptions={meals}
          existingSelections={state.outboundServices.meals}
          origin={state.selectedOutboundOffer?.origin ?? ''}
          destination={state.selectedOutboundOffer?.destination ?? ''}
          onConfirm={handleMealConfirm}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'baggage' && (
        <BaggagePickerModal
          baggageOptions={baggage}
          existingSelection={state.outboundServices.baggage}
          origin={state.selectedOutboundOffer?.origin ?? ''}
          destination={state.selectedOutboundOffer?.destination ?? ''}
          onConfirm={handleBaggageConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
