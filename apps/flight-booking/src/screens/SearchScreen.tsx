import React, { useState, useEffect, useCallback } from 'react';
import type { SearchCriteria, Airport, CityPair, RecentSearch, SearchSession, TripType } from '../types';
import { t } from '../i18n/vi';
import { loadAirports } from '../fixtures/airports';
import { loadCityPairs } from '../fixtures/cityPairs';
import { submitSearch } from '../fixtures/searchResults';

interface Props {
  criteria: SearchCriteria;
  recentSearches: RecentSearch[];
  onCriteriaChange: (c: SearchCriteria) => void;
  onSearchSuccess: (outbound: SearchSession, returnSession?: SearchSession) => void;
}

export function SearchScreen({ criteria, recentSearches, onCriteriaChange, onSearchSuccess }: Props) {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cityPairs, setCityPairs] = useState<CityPair[]>([]);
  const [masterDataError, setMasterDataError] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [masterDataLoaded, setMasterDataLoaded] = useState(false);
  const [showAirportPicker, setShowAirportPicker] = useState<'origin' | 'destination' | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<'departure' | 'return' | null>(null);
  const [showPassengerCounter, setShowPassengerCounter] = useState(false);
  const [airportSearch, setAirportSearch] = useState('');

  const loadMasterData = useCallback(async () => {
    setMasterDataError(false);
    try {
      const [ap, cp] = await Promise.all([loadAirports(), loadCityPairs()]);
      setAirports(ap);
      setCityPairs(cp);
      setMasterDataLoaded(true);
    } catch {
      setMasterDataError(true);
    }
  }, []);

  useEffect(() => {
    loadMasterData();
  }, [loadMasterData]);

  const isRouteValid = criteria.origin !== null && criteria.destination !== null &&
    cityPairs.some((cp) => cp.origin === criteria.origin?.code && cp.destination === criteria.destination?.code);

  const canSearch = masterDataLoaded && isRouteValid && criteria.departureDate !== '' && !loading;

  const getDefaultDepartureDate = (): string => {
    const d = new Date();
    d.setDate(d.getDate() + 28);
    return d.toISOString().split('T')[0];
  };

  const handleSearch = async () => {
    if (!canSearch || !criteria.origin || !criteria.destination) return;
    setLoading(true);
    setSearchError(false);
    try {
      const outbound = await submitSearch(
        criteria.origin.code, criteria.destination.code,
        criteria.departureDate, criteria.adults, criteria.children, criteria.infants
      );
      let returnSession: SearchSession | undefined;
      if (criteria.tripType === 'round-trip' && criteria.returnDate) {
        returnSession = await submitSearch(
          criteria.destination.code, criteria.origin.code,
          criteria.returnDate, criteria.adults, criteria.children, criteria.infants
        );
      }
      onSearchSuccess(outbound, returnSession);
    } catch {
      setSearchError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    onCriteriaChange({ ...criteria, origin: criteria.destination, destination: criteria.origin });
  };

  const handleTripTypeChange = (type: TripType) => {
    const update: Partial<SearchCriteria> = { tripType: type };
    if (type === 'one-way') {
      update.returnDate = '';
    } else if (!criteria.returnDate && criteria.departureDate) {
      const d = new Date(criteria.departureDate);
      d.setDate(d.getDate() + 4);
      update.returnDate = d.toISOString().split('T')[0];
    }
    onCriteriaChange({ ...criteria, ...update });
  };

  const handleSelectAirport = (airport: Airport) => {
    if (showAirportPicker === 'origin') {
      onCriteriaChange({ ...criteria, origin: airport });
    } else {
      onCriteriaChange({ ...criteria, destination: airport });
    }
    setShowAirportPicker(null);
    setAirportSearch('');
  };

  const handleSelectDate = (date: string) => {
    if (showDatePicker === 'departure') {
      const update: Partial<SearchCriteria> = { departureDate: date };
      if (criteria.tripType === 'round-trip' && criteria.returnDate && date > criteria.returnDate) {
        const d = new Date(date);
        d.setDate(d.getDate() + 4);
        update.returnDate = d.toISOString().split('T')[0];
      }
      onCriteriaChange({ ...criteria, ...update });
    } else {
      onCriteriaChange({ ...criteria, returnDate: date });
    }
    setShowDatePicker(null);
  };

  const handleRecentSearchClick = (recent: RecentSearch) => {
    onCriteriaChange(recent.criteria);
  };

  const filteredAirports = airports.filter((a) => {
    const q = airportSearch.toLowerCase();
    return a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
  });

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatPassengers = (): string => {
    return `${criteria.adults} ${t('search.passengerCount.adults')}, ${criteria.children} ${t('search.passengerCount.children')}, ${criteria.infants} ${t('search.passengerCount.infants')}`;
  };

  const generateDates = (): string[] => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 180; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-[#F9FBF9]">
        <h1 className="text-xl font-bold text-[#1A1A1A]" aria-label={t('search.title')}>{t('search.title')}</h1>
      </header>

      <div className="flex gap-0 mx-4 mb-4 rounded-lg overflow-hidden border border-[#E6E8E7]" data-testid="trip-type-selector">
        {(['one-way', 'round-trip'] as TripType[]).map((type) => (
          <button key={type} type="button"
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${criteria.tripType === type ? 'bg-[#E12127] text-white' : 'bg-white text-[#1A1A1A]'}`}
            aria-label={type === 'one-way' ? t('search.tripType.oneWay') : t('search.tripType.roundTrip')}
            aria-pressed={criteria.tripType === type}
            onClick={() => handleTripTypeChange(type)}>
            {type === 'one-way' ? t('search.tripType.oneWay') : t('search.tripType.roundTrip')}
          </button>
        ))}
      </div>

      <div className="mx-4 bg-white rounded-2xl shadow-[0px_5px_10px_rgba(89,27,27,0.05)] p-4 flex flex-col gap-3">
        <button type="button" className="w-full text-left p-3 border border-[#E6E8E7] rounded-lg" aria-label={t('search.origin.placeholder')} data-testid="origin-field" onClick={() => setShowAirportPicker('origin')}>
          <span className="text-xs text-[#6B7280]">{t('search.origin.placeholder')}</span>
          <p className="text-[#1A1A1A] font-semibold">{criteria.origin ? `${criteria.origin.code} - ${criteria.origin.name}` : ''}</p>
        </button>

        <div className="flex justify-center">
          <button type="button" className="w-10 h-10 rounded-full border border-[#E6E8E7] flex items-center justify-center text-[#6B7280] hover:bg-gray-50" aria-label={t('search.swapAirports')} data-testid="swap-airports-action" onClick={handleSwap}>\u21C5</button>
        </div>

        <button type="button" className="w-full text-left p-3 border border-[#E6E8E7] rounded-lg" aria-label={t('search.destination.placeholder')} data-testid="destination-field" onClick={() => setShowAirportPicker('destination')}>
          <span className="text-xs text-[#6B7280]">{t('search.destination.placeholder')}</span>
          <p className="text-[#1A1A1A] font-semibold">{criteria.destination ? `${criteria.destination.code} - ${criteria.destination.name}` : ''}</p>
        </button>

        <div className="flex gap-4">
          <button type="button" className="flex-1 text-left p-3 border border-[#E6E8E7] rounded-lg" aria-label={t('search.departureDate.placeholder')} data-testid="departure-date-field"
            onClick={() => { if (!criteria.departureDate) { onCriteriaChange({ ...criteria, departureDate: getDefaultDepartureDate() }); } setShowDatePicker('departure'); }}>
            <span className="text-xs text-[#6B7280]">{t('search.departureDate.placeholder')}</span>
            <p className="text-[#1A1A1A] font-semibold">{formatDate(criteria.departureDate)}</p>
          </button>
          {criteria.tripType === 'round-trip' && (
            <button type="button" className="flex-1 text-left p-3 border border-[#E6E8E7] rounded-lg" aria-label={t('search.returnDate.placeholder')} data-testid="return-date-field" onClick={() => setShowDatePicker('return')}>
              <span className="text-xs text-[#6B7280]">{t('search.returnDate.placeholder')}</span>
              <p className="text-[#1A1A1A] font-semibold">{formatDate(criteria.returnDate)}</p>
            </button>
          )}
        </div>

        <button type="button" className="w-full text-left p-3 border border-[#E6E8E7] rounded-lg" aria-label={t('search.passengers.placeholder')} data-testid="passenger-count-field" onClick={() => setShowPassengerCounter(true)}>
          <span className="text-xs text-[#6B7280]">{t('search.passengerCount.adults')}</span>
          <p className="text-[#1A1A1A] font-semibold">{formatPassengers()}</p>
        </button>
      </div>

      {recentSearches.length > 0 && (
        <div className="mx-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-semibold text-[#1A1A1A]">{t('search.recentSearches.title')}</h2>
            <button type="button" className="text-sm text-[#E12127]" aria-label={t('search.recentSearches.clearAll')} data-testid="clear-recent-searches-action">{t('search.recentSearches.clearAll')}</button>
          </div>
          {recentSearches.map((item, idx) => (
            <button key={idx} type="button" className="w-full text-left p-3 border-b border-[#E6E8E7] hover:bg-gray-50" aria-label={t('search.recentSearches.title')} data-testid="recent-search-item" onClick={() => handleRecentSearchClick(item)}>
              <p className="font-semibold text-[#1A1A1A]" data-testid="recent-route-label">{item.route}</p>
              <p className="text-sm text-[#6B7280]" data-testid="recent-date-label">{item.date}</p>
              <p className="text-sm text-[#6B7280]" data-testid="recent-passenger-label">{item.passengers}</p>
            </button>
          ))}
        </div>
      )}

      <div className="mt-auto p-4">
        <button type="button" className={`w-full h-14 rounded-lg text-white font-semibold text-base transition-colors ${canSearch ? 'bg-[#E12127] hover:bg-[#c91d22]' : 'bg-gray-300 cursor-not-allowed'}`} disabled={!canSearch} aria-label={t('search.submit.aria')} data-testid="search-submit" onClick={handleSearch}>
          {loading ? t('common.loading') : t('search.submit')}
        </button>
      </div>

      {masterDataError && (
        <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" data-testid="master-data-error-message">
          <p className="text-sm text-red-700">{t('search.masterDataError')}</p>
          <button type="button" className="text-sm text-[#E12127] font-semibold mt-1" onClick={loadMasterData} aria-label={t('search.retry')}>{t('search.retry')}</button>
        </div>
      )}

      {searchError && (
        <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" data-testid="search-error-message">
          <p className="text-sm text-red-700">{t('search.searchError')}</p>
          <button type="button" className="text-sm text-[#E12127] font-semibold mt-1" onClick={handleSearch} aria-label={t('search.retry')}>{t('search.retry')}</button>
        </div>
      )}

      {showAirportPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-[480px] rounded-t-2xl max-h-[80vh] flex flex-col" role="dialog" aria-label={t('search.airportPicker.title')}>
            <div className="p-4 border-b border-[#E6E8E7] flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t('search.airportPicker.title')}</h3>
              <button type="button" className="text-[#6B7280] text-2xl" onClick={() => { setShowAirportPicker(null); setAirportSearch(''); }} aria-label={t('common.close')}>\u00D7</button>
            </div>
            <div className="p-4">
              <input type="text" className="w-full p-3 border border-[#E6E8E7] rounded-lg text-sm" placeholder={t('search.airportPicker.search')} aria-label={t('search.airportPicker.search')} value={airportSearch} onChange={(e) => setAirportSearch(e.target.value)} />
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {(['popular', 'domestic', 'international'] as const).map((group) => {
                const groupAirports = filteredAirports.filter((a) => a.group === group);
                if (groupAirports.length === 0) return null;
                const label = group === 'popular' ? t('search.airportPicker.popular') : group === 'domestic' ? t('search.airportPicker.domestic') : t('search.airportPicker.international');
                return (
                  <div key={group} className="mb-4">
                    <h4 className="text-xs font-semibold text-[#6B7280] mb-2 uppercase">{label}</h4>
                    {groupAirports.map((airport) => (
                      <button key={airport.code} type="button" className="w-full text-left p-3 hover:bg-gray-50 rounded-lg" aria-label={`${airport.code} - ${airport.name}`} onClick={() => handleSelectAirport(airport)}>
                        <span className="font-semibold">{airport.code}</span>
                        <span className="text-[#6B7280] ml-2">{airport.name}</span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-[480px] rounded-t-2xl max-h-[80vh] flex flex-col" role="dialog" aria-label={t('search.datePicker.title')}>
            <div className="p-4 border-b border-[#E6E8E7] flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t('search.datePicker.title')}</h3>
              <button type="button" className="text-[#6B7280] text-2xl" onClick={() => setShowDatePicker(null)} aria-label={t('common.close')}>\u00D7</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-7 gap-2">
              {generateDates().map((date) => {
                const d = new Date(date + 'T00:00:00');
                const isSelected = (showDatePicker === 'departure' && date === criteria.departureDate) || (showDatePicker === 'return' && date === criteria.returnDate);
                return (
                  <button key={date} type="button" className={`p-2 text-center rounded-lg text-sm ${isSelected ? 'bg-[#E12127] text-white' : 'hover:bg-gray-100'}`} aria-label={d.toLocaleDateString('vi-VN')} onClick={() => handleSelectDate(date)}>
                    <div className="font-semibold">{d.getDate()}</div>
                    <div className="text-xs text-[#6B7280]">{d.toLocaleDateString('vi-VN', { month: 'short' })}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showPassengerCounter && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-[480px] rounded-t-2xl p-4" role="dialog" aria-label={t('search.passengerCounter.title')}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('search.passengerCounter.title')}</h3>
              <button type="button" className="text-[#6B7280] text-2xl" onClick={() => setShowPassengerCounter(false)} aria-label={t('common.close')}>\u00D7</button>
            </div>
            {([{ key: 'adults' as const, label: t('search.passengerCount.adults'), min: 1, max: 4 }, { key: 'children' as const, label: t('search.passengerCount.children'), min: 0, max: 4 }, { key: 'infants' as const, label: t('search.passengerCount.infants'), min: 0, max: criteria.adults }]).map((item) => (
              <div key={item.key} className="flex justify-between items-center py-3 border-b border-[#E6E8E7]">
                <span className="font-semibold">{item.label}</span>
                <div className="flex items-center gap-3">
                  <button type="button" className="w-8 h-8 rounded-full border border-[#E6E8E7] flex items-center justify-center disabled:opacity-30" disabled={criteria[item.key] <= item.min} aria-label={`${item.label} gi\u1EA3m`} onClick={() => onCriteriaChange({ ...criteria, [item.key]: criteria[item.key] - 1 })}>\u2212</button>
                  <span className="w-8 text-center font-semibold">{criteria[item.key]}</span>
                  <button type="button" className="w-8 h-8 rounded-full border border-[#E6E8E7] flex items-center justify-center disabled:opacity-30" disabled={criteria[item.key] >= item.max} aria-label={`${item.label} t\u0103ng`} onClick={() => onCriteriaChange({ ...criteria, [item.key]: criteria[item.key] + 1 })}>+</button>
                </div>
              </div>
            ))}
            <button type="button" className="w-full mt-4 h-12 bg-[#E12127] text-white rounded-lg font-semibold" aria-label={t('common.confirm')} onClick={() => setShowPassengerCounter(false)}>{t('common.confirm')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
