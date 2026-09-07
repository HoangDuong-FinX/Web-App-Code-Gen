import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../store';
import { t } from '../i18n/vi';
import {
  Text, Button, SegmentedControl, InlineError, AlertNote,
} from '../components/ui';
import { Modal } from '../components/Modal';
import { Calendar } from '../components/ui';
import {
  loadAirports, loadCityPairs, submitSearch, fetchDailyPrices,
} from '../fixtures/bookingService';
import type { Airport, TripType, RecentSearch } from '../types';

const RECENT_KEY = 'vikki-flight-recent-searches';

function saveRecentSearch(rs: RecentSearch, existing: RecentSearch[]): RecentSearch[] {
  const deduped = existing.filter(
    r => !(r.origin === rs.origin && r.destination === rs.destination &&
           r.departureDate === rs.departureDate && r.returnDate === rs.returnDate)
  );
  return [rs, ...deduped].slice(0, 4);
}

function formatDateVN(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d} th\u00E1ng ${parseInt(m, 10)} ${y}`;
}

function formatPassengers(adult: number, child: number, infant: number): string {
  const parts: string[] = [];
  if (adult > 0) parts.push(`${adult} Ng\u01B0\u1EDDi l\u1EDBn`);
  if (child > 0) parts.push(`${child} Tr\u1ebb em`);
  if (infant > 0) parts.push(`${infant} Em b\u00E9`);
  return parts.join(', ');
}

function getAirportLabel(airports: Airport[], code: string): string {
  const a = airports.find(ap => ap.code === code);
  return a ? `${code} \u2014 ${a.city}` : code;
}

function get6Months(): Array<{ month: number; year: number }> {
  const result: Array<{ month: number; year: number }> = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    result.push({ month: d.getMonth() + 1, year: d.getFullYear() });
  }
  return result;
}

function get7DayStrip(centerDate: string): string[] {
  const dates: string[] = [];
  const center = new Date(centerDate);
  for (let i = -3; i <= 3; i++) {
    const d = new Date(center);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function SearchScreen() {
  const { state, setState, navigate } = useAppContext();
  const { searchCriteria, airports, cityPairs, masterDataLoaded, masterDataError, recentSearches } = state;

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [invalidRoute, setInvalidRoute] = useState(false);

  // Modal state
  const [airportModal, setAirportModal] = useState<'origin' | 'destination' | null>(null);
  const [airportQuery, setAirportQuery] = useState('');
  const [dateModal, setDateModal] = useState<'departure' | 'return' | null>(null);
  const [dateTab, setDateTab] = useState<'departure' | 'return'>('departure');
  const [paxModal, setPaxModal] = useState(false);
  const [paxDraft, setPaxDraft] = useState({ adult: searchCriteria.adultCount, child: searchCriteria.childCount, infant: searchCriteria.infantCount });
  const [dailyPrices, setDailyPrices] = useState<Record<string, number>>({});

  // Load master data on mount
  useEffect(() => {
    if (masterDataLoaded) return;
    Promise.all([loadAirports(), loadCityPairs()])
      .then(([aps, cps]) => {
        setState(s => ({
          ...s,
          airports: aps,
          cityPairs: cps,
          masterDataLoaded: true,
          masterDataError: null,
        }));
      })
      .catch(() => {
        setState(s => ({ ...s, masterDataError: t('search.masterDataError') }));
      });
  }, [masterDataLoaded, setState]);

  // Validate route whenever origin/destination change
  useEffect(() => {
    if (!masterDataLoaded || cityPairs.length === 0) return;
    const valid = cityPairs.some(
      cp => cp.origin === searchCriteria.origin && cp.destination === searchCriteria.destination
    );
    setInvalidRoute(!valid);
  }, [searchCriteria.origin, searchCriteria.destination, cityPairs, masterDataLoaded]);

  // Fetch daily prices when departure date changes
  useEffect(() => {
    const dates = get7DayStrip(searchCriteria.departureDate);
    fetchDailyPrices(
      { ...searchCriteria, tripType: searchCriteria.tripType },
      dates
    ).then(prices => setDailyPrices(prices)).catch(() => {});
  }, [searchCriteria.departureDate, searchCriteria.origin, searchCriteria.destination]);

  const updateCriteria = useCallback((patch: Partial<typeof searchCriteria>) => {
    setState(s => ({ ...s, searchCriteria: { ...s.searchCriteria, ...patch } }));
  }, [setState]);

  const handleSwap = () => {
    const { origin, destination, departureDate, returnDate, tripType } = searchCriteria;
    let newReturn = returnDate;
    if (tripType === 'round-trip') {
      const dep = new Date(departureDate);
      const ret = new Date(returnDate);
      if (ret < dep) {
        const pushed = new Date(dep);
        pushed.setDate(pushed.getDate() + 4);
        newReturn = pushed.toISOString().split('T')[0];
      }
    }
    updateCriteria({ origin: destination, destination: origin, returnDate: newReturn });
  };

  const handleDepartureChange = (date: string) => {
    const dep = new Date(date);
    let returnDate = searchCriteria.returnDate;
    if (searchCriteria.tripType === 'round-trip' && new Date(returnDate) < dep) {
      const pushed = new Date(dep);
      pushed.setDate(pushed.getDate() + 4);
      returnDate = pushed.toISOString().split('T')[0];
    }
    updateCriteria({ departureDate: date, returnDate });
  };

  const handleSearch = async () => {
    if (!masterDataLoaded || invalidRoute || loadingSearch) return;
    setSearchError(null);
    setLoadingSearch(true);
    try {
      const result = await submitSearch({
        ...searchCriteria,
        returnDate: searchCriteria.tripType === 'round-trip' ? searchCriteria.returnDate : undefined,
      });
      // For round-trip we'll run the return search after outbound is selected
      // Store outbound session
      const newRecent: RecentSearch = {
        id: `${Date.now()}`,
        origin: searchCriteria.origin,
        destination: searchCriteria.destination,
        departureDate: searchCriteria.departureDate,
        returnDate: searchCriteria.tripType === 'round-trip' ? searchCriteria.returnDate : undefined,
        tripType: searchCriteria.tripType,
        adultCount: searchCriteria.adultCount,
        childCount: searchCriteria.childCount,
        infantCount: searchCriteria.infantCount,
      };
      const updatedRecent = saveRecentSearch(newRecent, recentSearches);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(updatedRecent)); } catch { /* ignore */ }

      setState(s => ({
        ...s,
        outboundSessionId: result.sessionId,
        expiresAt: result.expiresAt,
        outboundOffers: result.offers,
        returnOffers: [],
        selectedOutboundOffer: null,
        selectedOutboundFare: null,
        selectedReturnOffer: null,
        selectedReturnFare: null,
        outboundMeals: [],
        outboundBaggage: null,
        outboundSeats: [],
        returnMeals: [],
        returnBaggage: null,
        returnSeats: [],
        recentSearches: updatedRecent,
        currentScreen: 'results',
      }));
    } catch {
      setSearchError(t('search.error'));
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleDeleteRecent = (id: string) => {
    const updated = recentSearches.filter(r => r.id !== id);
    setState(s => ({ ...s, recentSearches: updated }));
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
  };

  const handleSelectAirport = (code: string) => {
    if (airportModal === 'origin') {
      updateCriteria({ origin: code });
    } else {
      updateCriteria({ destination: code });
    }
    setAirportModal(null);
    setAirportQuery('');
  };

  const filteredAirports = airports.filter(a => {
    const q = airportQuery.toLowerCase();
    return (
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
    );
  });

  const groupedAirports = {
    Popular: filteredAirports.filter(a => a.group === 'Popular'),
    Vietnam: filteredAirports.filter(a => a.group === 'Vietnam'),
    International: filteredAirports.filter(a => a.group === 'International'),
  };

  const canSearch = masterDataLoaded && !invalidRoute && !loadingSearch;

  const months = get6Months();

  return (
    <div className="screen search-screen">
      <div className="screen__content">
        <h1 className="text-title-1">{t('search.title')}</h1>

        <div className="stack stack--col gap-12">
          <SegmentedControl
            options={[
              { label: t('search.tripType.roundTrip'), value: 'round-trip' },
              { label: t('search.tripType.oneWay'), value: 'one-way' },
            ]}
            value={searchCriteria.tripType}
            onChange={v => updateCriteria({ tripType: v as TripType })}
            ariaLabel={t('search.tripType.ariaLabel')}
            data-testid="trip-type-toggle"
          />

          <button
            type="button"
            className="btn btn-secondary"
            aria-label={t('search.origin.ariaLabel')}
            data-testid="origin-airport-button"
            onClick={() => { setAirportModal('origin'); setAirportQuery(''); }}
          >
            {t('search.origin.label')}: {getAirportLabel(airports, searchCriteria.origin)}
          </button>

          <button
            type="button"
            className="btn btn-ghost swap-btn"
            aria-label={t('search.swap.ariaLabel')}
            data-testid="swap-airports-button"
            onClick={handleSwap}
          >
            &#8651;
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            aria-label={t('search.destination.ariaLabel')}
            data-testid="destination-airport-button"
            onClick={() => { setAirportModal('destination'); setAirportQuery(''); }}
          >
            {t('search.destination.label')}: {getAirportLabel(airports, searchCriteria.destination)}
          </button>

          <InlineError visible={invalidRoute} data-testid="invalid-route-error">
            {t('search.invalidRoute')}
          </InlineError>

          <button
            type="button"
            className="btn btn-secondary"
            aria-label={t('search.passengers.ariaLabel')}
            data-testid="passenger-count-button"
            onClick={() => { setPaxDraft({ adult: searchCriteria.adultCount, child: searchCriteria.childCount, infant: searchCriteria.infantCount }); setPaxModal(true); }}
          >
            {t('search.passengers.label')}: {formatPassengers(searchCriteria.adultCount, searchCriteria.childCount, searchCriteria.infantCount)}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            aria-label={t('search.departureDate.ariaLabel')}
            data-testid="departure-date-button"
            onClick={() => { setDateTab('departure'); setDateModal('departure'); }}
          >
            {t('search.departureDate.label')}: {formatDateVN(searchCriteria.departureDate)}
          </button>

          {searchCriteria.tripType === 'round-trip' && (
            <button
              type="button"
              className="btn btn-secondary"
              aria-label={t('search.returnDate.ariaLabel')}
              data-testid="return-date-button"
              onClick={() => { setDateTab('return'); setDateModal('return'); }}
            >
              {t('search.returnDate.label')}: {formatDateVN(searchCriteria.returnDate)}
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary"
            aria-label={t('search.button.ariaLabel')}
            data-testid="search-button"
            disabled={!canSearch}
            onClick={handleSearch}
          >
            {loadingSearch ? t('search.loading') : t('search.button')}
          </button>
        </div>

        <AlertNote visible={!!masterDataError} tone="error" data-testid="master-data-error">
          {masterDataError}
          <button type="button" className="btn btn-ghost" onClick={() => setState(s => ({ ...s, masterDataLoaded: false, masterDataError: null }))}>
            {t('search.retry')}
          </button>
        </AlertNote>

        <AlertNote visible={!!searchError} tone="error" data-testid="search-error">
          {searchError}
          <button type="button" className="btn btn-ghost" onClick={() => setSearchError(null)}>
            {t('search.retry')}
          </button>
        </AlertNote>

        {recentSearches.length > 0 && (
          <div className="stack stack--col gap-12 mt-24">
            <Text variant="headline" semantic="h2" data-testid="recent-searches-header">
              {t('search.recentSearches')}
            </Text>
            {recentSearches.map(rs => (
              <div key={rs.id} className="recent-search-card">
                <div className="recent-search-card__route" data-testid="recent-search-route">
                  {rs.origin} &#8651; {rs.destination}
                </div>
                <div className="recent-search-card__dates" data-testid="recent-search-dates">
                  {rs.departureDate}{rs.returnDate ? ` \u2014 ${rs.returnDate}` : ''}
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  aria-label={t('search.recentSearch.delete.ariaLabel')}
                  data-testid="recent-search-delete-button"
                  onClick={() => handleDeleteRecent(rs.id)}
                >
                  \u2715
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Airport picker modal */}
      <Modal
        isOpen={!!airportModal}
        title={t('airportPicker.title')}
        onClose={() => { setAirportModal(null); setAirportQuery(''); }}
        data-testid="airport-picker-modal"
      >
        <div className="stack stack--col gap-12 p-16">
          <SegmentedControl
            options={[
              { label: t('airportPicker.origin'), value: 'origin' },
              { label: t('airportPicker.destination'), value: 'destination' },
            ]}
            value={airportModal ?? 'origin'}
            onChange={v => setAirportModal(v as 'origin' | 'destination')}
            ariaLabel={t('search.tripType.ariaLabel')}
            data-testid="origin-destination-tabs"
          />
          <input
            type="text"
            className="text-field__input"
            placeholder={t('airportPicker.search.placeholder')}
            aria-label={t('airportPicker.search.ariaLabel')}
            value={airportQuery}
            onChange={e => setAirportQuery(e.target.value)}
            data-testid="airport-search-input"
          />
          {(['Popular', 'Vietnam', 'International'] as const).map(group => (
            groupedAirports[group].length > 0 && (
              <div key={group}>
                <p className="text-caption-2">
                  {group === 'Popular' ? t('airportPicker.popular') : group === 'Vietnam' ? t('airportPicker.vietnam') : t('airportPicker.international')}
                </p>
                {groupedAirports[group].map(ap => (
                  <button
                    key={ap.code}
                    type="button"
                    className="btn btn-ghost airport-item"
                    aria-label={`Ch\u1ECDn s\u00E2n bay ${ap.name}, ${ap.city}`}
                    data-testid="airport-item-button"
                    onClick={() => handleSelectAirport(ap.code)}
                  >
                    {ap.code} \u2014 {ap.city}, {ap.country} \u2014 {ap.name}
                  </button>
                ))}
              </div>
            )
          ))}
        </div>
      </Modal>

      {/* Date picker modal */}
      <Modal
        isOpen={!!dateModal}
        title={t('datePicker.title')}
        onClose={() => setDateModal(null)}
        data-testid="date-picker-modal"
      >
        <div className="stack stack--col gap-12 p-16">
          {searchCriteria.tripType === 'round-trip' && (
            <SegmentedControl
              options={[
                { label: t('datePicker.departure'), value: 'departure' },
                { label: t('datePicker.return'), value: 'return' },
              ]}
              value={dateTab}
              onChange={v => setDateTab(v as 'departure' | 'return')}
              ariaLabel="Lo\u1EA1i ng\u00E0y"
              data-testid="trip-type-tabs"
            />
          )}
          {months.map(({ month, year }) => (
            <div key={`${year}-${month}`}>
              <Text variant="headline" semantic="h3">
                Th\u00E1ng {month} {year}
              </Text>
              <Calendar
                month={month}
                year={year}
                selectedDate={dateTab === 'departure' ? searchCriteria.departureDate : searchCriteria.returnDate}
                dailyPrices={dailyPrices}
                onSelectDate={date => {
                  if (dateTab === 'departure') {
                    handleDepartureChange(date);
                  } else {
                    updateCriteria({ returnDate: date });
                  }
                }}
                data-testid="calendar-grid"
              />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            aria-label={t('datePicker.confirm.ariaLabel')}
            data-testid="confirm-button"
            onClick={() => setDateModal(null)}
          >
            {t('datePicker.confirm')}
          </button>
        </div>
      </Modal>

      {/* Passenger count modal */}
      <Modal
        isOpen={paxModal}
        title={t('passengerCount.title')}
        onClose={() => setPaxModal(false)}
        data-testid="passenger-count-modal"
      >
        <div className="stack stack--col gap-16 p-16">
          <Text variant="footnote">{t('passengerCount.specialHelp')}</Text>
          {([
            { key: 'adult' as const, label: t('passengerCount.adult'), desc: t('passengerCount.adult.desc'), min: 1, max: 4 },
            { key: 'child' as const, label: t('passengerCount.child'), desc: t('passengerCount.child.desc'), min: 0, max: 4 },
            { key: 'infant' as const, label: t('passengerCount.infant'), desc: t('passengerCount.infant.desc'), min: 0, max: paxDraft.adult },
          ]).map(({ key, label, desc, min, max }) => (
            <div key={key} className="pax-row">
              <div>
                <Text variant="body-semibold">{label}</Text>
                <Text variant="footnote">{desc}</Text>
              </div>
              <div className="pax-counter">
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-label={`${t('passengerCount.decrement.ariaLabel')} ${label}`}
                  data-testid="decrement-button"
                  disabled={paxDraft[key] <= min}
                  onClick={() => setPaxDraft(d => ({ ...d, [key]: d[key] - 1 }))}
                >
                  \u2212
                </button>
                <Text variant="headline">{paxDraft[key]}</Text>
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-label={`${t('passengerCount.increment.ariaLabel')} ${label}`}
                  data-testid="increment-button"
                  disabled={paxDraft[key] >= max}
                  onClick={() => setPaxDraft(d => ({ ...d, [key]: d[key] + 1 }))}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            aria-label={t('passengerCount.confirm.ariaLabel')}
            data-testid="confirm-button"
            onClick={() => {
              updateCriteria({ adultCount: paxDraft.adult, childCount: paxDraft.child, infantCount: paxDraft.infant });
              setPaxModal(false);
            }}
          >
            {t('passengerCount.confirm')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
