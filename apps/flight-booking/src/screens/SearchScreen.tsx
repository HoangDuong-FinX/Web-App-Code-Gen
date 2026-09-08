import { useState, useEffect, useCallback } from 'react';
import type { SearchCriteria, CityPair, SearchResult, RecentSearch } from '../types';
import { t } from '../i18n';
import { loadAirports, loadCityPairs, searchFlights } from '../sdk';

interface Props {
  criteria: SearchCriteria;
  onUpdateCriteria: (partial: Partial<SearchCriteria>) => void;
  onOpenAirportPicker: (context: 'origin' | 'destination') => void;
  onOpenDatePicker: (context: 'departure' | 'return') => void;
  onOpenPassengerCount: () => void;
  onSearchSuccess: (result: SearchResult) => void;
}

const RECENT_SEARCHES_KEY = 'flight_booking_recent_searches';

function loadRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (raw) return JSON.parse(raw) as RecentSearch[];
  } catch { /* ignore */ }
  return [];
}

function saveRecentSearches(searches: RecentSearch[]): void {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, 4)));
  } catch { /* ignore */ }
}

export function SearchScreen({
  criteria, onUpdateCriteria, onOpenAirportPicker,
  onOpenDatePicker, onOpenPassengerCount, onSearchSuccess,
}: Props) {
  const [cityPairs, setCityPairs] = useState<CityPair[]>([]);
  const [masterDataLoaded, setMasterDataLoaded] = useState(false);
  const [masterDataError, setMasterDataError] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(loadRecentSearches);

  const fetchMasterData = useCallback(async () => {
    setMasterDataError(false);
    const [airportRes, pairRes] = await Promise.all([loadAirports(), loadCityPairs()]);
    if (airportRes.isSuccess && pairRes.isSuccess && airportRes.data && pairRes.data) {
      setCityPairs(pairRes.data);
      setMasterDataLoaded(true);
    } else {
      setMasterDataError(true);
    }
  }, []);

  useEffect(() => { fetchMasterData(); }, [fetchMasterData]);

  const routeValid = !!(criteria.origin && criteria.destination && criteria.departureDate &&
    cityPairs.some(p => p.origin === criteria.origin?.code && p.destination === criteria.destination?.code) &&
    (criteria.tripType === 'one-way' || criteria.returnDate));

  const handleSwap = () => {
    onUpdateCriteria({ origin: criteria.destination, destination: criteria.origin });
  };

  const handleSearch = async () => {
    if (!criteria.origin || !criteria.destination || !criteria.departureDate) return;
    setSearchError(false);
    setSearching(true);
    const res = await searchFlights(
      criteria.origin.code, criteria.destination.code, criteria.departureDate,
      criteria.returnDate, criteria.passengers.adults, criteria.passengers.children,
      criteria.passengers.infants,
    );
    setSearching(false);
    if (res.isSuccess && res.data) {
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        origin: criteria.origin,
        destination: criteria.destination,
        departureDate: criteria.departureDate,
        returnDate: criteria.returnDate,
        tripType: criteria.tripType,
        passengers: criteria.passengers,
        summary: `${criteria.origin.code} \u2192 ${criteria.destination.code} | ${criteria.departureDate}`,
      };
      const updated = [newSearch, ...recentSearches.filter(s => s.id !== newSearch.id)].slice(0, 4);
      setRecentSearches(updated);
      saveRecentSearches(updated);
      onSearchSuccess(res.data);
    } else {
      setSearchError(true);
    }
  };

  const handleRecentSearch = (rs: RecentSearch) => {
    onUpdateCriteria({
      origin: rs.origin, destination: rs.destination, departureDate: rs.departureDate,
      returnDate: rs.returnDate, tripType: rs.tripType, passengers: rs.passengers,
    });
  };

  const handleClearAll = () => {
    setRecentSearches([]);
    saveRecentSearches([]);
  };

  const paxSummary = t('search.passengers.summary', {
    adults: criteria.passengers.adults,
    children: criteria.passengers.children,
    infants: criteria.passengers.infants,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#F9FBF9] px-4 py-3 text-center">
        <h1 className="text-xl font-medium text-[#191919]">{t('search.title')}</h1>
      </header>

      <div className="px-4 flex flex-col gap-0">
        <div className="flex rounded-full border border-[#E6E8E7] overflow-hidden my-3">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              criteria.tripType === 'one-way'
                ? 'bg-[#E12127] text-white'
                : 'bg-white text-[#999999]'
            }`}
            aria-label={t('search.tripType.oneWay')}
            onClick={() => onUpdateCriteria({ tripType: 'one-way', returnDate: null })}
          >
            {t('search.tripType.oneWay')}
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              criteria.tripType === 'round-trip'
                ? 'bg-[#E12127] text-white'
                : 'bg-white text-[#999999]'
            }`}
            aria-label={t('search.tripType.roundTrip')}
            onClick={() => onUpdateCriteria({ tripType: 'round-trip' })}
          >
            {t('search.tripType.roundTrip')}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-[0_5px_10px_rgba(89,27,27,0.05)] flex flex-col gap-2">
          <div className="relative">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <label className="text-xs text-[#999999] px-2">{t('search.origin.label')}</label>
                <button
                  type="button"
                  data-testid="origin-field"
                  aria-label={t('search.selectOrigin.aria')}
                  className="text-left border border-[#E6E8E7] rounded-lg px-2 py-2.5"
                  onClick={() => onOpenAirportPicker('origin')}
                >
                  {criteria.origin ? (
                    <>
                      <span className="text-base font-semibold text-[#191919]">{criteria.origin.code}</span>
                      <span className="ml-2 text-sm text-[#555555]">{criteria.origin.name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-[#999999]">{t('search.selectOrigin.aria')}</span>
                  )}
                </button>
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-[#999999] px-2">{t('search.destination.label')}</label>
                <button
                  type="button"
                  data-testid="destination-field"
                  aria-label={t('search.selectDestination.aria')}
                  className="text-left border border-[#E6E8E7] rounded-lg px-2 py-2.5"
                  onClick={() => onOpenAirportPicker('destination')}
                >
                  {criteria.destination ? (
                    <>
                      <span className="text-base font-semibold text-[#191919]">{criteria.destination.code}</span>
                      <span className="ml-2 text-sm text-[#555555]">{criteria.destination.name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-[#999999]">{t('search.selectDestination.aria')}</span>
                  )}
                </button>
              </div>
            </div>
            <button
              type="button"
              data-testid="swap-button"
              aria-label={t('search.swap.aria')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#E6E8E7] bg-white flex items-center justify-center z-10 text-lg"
              onClick={handleSwap}
            >
              \u21C5
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <label className="text-xs text-[#999999] px-2">{t('search.departureDate.label')}</label>
              <button
                type="button"
                data-testid="departure-date-field"
                aria-label={t('search.selectDeparture.aria')}
                className="text-left border border-[#E6E8E7] rounded-lg px-2 py-2.5 text-sm"
                onClick={() => onOpenDatePicker('departure')}
              >
                {criteria.departureDate ?? t('search.selectDeparture.aria')}
              </button>
            </div>
            {criteria.tripType === 'round-trip' && (
              <div className="flex-1 flex flex-col">
                <label className="text-xs text-[#999999] px-2">{t('search.returnDate.label')}</label>
                <button
                  type="button"
                  data-testid="return-date-field"
                  aria-label={t('search.selectReturn.aria')}
                  className="text-left border border-[#E6E8E7] rounded-lg px-2 py-2.5 text-sm"
                  onClick={() => onOpenDatePicker('return')}
                >
                  {criteria.returnDate ?? t('search.selectReturn.aria')}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-[#999999] px-2">{t('search.passengers.label')}</label>
            <button
              type="button"
              data-testid="passenger-count-field"
              aria-label={t('search.selectPassengers.aria')}
              className="text-left border border-[#E6E8E7] rounded-lg px-2 py-2.5 text-sm"
              onClick={onOpenPassengerCount}
            >
              {paxSummary}
            </button>
          </div>

          <button
            type="button"
            data-testid="search-action"
            aria-label={t('search.action.aria')}
            disabled={!masterDataLoaded || !routeValid || searching}
            className="w-full h-12 bg-[#E12127] text-white rounded-lg text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSearch}
          >
            {searching ? t('common.loading') : t('search.action')}
          </button>
        </div>

        {masterDataError && (
          <div data-testid="master-data-error" aria-label={t('search.masterDataError.aria')} className="mt-3 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-[#555555]">{t('search.masterDataError')}</p>
            <button type="button" aria-label={t('search.retryData.aria')} className="text-sm text-[#E12127] font-medium mt-1" onClick={fetchMasterData}>
              {t('search.retry')}
            </button>
          </div>
        )}

        {searchError && (
          <div data-testid="search-error" aria-label={t('search.searchError.aria')} className="mt-3 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-[#555555]">{t('search.searchError')}</p>
            <button type="button" aria-label={t('search.retrySearch.aria')} className="text-sm text-[#E12127] font-medium mt-1" onClick={handleSearch}>
              {t('search.retry')}
            </button>
          </div>
        )}
      </div>

      <hr className="border-[#E6E8E7] my-4" />

      <div className="px-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#191919]">{t('search.recentSearches.title')}</h2>
          {recentSearches.length > 0 && (
            <button
              type="button"
              data-testid="clear-all-action"
              aria-label={t('search.recentSearches.clearAll.aria')}
              className="text-sm font-medium text-[#E12127]"
              onClick={handleClearAll}
            >
              {t('search.recentSearches.clearAll')}
            </button>
          )}
        </div>
        {recentSearches.map((rs) => (
          <button
            key={rs.id}
            type="button"
            data-testid="recent-search-item"
            aria-label={rs.summary}
            className="text-left p-3 bg-white rounded-lg shadow-[0_5px_10px_rgba(89,27,27,0.05)] text-sm text-[#191919]"
            onClick={() => handleRecentSearch(rs)}
          >
            {rs.summary}
          </button>
        ))}
      </div>
    </div>
  );
}
