import React, { useEffect, useState } from 'react';
import { vi } from '../i18n/vi';
import type { AppState, AppAction, FlightOffer, PassengerInfo } from '../types';
import { Button } from '../components/ui/Button';
import { AlertNote } from '../components/ui/AlertNote';
import { PriceHoldCountdown } from '../components/ui/PriceHoldCountdown';
import { Divider } from '../components/ui/Divider';
import { isHoldExpired } from '../utils/holdExpiry';
import { formatVND, fixtureDailyPrice, formatDateShort } from '../utils/format';
import { fixtureSearch } from '../fixtures';

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

function groupOffersByFlight(offers: FlightOffer[]): Map<string, FlightOffer[]> {
  const map = new Map<string, FlightOffer[]>();
  for (const offer of offers) {
    const key = `${offer.flightNumber}-${offer.departureTime}`;
    const group = map.get(key) ?? [];
    group.push(offer);
    map.set(key, group);
  }
  return map;
}

function getDaysStrip(baseDate: string): string[] {
  const days: string[] = [];
  const base = new Date(baseDate + 'T00:00:00');
  for (let i = -3; i <= 3; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export const ResultsScreen: React.FC<Props> = ({ state, dispatch }) => {
  const isReturn = state.screen === 'results-return';
  const session = isReturn ? state.returnSession : state.outboundSession;
  const expiresAt = session?.expiresAt ?? new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const offers = session?.offers ?? [];
  const baseDate = isReturn
    ? (state.searchCriteria.returnDate ?? state.searchCriteria.departureDate)
    : state.searchCriteria.departureDate;

  const [dayStripPrices, setDayStripPrices] = useState<Record<string, number>>({});
  const [loadingReturn, setLoadingReturn] = useState(false);

  const days = getDaysStrip(baseDate);

  useEffect(() => {
    const prices: Record<string, number> = {};
    days.forEach((d) => {
      prices[d] = fixtureDailyPrice(d);
    });
    setDayStripPrices(prices);
  }, [baseDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const expired = isHoldExpired(expiresAt);
  const { adults, children } = state.searchCriteria.passengers;
  const paxCount = adults + children;

  const handleSelectFare = async (offer: FlightOffer) => {
    if (expired) return;
    if (!isReturn) {
      dispatch({ type: 'SELECT_OUTBOUND_OFFER', offer });
      if (state.searchCriteria.tripType === 'round-trip') {
        // Fetch return leg
        setLoadingReturn(true);
        try {
          const returnSession = await fixtureSearch(
            offer.destination,
            offer.origin,
            state.searchCriteria.returnDate ?? state.searchCriteria.departureDate,
          );
          dispatch({ type: 'SET_RETURN_SESSION', session: returnSession });
          dispatch({ type: 'NAVIGATE', screen: 'results-return' });
        } catch {
          dispatch({ type: 'SET_SEARCH_ERROR', error: vi.search.searchError });
        } finally {
          setLoadingReturn(false);
        }
      } else {
        // One-way: build passengers array and go
        buildPassengers(state, dispatch);
        dispatch({ type: 'NAVIGATE', screen: 'passengers' });
      }
    } else {
      dispatch({ type: 'SELECT_RETURN_OFFER', offer });
      buildPassengers(state, dispatch);
      dispatch({ type: 'NAVIGATE', screen: 'passengers' });
    }
  };

  const grouped = groupOffersByFlight(offers);

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-[var(--text-title-1)] text-[var(--color-text-primary)]" data-testid="results-title">
        {isReturn ? vi.results.titleReturn : vi.results.titleOutbound}
      </h1>

      <PriceHoldCountdown expiresAt={expiresAt} data-testid="price-hold-countdown" />

      {expired && (
        <AlertNote visible tone="error">
          {vi.results.holdExpired}
          <Button
            variant="ghost"
            onClick={() => dispatch({ type: 'NAVIGATE', screen: 'search' })}
            ariaLabel={vi.results.searchAgain}
          >
            {vi.results.searchAgain}
          </Button>
        </AlertNote>
      )}

      {/* 7-day price strip */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[var(--text-headline)] text-[var(--color-text-primary)]">
          {vi.results.lowestFareHeader}
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => {
            const [, month, day] = d.split('-');
            const price = dayStripPrices[d];
            const isSelected = d === baseDate;
            return (
              <button
                key={d}
                type="button"
                className={`flex flex-col items-center min-w-[72px] rounded-xl border p-2 text-xs gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vikki-vkblue-700)] transition-colors ${
                  isSelected
                    ? 'bg-[var(--vikki-vkblue-50)] border-[var(--vikki-vkblue-500)] text-[var(--vikki-vkblue-700)]'
                    : 'bg-white border-[var(--gray-200)] text-[var(--color-text-primary)] hover:bg-[var(--gray-50)]'
                }`}
                aria-label={`Ngày ${parseInt(day, 10)} tháng ${parseInt(month, 10)}, giá từ ${price ? formatVND(price) : ''}`}
                aria-pressed={isSelected}
                data-testid="date-strip-day-button"
              >
                <span className="font-semibold">{formatDateShort(d)}</span>
                <span className="text-[10px]">{price ? `Từ ${(price / 1_000_000).toFixed(1)}M` : '...'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Flight cards */}
      <div className="flex flex-col gap-3" data-testid="flight-card-list">
        {Array.from(grouped.entries()).map(([key, fareOffers]) => {
          const first = fareOffers[0];
          return (
            <div
              key={key}
              className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">{first.flightNumber}</span>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {first.departureTime} — {first.arrivalTime} · {first.duration}
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {first.aircraft} · {first.stops === 0 ? vi.results.directFlight : `${first.stops} ${vi.results.stops}`}
              </span>
              <Divider />
              <div className="flex flex-col gap-2">
                {fareOffers.map((offer) => (
                  <div
                    key={offer.offerId}
                    className="flex flex-col gap-1 p-2 rounded-lg bg-[var(--vikki-vkblue-50)] border border-[var(--gray-200)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[var(--vikki-vkblue-700)]">{offer.fareClass}</span>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {formatVND(offer.priceAmount)}{vi.results.perPax}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--color-text-secondary)]">{offer.baggageInfo}</span>
                    <Button
                      variant="primary"
                      ariaLabel={`${vi.results.selectFare} ${offer.fareClass}`}
                      data-testid="select-fare-button"
                      onClick={() => handleSelectFare(offer)}
                      disabled={expired || loadingReturn}
                    >
                      {loadingReturn ? vi.common.loading : vi.results.selectFare}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total per pax count */}
      {paxCount > 1 && (
        <div className="text-xs text-[var(--color-text-secondary)] text-center">
          Giá hiển thị cho 1 khách. Tổng cho {paxCount} khách sẽ tính ở bước tiếp theo.
        </div>
      )}
    </div>
  );
};

// Build initial passenger array from search criteria
function buildPassengers(state: AppState, dispatch: React.Dispatch<AppAction>): void {
  if (state.passengers.length > 0) return; // already set
  const { adults, children, infants } = state.searchCriteria.passengers;
  const paxList: PassengerInfo[] = [];
  let idx = 1;
  for (let i = 0; i < adults; i++) {
    paxList.push({
      passengerId: null,
      passengerIndex: idx++,
      type: 'adult',
      gender: 'M',
      lastName: '',
      firstName: '',
      dateOfBirth: null,
      phone: '',
      email: '',
    });
  }
  for (let i = 0; i < children; i++) {
    paxList.push({
      passengerId: null,
      passengerIndex: idx++,
      type: 'child',
      gender: 'M',
      lastName: '',
      firstName: '',
      dateOfBirth: null,
      phone: '',
      email: '',
    });
  }
  for (let i = 0; i < infants; i++) {
    paxList.push({
      passengerId: null,
      passengerIndex: idx++,
      type: 'infant',
      gender: 'M',
      lastName: '',
      firstName: '',
      dateOfBirth: null,
      phone: '',
      email: '',
    });
  }
  dispatch({ type: 'SET_PASSENGERS', passengers: paxList });
}
