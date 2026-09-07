import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { loadAirports, loadCityPairs, submitSearch } from '../fixtures';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import SegmentedControl from '../components/SegmentedControl';
import AlertNote from '../components/AlertNote';

function Search() {
  const store = useStore();
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [origin, setOrigin] = useState('SGN');
  const [destination, setDestination] = useState('DLI');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [airports, setAirports] = useState<any[]>([]);
  const [cityPairs, setCityPairs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const ap = await loadAirports();
        const cp = await loadCityPairs();
        setAirports(ap);
        setCityPairs(cp);
      } catch (err) {
        setError('master-data-error');
      }
    };
    load();
  }, []);

  const isValidRoute = cityPairs.some(
    (pair) => pair.origin === origin && pair.destination === destination
  );

  const handleSearch = async () => {
    if (!isValidRoute) return;
    setLoading(true);
    try {
      const result = await submitSearch();
      store.setSearchCriteria({
        trip_type: tripType,
        origin,
        destination,
        departure_date: '2026-08-20',
        return_date: '2026-08-25',
        adult_count: adults,
        child_count: children,
        infant_count: 0,
      });
      store.setOutboundSession(result);
      store.setCurrentScreen('results');
    } catch (err) {
      setError('search-error');
    } finally {
      setLoading(false);
    }
  };

  const originAirport = airports.find((a) => a.code === origin);
  const destAirport = airports.find((a) => a.code === destination);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Text variant="title-1" semantic="h1">
        {t('search.title')}
      </Text>
      <div className="mt-4 space-y-3">
        <SegmentedControl
          options={[
            { label: t('search.round-trip'), value: 'round-trip' },
            { label: t('search.one-way'), value: 'one-way' },
          ]}
          value={tripType}
          onChange={(v) => setTripType(v as 'one-way' | 'round-trip')}
          ariaLabel={t('search.trip-type')}
          testId="trip-type-toggle"
        />
        <Button
          variant="secondary"
          ariaLabel={t('search.origin')}
          testId="origin-airport-button"
        >
          {t('search.origin', {
            code: origin,
            city: originAirport?.city || 'Select',
          })}
        </Button>
        <Button
          variant="ghost"
          ariaLabel={t('search.swap')}
          testId="swap-airports-button"
          onClick={() => {
            const temp = origin;
            setOrigin(destination);
            setDestination(temp);
          }}
        >
          ⇄
        </Button>
        <Button
          variant="secondary"
          ariaLabel={t('search.destination')}
          testId="destination-airport-button"
        >
          {t('search.destination', {
            code: destination,
            city: destAirport?.city || 'Select',
          })}
        </Button>
        {!isValidRoute && (
          <div className="text-red-600 text-sm font-medium" data-testid="invalid-route-error">
            {t('search.invalid-route')}
          </div>
        )}
        <Button variant="secondary" testId="passenger-count-button">
          {t('search.passenger-count', {
            adults,
            children,
          })}
        </Button>
        <Button variant="secondary" testId="departure-date-button">
          {t('search.departure-date', { date: '2026-08-20' })}
        </Button>
        {tripType === 'round-trip' && (
          <Button variant="secondary" testId="return-date-button">
            {t('search.return-date', { date: '2026-08-25' })}
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleSearch}
          disabled={!isValidRoute || loading}
          ariaLabel={t('search.button')}
          testId="search-button"
        >
          {t('search.button')}
        </Button>
      </div>
      <AlertNote visible={error === 'master-data-error'} testId="master-data-error">
        {t('search.master-data-error')}
      </AlertNote>
      <AlertNote visible={error === 'search-error'} testId="search-error">
        {t('search.error')}
      </AlertNote>
    </div>
  );
}

export default Search;
