import React, { useEffect, useState } from 'react';
import { vi } from '../i18n/vi';
import type { AppState, AppAction, MealOption, BaggageOption, SeatOption, LegServices, MealSelection, BaggageSelection, SeatSelection } from '../types';
import { Button } from '../components/ui/Button';
import { AlertNote } from '../components/ui/AlertNote';
import { PriceHoldCountdown } from '../components/ui/PriceHoldCountdown';
import { ServiceTile } from '../components/ui/ServiceTile';
import { isHoldExpired } from '../utils/holdExpiry';
import { formatVND } from '../utils/format';
import {
  fixtureLoadAncillaryCatalog,
  fixtureLoadSeatMap,
  fixtureSubmitAncillary,
  fixtureSubmitSeats,
} from '../fixtures';
import { SeatMapModal } from '../components/modals/SeatMapModal';
import { MealPickerModal } from '../components/modals/MealPickerModal';
import { BaggagePickerModal } from '../components/modals/BaggagePickerModal';

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const ServicesScreen: React.FC<Props> = ({ state, dispatch }) => {
  const expiresAt = state.outboundSession?.expiresAt ?? new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const expired = isHoldExpired(expiresAt);

  const [mealOptions, setMealOptions] = useState<MealOption[]>([]);
  const [baggageOptions, setBaggageOptions] = useState<BaggageOption[]>([]);
  const [seatOptions, setSeatOptions] = useState<SeatOption[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const [seatMapLoading, setSeatMapLoading] = useState(false);
  const [seatMapError, setSeatMapError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showSeatMap, setShowSeatMap] = useState(false);
  const [showMeals, setShowMeals] = useState(false);
  const [showBaggage, setShowBaggage] = useState(false);

  const sessionId = state.outboundSession?.sessionId ?? 'sess_fixture';

  useEffect(() => {
    setCatalogLoading(true);
    setCatalogError(false);
    fixtureLoadAncillaryCatalog(sessionId)
      .then(({ meals, baggage }) => {
        setMealOptions(meals);
        setBaggageOptions(baggage);
      })
      .catch(() => setCatalogError(true))
      .finally(() => setCatalogLoading(false));
  }, [sessionId]);

  const handleOpenSeatMap = async () => {
    setSeatMapLoading(true);
    setSeatMapError(false);
    try {
      const seats = await fixtureLoadSeatMap(sessionId);
      setSeatOptions(seats);
      setShowSeatMap(true);
    } catch {
      setSeatMapError(true);
    } finally {
      setSeatMapLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (expired) return;
    setSubmitting(true);
    dispatch({ type: 'SET_SERVICES_ERROR', error: null });
    try {
      await fixtureSubmitAncillary(sessionId);
      await fixtureSubmitSeats(sessionId);
      // For round-trip, submit for return session too
      if (state.searchCriteria.tripType === 'round-trip' && state.returnSession) {
        await fixtureSubmitAncillary(state.returnSession.sessionId);
        await fixtureSubmitSeats(state.returnSession.sessionId);
      }
      dispatch({ type: 'NAVIGATE', screen: 'payment' });
    } catch {
      dispatch({ type: 'SET_SERVICES_ERROR', error: vi.services.saveError });
    } finally {
      setSubmitting(false);
    }
  };

  const outboundServices = state.outboundServices;
  const totalMealCost = outboundServices.meals.reduce((s, m) => s + m.priceAmount * m.quantity, 0);
  const totalBagCost = outboundServices.baggage.reduce((s, b) => s + b.priceAmount, 0);
  const totalSeatCost = outboundServices.seats.reduce((s, seat) => s + seat.priceAmount, 0);

  const mealsEnabled = !catalogLoading && !catalogError && mealOptions.length > 0;
  const baggageEnabled = !catalogLoading && !catalogError && baggageOptions.length > 0;

  const handleSaveMeals = (selections: MealSelection[]) => {
    dispatch({ type: 'SET_OUTBOUND_SERVICES', services: { ...outboundServices, meals: selections } });
    setShowMeals(false);
  };

  const handleSaveBaggage = (selections: BaggageSelection[]) => {
    dispatch({ type: 'SET_OUTBOUND_SERVICES', services: { ...outboundServices, baggage: selections } });
    setShowBaggage(false);
  };

  const handleSaveSeats = (selections: SeatSelection[]) => {
    dispatch({ type: 'SET_OUTBOUND_SERVICES', services: { ...outboundServices, seats: selections } });
    setShowSeatMap(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-[var(--text-title-1)] text-[var(--color-text-primary)]">
        {vi.services.title}
      </h1>

      <PriceHoldCountdown expiresAt={expiresAt} data-testid="price-hold-countdown" />

      {expired && (
        <AlertNote visible tone="error">
          {vi.services.holdExpired}
          <Button variant="ghost" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'search' })}>
            {vi.services.searchAgain}
          </Button>
        </AlertNote>
      )}

      {catalogError && (
        <AlertNote visible tone="warning" data-testid="services-load-error">
          {vi.services.loadError}
        </AlertNote>
      )}

      {seatMapError && (
        <AlertNote visible tone="error" data-testid="seat-map-error">
          {vi.services.seatMapError}
        </AlertNote>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-[var(--text-headline)] text-[var(--color-text-primary)]">
          {vi.services.flightServicesHeading}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <ServiceTile
            label={vi.services.seat}
            icon="airplane-seat"
            enabled={!seatMapLoading}
            ariaLabel={vi.services.seatLabel}
            data-testid="service-tile-seat"
            selected={outboundServices.seats.length > 0}
            onClick={handleOpenSeatMap}
          />
          <ServiceTile
            label={vi.services.meals}
            icon="utensils"
            enabled={mealsEnabled}
            ariaLabel={vi.services.mealsLabel}
            data-testid="service-tile-meals"
            selected={outboundServices.meals.length > 0}
            onClick={() => setShowMeals(true)}
          />
          <ServiceTile
            label={vi.services.baggage}
            icon="luggage"
            enabled={baggageEnabled}
            ariaLabel={vi.services.baggageLabel}
            data-testid="service-tile-baggage"
            selected={outboundServices.baggage.length > 0}
            onClick={() => setShowBaggage(true)}
          />
          <ServiceTile label={vi.services.insurance} icon="shield" enabled={false} badge={vi.services.comingSoon} ariaLabel={vi.services.insuranceLabel} data-testid="service-tile-insurance" />
          <ServiceTile label={vi.services.dutyFree} icon="shopping-bag" enabled={false} badge={vi.services.comingSoon} ariaLabel={vi.services.dutyFreeLabel} data-testid="service-tile-duty-free" />
          <ServiceTile label={vi.services.souvenirs} icon="gift" enabled={false} badge={vi.services.comingSoon} ariaLabel={vi.services.souvenirsLabel} data-testid="service-tile-souvenirs" />
          <ServiceTile label={vi.services.hotel} icon="building" enabled={false} badge={vi.services.comingSoon} ariaLabel={vi.services.hotelLabel} data-testid="service-tile-hotel" />
          <ServiceTile label={vi.services.activities} icon="activity" enabled={false} badge={vi.services.comingSoon} ariaLabel={vi.services.activitiesLabel} data-testid="service-tile-activities" />
          <ServiceTile label={vi.services.transfers} icon="car" enabled={false} badge={vi.services.comingSoon} ariaLabel={vi.services.transfersLabel} data-testid="service-tile-transfers" />
        </div>
      </div>

      {/* Services summary */}
      {(totalMealCost > 0 || totalBagCost > 0 || totalSeatCost > 0) && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
          <span className="text-sm text-[var(--color-text-primary)]">{vi.services.total}</span>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {formatVND(totalMealCost + totalBagCost + totalSeatCost)}
          </span>
        </div>
      )}

      {state.servicesError && (
        <AlertNote visible tone="error" data-testid="services-submit-error">
          {state.servicesError}
        </AlertNote>
      )}

      <Button
        variant="primary"
        ariaLabel={vi.services.continueLabel}
        data-testid="submit-button"
        onClick={handleSubmit}
        disabled={submitting || expired}
        fullWidth
      >
        {submitting ? vi.common.loading : vi.services.continueButton}
      </Button>

      <SeatMapModal
        open={showSeatMap}
        onClose={() => setShowSeatMap(false)}
        seats={seatOptions}
        passengers={state.passengers}
        currentSelections={outboundServices.seats}
        onConfirm={handleSaveSeats}
      />

      <MealPickerModal
        open={showMeals}
        onClose={() => setShowMeals(false)}
        meals={mealOptions}
        currentSelections={outboundServices.meals}
        onConfirm={handleSaveMeals}
      />

      <BaggagePickerModal
        open={showBaggage}
        onClose={() => setShowBaggage(false)}
        options={baggageOptions}
        currentSelections={outboundServices.baggage}
        onConfirm={handleSaveBaggage}
      />
    </div>
  );
};
