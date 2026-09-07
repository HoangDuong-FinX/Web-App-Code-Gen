import React, { useEffect, useState, useCallback } from 'react';
import { t } from '../i18n';
import type { AppState, Airport, SearchCriteria } from '../types/state';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { AlertNote } from '../components/ui/AlertNote';
import { InlineError } from '../components/ui/InlineError';
import { AirportPickerModal } from '../components/modals/AirportPickerModal';
import { DatePickerModal } from '../components/modals/DatePickerModal';
import { PassengerCountModal } from '../components/modals/PassengerCountModal';
import { loadAirports } from '../fixtures/airports';
import { loadCityPairs, isValidRoute } from '../fixtures/cityPairs';
import { submitSearch } from '../fixtures/flightOffers';
import type { BookingSession } from '../types/state';

interface SearchProps {
  state: AppState;
  onNavigate: (screen: AppState['screen']) => void;
  onUpdateState: (updates: Partial<AppState>) => void;
}

interface RecentSearch {
  origin: Airport;
  destination: Airport;
  departureDate: string;
  returnDate: string;
  tripType: string;
}

const MAX_RECENT = 4;

function loadRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem('vikki-flight-recent-searches');
    return raw ? (JSON.parse(raw) as RecentSearch[]) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(search: RecentSearch): void {
  try {
    const existing = loadRecentSearches();
    const deduped = existing.filter(
      s => !(s.origin.code === search.origin.code &&
             s.destination.code === search.destination.code &&
             s.departureDate === search.departureDate)
    );
    const updated = [search, ...deduped].slice(0, MAX_RECENT);
    localStorage.setItem('vikki-flight-recent-searches', JSON.stringify(updated));
  } catch {
    // localStorage unavailable — silently skip
  }
}

function deleteRecentSearch(index: number): void {
  try {
    const existing = loadRecentSearches();
    existing.splice(index, 1);
    localStorage.setItem('vikki-flight-recent-searches', JSON.stringify(existing));
  } catch {
    // ignore
  }
}

function formatPaxLabel(adults: number, children: number, infants: number): string {
  let label = `${adults} Người lớn`;
  if (children > 0) label += `, ${children} Trẻ em`;
  if (infants > 0) label += `, ${infants} Em bé`;
  return label;
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${Number(d)} tháng ${Number(m)} ${y}`;
}

export function SearchScreen({ state, onNavigate, onUpdateState }: SearchProps) {
  const { searchCriteria } = state;
  const [airports, setAirports] = useState<Airport[]>([]);
  const [masterDataError, setMasterDataError] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [airportPickerMode, setAirportPickerMode] = useState<'origin' | 'destination'>('origin');
  const [showAirportPicker, setShowAirportPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassengerCount, setShowPassengerCount] = useState(false);
  const [datepickerMode, setDatepickerMode] = useState<'departure' | 'return'>('departure');

  const sc = searchCriteria;

  const routeValid = sc.origin && sc.destination
    ? isValidRoute(sc.origin.code, sc.destination.code)
    : true; // not yet selected
  const routeSelected = !!(sc.origin && sc.destination);
  const showInvalidRoute = routeSelected && !routeValid;

  useEffect(() => {
    setRecentSearches(loadRecentSearches());
    Promise.all([loadAirports(), loadCityPairs()])
      .then(([aps]) => { setAirports(aps); setMasterDataError(false); })
      .catch(() => setMasterDataError(true));
  }, []);

  const updateCriteria = useCallback((updates: Partial<SearchCriteria>) => {
    onUpdateState({ searchCriteria: { ...sc, ...updates } });
  }, [sc, onUpdateState]);

  const handleSwap = () => {
    const newOrigin = sc.destination;
    const newDest = sc.origin;
    let returnDate = sc.returnDate;
    if (sc.tripType === 'round-trip' && sc.returnDate < sc.departureDate) {
      const dep = new Date(sc.departureDate);
      dep.setDate(dep.getDate() + 4);
      returnDate = dep.toISOString().slice(0, 10);
    }
    updateCriteria({ origin: newOrigin, destination: newDest, returnDate });
  };

  const handleDepartureChange = (date: string) => {
    let returnDate = sc.returnDate;
    if (sc.tripType === 'round-trip' && returnDate < date) {
      const dep = new Date(date);
      dep.setDate(dep.getDate() + 4);
      returnDate = dep.toISOString().slice(0, 10);
    }
    updateCriteria({ departureDate: date, returnDate });
  };

  const handleSearch = async () => {
    if (!sc.origin || !sc.destination) return;
    setSearchError(false);
    setSearching(true);
    try {
      const session: BookingSession = await submitSearch({
        origin: sc.origin.code,
        destination: sc.destination.code,
        departureDate: sc.departureDate,
        tripType: sc.tripType,
        adults: sc.adults,
        children: sc.children,
        infants: sc.infants,
      });
      saveRecentSearch({
        origin: sc.origin,
        destination: sc.destination,
        departureDate: sc.departureDate,
        returnDate: sc.returnDate,
        tripType: sc.tripType,
      });
      const passengers = [
        ...Array(sc.adults).fill(null).map(() => ({ lastName: '', firstName: '', gender: 'M' as const, dob: '', phone: '', email: '' })),
        ...Array(sc.children).fill(null).map(() => ({ lastName: '', firstName: '', gender: 'M' as const, dob: '', phone: '', email: '' })),
        ...Array(sc.infants).fill(null).map(() => ({ lastName: '', firstName: '', gender: 'M' as const, dob: '', phone: '', email: '' })),
      ];
      onUpdateState({ outboundSession: session, passengers, selectedOutboundOffer: null, selectedReturnOffer: null });
      onNavigate('results');
    } catch {
      setSearchError(true);
    } finally {
      setSearching(false);
    }
  };

  const handleDeleteRecent = (index: number) => {
    deleteRecentSearch(index);
    setRecentSearches(loadRecentSearches());
  };

  const canSearch = !masterDataError && !showInvalidRoute && !!sc.origin && !!sc.destination && !searching;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      {/* Fixture mode banner */}
      <AlertNote tone="warning" visible>
        {t('app.fixtureMode')}
      </AlertNote>

      <h1 className="text-[28px] font-bold leading-[1.35] font-display">{t('search.title')}</h1>

      <div className="flex flex-col gap-3">
        <SegmentedControl
          options={[
            { label: t('search.tripType.roundTrip'), value: 'round-trip' },
            { label: t('search.tripType.oneWay'), value: 'one-way' },
          ]}
          value={sc.tripType}
          onChange={v => updateCriteria({ tripType: v as 'one-way' | 'round-trip' })}
          aria-label={t('search.tripType.roundTrip')}
          data-testid="trip-type-toggle"
        />

        <Button
          variant="secondary"
          fullWidth
          aria-label={t('search.origin.aria')}
          data-testid="origin-airport-button"
          onClick={() => { setAirportPickerMode('origin'); setShowAirportPicker(true); }}
        >
          {sc.origin
            ? `Điểm đi: ${sc.origin.code} — ${sc.origin.city}`
            : t('search.origin.label')}
        </Button>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            aria-label={t('search.swapAirports.aria')}
            data-testid="swap-airports-button"
            onClick={handleSwap}
          >
            ⇄
          </Button>
        </div>

        <Button
          variant="secondary"
          fullWidth
          aria-label={t('search.destination.aria')}
          data-testid="destination-airport-button"
          onClick={() => { setAirportPickerMode('destination'); setShowAirportPicker(true); }}
        >
          {sc.destination
            ? `Điểm đến: ${sc.destination.code} — ${sc.destination.city}`
            : t('search.destination.label')}
        </Button>

        <InlineError visible={showInvalidRoute} data-testid="invalid-route-error">
          {t('search.invalidRoute')}
        </InlineError>

        <Button
          variant="secondary"
          fullWidth
          aria-label={t('search.passengers.aria')}
          data-testid="passenger-count-button"
          onClick={() => setShowPassengerCount(true)}
        >
          Hành khách: {formatPaxLabel(sc.adults, sc.children, sc.infants)}
        </Button>

        <Button
          variant="secondary"
          fullWidth
          aria-label={t('search.departureDate.aria')}
          data-testid="departure-date-button"
          onClick={() => { setDatepickerMode('departure'); setShowDatePicker(true); }}
        >
          Ngày đi: {formatDate(sc.departureDate)}
        </Button>

        {sc.tripType === 'round-trip' && (
          <Button
            variant="secondary"
            fullWidth
            aria-label={t('search.returnDate.aria')}
            data-testid="return-date-button"
            onClick={() => { setDatepickerMode('return'); setShowDatePicker(true); }}
          >
            Ngày về: {formatDate(sc.returnDate)}
          </Button>
        )}

        <Button
          variant="primary"
          fullWidth
          aria-label={t('search.button.aria')}
          data-testid="search-button"
          onClick={handleSearch}
          disabled={!canSearch}
          loading={searching}
        >
          {t('search.button')}
        </Button>
      </div>

      <AlertNote tone="error" visible={masterDataError} data-testid="master-data-error" role="alert">
        {t('search.masterDataError')}
        <Button variant="ghost" onClick={() => window.location.reload()} className="ml-2 !py-0 !px-1 text-[12px]">
          {t('search.retry')}
        </Button>
      </AlertNote>

      <AlertNote tone="error" visible={searchError} data-testid="search-error" role="alert">
        {t('search.error')}
        <Button variant="ghost" onClick={handleSearch} className="ml-2 !py-0 !px-1 text-[12px]">
          {t('search.retry')}
        </Button>
      </AlertNote>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <Text variant="headline" as="h2">{t('search.recentSearches')}</Text>
          {recentSearches.map((rs, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]"
            >
              <div className="flex items-start justify-between">
                <Text variant="body-semibold" as="span">
                  {rs.origin.city} ({rs.origin.code}) ⇄ {rs.destination.city} ({rs.destination.code})
                </Text>
                <button
                  type="button"
                  aria-label={t('search.recentSearch.delete.aria')}
                  data-testid="recent-search-delete-button"
                  onClick={() => handleDeleteRecent(i)}
                  className="p-1 text-[var(--gray-400)] hover:text-[var(--color-error)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--vikki-vkblue-500)] rounded"
                >
                  ✕
                </button>
              </div>
              <Text variant="footnote" as="span">
                {formatDate(rs.departureDate)}
                {rs.tripType === 'round-trip' ? ` — ${formatDate(rs.returnDate)}` : ''}
              </Text>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AirportPickerModal
        open={showAirportPicker}
        airports={airports}
        mode={airportPickerMode}
        onSelect={airport => {
          updateCriteria(airportPickerMode === 'origin' ? { origin: airport } : { destination: airport });
          setShowAirportPicker(false);
        }}
        onClose={() => setShowAirportPicker(false)}
      />

      <DatePickerModal
        open={showDatePicker}
        mode={datepickerMode}
        departureDate={sc.departureDate}
        returnDate={sc.returnDate}
        tripType={sc.tripType}
        onConfirm={(dep, ret) => {
          handleDepartureChange(dep);
          if (ret) updateCriteria({ returnDate: ret });
          setShowDatePicker(false);
        }}
        onClose={() => setShowDatePicker(false)}
      />

      <PassengerCountModal
        open={showPassengerCount}
        adults={sc.adults}
        children={sc.children}
        infants={sc.infants}
        onConfirm={(adults, children, infants) => {
          updateCriteria({ adults, children, infants });
          setShowPassengerCount(false);
        }}
        onClose={() => setShowPassengerCount(false)}
      />
    </div>
  );
}
