import React, { useEffect, useState } from 'react';
import { useAppContext, isHoldExpired, formatVND } from '../store';
import { t } from '../i18n/vi';
import {
  Text, Button, ServiceTile, AlertNote, SegmentedControl, Divider,
} from '../components/ui';
import { PriceHoldCountdown } from '../components/PriceHoldCountdown';
import { Modal } from '../components/Modal';
import { SeatMap } from '../components/ui';
import {
  fetchAncillaryCatalog, fetchSeatMap,
  submitAncillarySelections, submitSeatSelections,
} from '../fixtures/bookingService';
import type { SeatInfo, MealSelection, BaggageSelection, SeatSelection } from '../types';

export function ServicesScreen() {
  const { state, setState, navigate } = useAppContext();
  const {
    expiresAt,
    outboundSessionId,
    returnSessionId,
    selectedOutboundOffer,
    selectedReturnOffer,
    searchCriteria,
    passengers,
    outboundAncillaryCatalog,
    returnAncillaryCatalog,
    outboundMeals,
    outboundBaggage,
    outboundSeats,
    returnMeals,
    returnBaggage,
    returnSeats,
    seatMap,
  } = state;

  const [holdExpired, setHoldExpired] = useState(isHoldExpired(expiresAt));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [baggageModalOpen, setBaggageModalOpen] = useState(false);
  const [seatMapLoading, setSeatMapLoading] = useState(false);
  const [seatMapError, setSeatMapError] = useState<string | null>(null);
  const [activeLeg, setActiveLeg] = useState<'outbound' | 'return'>('outbound');
  const [activePaxIndex, setActivePaxIndex] = useState(1);

  // Local draft selections (committed to state on confirm)
  const [draftMeals, setDraftMeals] = useState<MealSelection[]>(outboundMeals);
  const [draftBaggage, setDraftBaggage] = useState<BaggageSelection | null>(outboundBaggage);
  const [draftSeats, setDraftSeats] = useState<Record<number, string>>(
    Object.fromEntries(outboundSeats.map(s => [s.passengerIndex, s.seatNumber]))
  );
  const [localSeatMap, setLocalSeatMap] = useState<SeatInfo[]>(seatMap);

  useEffect(() => {
    const interval = setInterval(() => setHoldExpired(isHoldExpired(expiresAt)), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // Fetch ancillary catalog on mount
  useEffect(() => {
    if (outboundAncillaryCatalog) return;
    if (!outboundSessionId) return;
    fetchAncillaryCatalog(outboundSessionId)
      .then(catalog => {
        setState(s => ({ ...s, outboundAncillaryCatalog: catalog }));
      })
      .catch(() => setLoadError(t('services.loadError')));

    if (searchCriteria.tripType === 'round-trip' && returnSessionId && !returnAncillaryCatalog) {
      fetchAncillaryCatalog(returnSessionId)
        .then(catalog => setState(s => ({ ...s, returnAncillaryCatalog: catalog })))
        .catch(() => {});
    }
  }, [outboundSessionId, outboundAncillaryCatalog]);

  const openSeatModal = async (leg: 'outbound' | 'return') => {
    setActiveLeg(leg);
    setSeatModalOpen(true);
    setSeatMapError(null);
    setSeatMapLoading(true);
    const sessionId = leg === 'outbound' ? outboundSessionId : returnSessionId;
    const currentSeats = leg === 'outbound' ? outboundSeats : returnSeats;
    setDraftSeats(Object.fromEntries(currentSeats.map(s => [s.passengerIndex, s.seatNumber])));
    try {
      const seats = await fetchSeatMap(sessionId!);
      setLocalSeatMap(seats);
      setState(s => ({ ...s, seatMap: seats }));
    } catch {
      setSeatMapError(t('services.seatMapError'));
    } finally {
      setSeatMapLoading(false);
    }
  };

  const openMealModal = (leg: 'outbound' | 'return') => {
    setActiveLeg(leg);
    const currentMeals = leg === 'outbound' ? outboundMeals : returnMeals;
    setDraftMeals([...currentMeals]);
    setMealModalOpen(true);
  };

  const openBaggageModal = (leg: 'outbound' | 'return') => {
    setActiveLeg(leg);
    const currentBaggage = leg === 'outbound' ? outboundBaggage : returnBaggage;
    setDraftBaggage(currentBaggage);
    setBaggageModalOpen(true);
  };

  const confirmMeals = () => {
    if (activeLeg === 'outbound') {
      setState(s => ({ ...s, outboundMeals: draftMeals }));
    } else {
      setState(s => ({ ...s, returnMeals: draftMeals }));
    }
    setMealModalOpen(false);
  };

  const confirmBaggage = () => {
    if (activeLeg === 'outbound') {
      setState(s => ({ ...s, outboundBaggage: draftBaggage }));
    } else {
      setState(s => ({ ...s, returnBaggage: draftBaggage }));
    }
    setBaggageModalOpen(false);
  };

  const confirmSeats = () => {
    const catalog = activeLeg === 'outbound' ? outboundAncillaryCatalog : returnAncillaryCatalog;
    const selections: SeatSelection[] = Object.entries(draftSeats).map(([idx, seatNum]) => {
      const seat = localSeatMap.find(s => s.seatNumber === seatNum);
      return {
        passengerIndex: parseInt(idx, 10),
        seatNumber: seatNum,
        priceAmount: seat?.priceAmount ?? 0,
      };
    });
    if (activeLeg === 'outbound') {
      setState(s => ({ ...s, outboundSeats: selections }));
    } else {
      setState(s => ({ ...s, returnSeats: selections }));
    }
    setSeatModalOpen(false);
  };

  const handleSeatSelect = (seat: SeatInfo, paxIdx: number) => {
    if (!seat.available || seat.priceAmount === null || seat.priceAmount <= 0) return;
    setDraftSeats(prev => {
      const next = { ...prev };
      // If already selected for this pax, deselect
      if (next[paxIdx] === seat.seatNumber) {
        delete next[paxIdx];
      } else {
        next[paxIdx] = seat.seatNumber;
      }
      return next;
    });
  };

  const handleContinue = async () => {
    if (holdExpired || loading) return;
    setSaveError(null);
    setLoading(true);

    try {
      // Build ancillary selections (BR-09: quantity as array repetition)
      const buildAncillaryPayload = (meals: MealSelection[], baggage: BaggageSelection | null) => {
        const items: Array<{ passengerId: string; optionId: string }> = [];
        for (const pax of passengers) {
          if (!pax.passengerId) continue;
          for (const meal of meals) {
            for (let q = 0; q < meal.quantity; q++) {
              items.push({ passengerId: pax.passengerId, optionId: meal.optionId });
            }
          }
          if (baggage) {
            items.push({ passengerId: pax.passengerId, optionId: baggage.optionId });
          }
        }
        return items;
      };

      const buildSeatPayload = (seats: SeatSelection[]) =>
        seats.map(s => ({ passengerIndex: s.passengerIndex, seatNumber: s.seatNumber }));

      const calls: Promise<void>[] = [];

      if (outboundSessionId) {
        calls.push(submitAncillarySelections(outboundSessionId, buildAncillaryPayload(outboundMeals, outboundBaggage)));
        calls.push(submitSeatSelections(outboundSessionId, buildSeatPayload(outboundSeats)));
      }

      if (searchCriteria.tripType === 'round-trip' && returnSessionId) {
        calls.push(submitAncillarySelections(returnSessionId, buildAncillaryPayload(returnMeals, returnBaggage)));
        calls.push(submitSeatSelections(returnSessionId, buildSeatPayload(returnSeats)));
      }

      await Promise.all(calls);
      setState(s => ({ ...s, currentScreen: 'payment' }));
    } catch {
      setSaveError(t('services.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const catalog = outboundAncillaryCatalog;
  const mealsEnabled = (catalog?.meals?.length ?? 0) > 0;
  const baggageEnabled = (catalog?.baggage?.length ?? 0) > 0;
  const isRoundTrip = searchCriteria.tripType === 'round-trip';

  const legOptions = isRoundTrip
    ? [
        { label: `${t('common.outbound')} (${searchCriteria.origin} \u2192 ${searchCriteria.destination})`, value: 'outbound' },
        { label: `${t('common.return')} (${searchCriteria.destination} \u2192 ${searchCriteria.origin})`, value: 'return' },
      ]
    : [{ label: `${t('common.outbound')} (${searchCriteria.origin} \u2192 ${searchCriteria.destination})`, value: 'outbound' }];

  const paxOptions = passengers.map((p, i) => ({
    label: `${t('passengers.guest')} ${i + 1}`,
    value: String(i + 1),
  }));

  return (
    <div className="screen services-screen">
      <div className="screen__content">
        <h1 className="text-title-1">{t('services.title')}</h1>

        <PriceHoldCountdown expiresAt={expiresAt} data-testid="price-hold-countdown" />

        {holdExpired && (
          <AlertNote visible tone="warning">
            {t('services.holdExpired')}
            <button type="button" className="btn btn-ghost" onClick={() => navigate('search')}>
              {t('search.searchAgain')}
            </button>
          </AlertNote>
        )}

        <AlertNote visible={!!loadError} tone="error">
          {loadError}
        </AlertNote>

        <div className="stack stack--col gap-12">
          <Text variant="headline" semantic="h2">{t('services.flightServices')}</Text>
          <div className="service-grid">
            <ServiceTile
              label={t('services.seat.label')}
              icon="airplane-seat"
              enabled
              ariaLabel={t('services.seat.ariaLabel')}
              selected={outboundSeats.length > 0}
              onClick={() => openSeatModal('outbound')}
              data-testid="service-tile-seat"
            />
            <ServiceTile
              label={t('services.meals.label')}
              icon="utensils"
              enabled={mealsEnabled}
              ariaLabel={t('services.meals.ariaLabel')}
              selected={outboundMeals.length > 0}
              onClick={() => openMealModal('outbound')}
              data-testid="service-tile-meals"
            />
            <ServiceTile
              label={t('services.baggage.label')}
              icon="luggage"
              enabled={baggageEnabled}
              ariaLabel={t('services.baggage.ariaLabel')}
              selected={!!outboundBaggage}
              onClick={() => openBaggageModal('outbound')}
              data-testid="service-tile-baggage"
            />
            <ServiceTile label={t('services.insurance.label')} icon="shield" enabled={false} badge={t('services.comingSoon')} ariaLabel={t('services.insurance.ariaLabel')} data-testid="service-tile-insurance" />
            <ServiceTile label={t('services.dutyFree.label')} icon="shopping-bag" enabled={false} badge={t('services.comingSoon')} ariaLabel={t('services.dutyFree.ariaLabel')} data-testid="service-tile-duty-free" />
            <ServiceTile label={t('services.souvenirs.label')} icon="gift" enabled={false} badge={t('services.comingSoon')} ariaLabel={t('services.souvenirs.ariaLabel')} data-testid="service-tile-souvenirs" />
            <ServiceTile label={t('services.hotel.label')} icon="building" enabled={false} badge={t('services.comingSoon')} ariaLabel={t('services.hotel.ariaLabel')} data-testid="service-tile-hotel" />
            <ServiceTile label={t('services.activities.label')} icon="activity" enabled={false} badge={t('services.comingSoon')} ariaLabel={t('services.activities.ariaLabel')} data-testid="service-tile-activities" />
            <ServiceTile label={t('services.transfers.label')} icon="car" enabled={false} badge={t('services.comingSoon')} ariaLabel={t('services.transfers.ariaLabel')} data-testid="service-tile-transfers" />
          </div>
        </div>

        <AlertNote visible={!!saveError} tone="error" data-testid="services-submit-error">
          {saveError}
        </AlertNote>

        <button
          type="button"
          className="btn btn-primary"
          aria-label={t('services.continue.ariaLabel')}
          data-testid="submit-button"
          disabled={holdExpired || loading}
          onClick={handleContinue}
        >
          {loading ? t('common.loading') : t('services.continue')}
        </button>
      </div>

      {/* Seat map modal */}
      <Modal
        isOpen={seatModalOpen}
        title={t('seatMap.title')}
        onClose={() => setSeatModalOpen(false)}
        data-testid="seat-map-modal"
      >
        <div className="stack stack--col gap-12 p-16">
          {isRoundTrip && (
            <SegmentedControl
              options={legOptions}
              value={activeLeg}
              onChange={v => openSeatModal(v as 'outbound' | 'return')}
              ariaLabel="Ch\u1ECDn chuy\u1EBFn"
              data-testid="leg-tab"
            />
          )}
          <SegmentedControl
            options={paxOptions}
            value={String(activePaxIndex)}
            onChange={v => setActivePaxIndex(parseInt(v, 10))}
            ariaLabel="Ch\u1ECDn h\u00E0nh kh\u00E1ch"
            data-testid="passenger-selector-tab"
          />
          <Text variant="body-semibold">{t('seatMap.seatTypes')}</Text>
          {seatMapLoading && <div>{t('common.loading')}</div>}
          <AlertNote visible={!!seatMapError} tone="error">{seatMapError}</AlertNote>
          {!seatMapLoading && !seatMapError && (
            <SeatMap
              seats={localSeatMap}
              selectedSeats={draftSeats}
              activePassengerIndex={activePaxIndex}
              onSelectSeat={handleSeatSelect}
              data-testid="seat-map-grid"
            />
          )}
          <div className="row-between">
            <Text variant="body">{t('services.total')}</Text>
            <Text variant="body-semibold">
              {formatVND(Object.entries(draftSeats).reduce((sum, [, sn]) => {
                const seat = localSeatMap.find(s => s.seatNumber === sn);
                return sum + (seat?.priceAmount ?? 0);
              }, 0))}
            </Text>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            aria-label={t('seatMap.confirm.ariaLabel')}
            data-testid="confirm-button"
            onClick={confirmSeats}
          >
            {t('seatMap.confirm')}
          </button>
        </div>
      </Modal>

      {/* Meal picker modal */}
      <Modal
        isOpen={mealModalOpen}
        title={t('mealPicker.title')}
        onClose={() => setMealModalOpen(false)}
        data-testid="meal-picker-modal"
      >
        <div className="stack stack--col gap-12 p-16">
          {isRoundTrip && (
            <SegmentedControl
              options={legOptions}
              value={activeLeg}
              onChange={v => openMealModal(v as 'outbound' | 'return')}
              ariaLabel="Ch\u1ECDn chuy\u1EBFn"
              data-testid="leg-tab"
            />
          )}
          {(activeLeg === 'outbound' ? outboundAncillaryCatalog : returnAncillaryCatalog)?.meals.map(meal => {
            const sel = draftMeals.find(m => m.optionId === meal.optionId);
            const qty = sel?.quantity ?? 0;
            return (
              <div key={meal.optionId} className="meal-option">
                <Text variant="body-semibold">{meal.name}</Text>
                <Text variant="body">{formatVND(meal.priceAmount)}</Text>
                <div className="pax-counter">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    aria-label={t('mealPicker.decrement.ariaLabel')}
                    data-testid="decrement-button"
                    disabled={qty === 0}
                    onClick={() => setDraftMeals(ms => {
                      const next = ms.filter(m => m.optionId !== meal.optionId);
                      if (qty > 1) next.push({ optionId: meal.optionId, quantity: qty - 1 });
                      return next;
                    })}
                  >
                    \u2212
                  </button>
                  <Text variant="body">{qty}</Text>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    aria-label={t('mealPicker.increment.ariaLabel')}
                    data-testid="increment-button"
                    onClick={() => setDraftMeals(ms => {
                      const next = ms.filter(m => m.optionId !== meal.optionId);
                      next.push({ optionId: meal.optionId, quantity: qty + 1 });
                      return next;
                    })}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
          <div className="row-between">
            <Text variant="body">{t('services.total')}</Text>
            <Text variant="body-semibold">
              {formatVND(draftMeals.reduce((sum, m) => {
                const meal = (activeLeg === 'outbound' ? outboundAncillaryCatalog : returnAncillaryCatalog)?.meals.find(x => x.optionId === m.optionId);
                return sum + (meal?.priceAmount ?? 0) * m.quantity;
              }, 0))}
            </Text>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            aria-label={t('mealPicker.confirm.ariaLabel')}
            data-testid="confirm-button"
            onClick={confirmMeals}
          >
            {t('mealPicker.confirm')}
          </button>
        </div>
      </Modal>

      {/* Baggage picker modal */}
      <Modal
        isOpen={baggageModalOpen}
        title={t('baggagePicker.title')}
        onClose={() => setBaggageModalOpen(false)}
        data-testid="baggage-picker-modal"
      >
        <div className="stack stack--col gap-12 p-16">
          {isRoundTrip && (
            <SegmentedControl
              options={legOptions}
              value={activeLeg}
              onChange={v => openBaggageModal(v as 'outbound' | 'return')}
              ariaLabel="Ch\u1ECDn chuy\u1EBFn"
              data-testid="leg-tab"
            />
          )}
          <Text variant="body">{t('baggagePicker.oversizeNote')}</Text>
          {/* No-extra option */}
          <label className="baggage-option">
            <input
              type="radio"
              name="baggage"
              checked={draftBaggage === null}
              onChange={() => setDraftBaggage(null)}
              aria-label={t('baggagePicker.noExtra.ariaLabel')}
              data-testid="no-bag-selection"
            />
            <Text variant="body-semibold">{t('baggagePicker.noExtra')}</Text>
          </label>
          {(activeLeg === 'outbound' ? outboundAncillaryCatalog : returnAncillaryCatalog)?.baggage.map(bag => (
            <label key={bag.optionId} className="baggage-option">
              <input
                type="radio"
                name="baggage"
                checked={draftBaggage?.optionId === bag.optionId}
                onChange={() => setDraftBaggage({ optionId: bag.optionId })}
                aria-label={`Ch\u1ECDn ${bag.name}`}
                data-testid="baggage-selection"
              />
              <Text variant="body-semibold">{bag.name}</Text>
              <Text variant="body">{formatVND(bag.priceAmount)}</Text>
            </label>
          ))}
          <div className="row-between">
            <Text variant="body">{t('services.total')}</Text>
            <Text variant="body-semibold">
              {formatVND(draftBaggage
                ? (activeLeg === 'outbound' ? outboundAncillaryCatalog : returnAncillaryCatalog)?.baggage.find(b => b.optionId === draftBaggage.optionId)?.priceAmount ?? 0
                : 0
              )}
            </Text>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            aria-label={t('baggagePicker.confirm.ariaLabel')}
            data-testid="confirm-button"
            onClick={confirmBaggage}
          >
            {t('baggagePicker.confirm')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
