import React, { useState, useEffect } from 'react';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { SegmentedControl } from '../components/SegmentedControl';
import { StatusNote } from '../components/StatusNote';
import { Layout } from '../components/Layout';
import { useStore } from '../store/store';
import { airports } from '../fixtures/airports';
import { cityPairs } from '../fixtures/cityPairs';

interface SearchProps {
  navigate: (screen: string) => void;
  t: Record<string, string>;
}

export const Search: React.FC<SearchProps> = ({ navigate, t }) => {
  const store = useStore();
  const [searchError, setSearchError] = useState<string | null>(null);
  const [masterDataError, setMasterDataError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load master data on mount
  useEffect(() => {
    // Simulate loading airports and city pairs
    try {
      // In real app, would fetch from API
      // For now, fixtures are available
    } catch (err) {
      setMasterDataError(t['search.masterDataError']);
    }
  }, [t]);

  const airportOptions = airports.map((a) => ({
    label: `${a.code} - ${a.name}`,
    value: a.code,
  }));

  const validCityPair =
    store.origin && store.destination
      ? cityPairs.some((cp) => cp.origin === store.origin && cp.destination === store.destination)
      : false;

  const canSearch = store.origin && store.destination && validCityPair && store.departDate;

  const handleSwapAirports = () => {
    const temp = store.origin;
    store.setOrigin(store.destination);
    store.setDestination(temp);
  };

  const handleSearch = async () => {
    if (!validCityPair) {
      setSearchError(t['search.noRoute']);
      return;
    }

    setLoading(true);
    setSearchError(null);

    try {
      // Simulate API call
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      store.setOutboundSession('session_outbound_001', expiresAt);
      store.addRecentSearch({
        origin: store.origin,
        destination: store.destination,
        tripType: store.tripType,
      });
      navigate('results');
    } catch (err) {
      setSearchError(t['search.error']);
    } finally {
      setLoading(false);
    }
  };

  const handleFillSampleData = () => {
    store.setOrigin('SGN');
    store.setDestination('HAN');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    store.setDepartDate(tomorrow.toISOString().split('T')[0]);
    if (store.tripType === 'roundTrip') {
      const returnDate = new Date(tomorrow);
      returnDate.setDate(returnDate.getDate() + 7);
      store.setReturnDate(returnDate.toISOString().split('T')[0]);
    }
  };

  const minDepartDate = new Date().toISOString().split('T')[0];
  const minReturnDate = store.departDate || minDepartDate;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Layout layoutType="stack" gap={24}>
        <Text variant="large-title" testId="search-page-title">
          {t['search.title']}
        </Text>

        <Layout layoutType="stack" gap={18}>
          <SegmentedControl
            options={[
              { label: t['search.roundTrip'], value: 'roundTrip' },
              { label: t['search.oneWay'], value: 'oneWay' },
            ]}
            value={store.tripType}
            onChange={(v) => store.setTripType(v as 'roundTrip' | 'oneWay')}
            testId="trip-type-selector"
          />

          <Layout layoutType="grid" columns="repeat(auto-fit, minmax(190px, 1fr))" gap={14}>
            <Select
              label={t['search.from']}
              labelVariant="subheadline"
              options={airportOptions}
              value={store.origin}
              onChange={(v) => store.setOrigin(v)}
              testId="origin-airport-select"
            />

            <Button
              variant="ghost"
              size="compact"
              onClick={handleSwapAirports}
              ariaLabel={t['search.swap']}
              testId="swap-airports-button"
            >
              ⇄
            </Button>

            <Select
              label={t['search.to']}
              labelVariant="subheadline"
              options={airportOptions}
              value={store.destination}
              onChange={(v) => store.setDestination(v)}
              testId="destination-airport-select"
            />

            <Input
              type="date"
              label={t['search.departDate']}
              labelVariant="subheadline"
              value={store.departDate}
              onChange={(v) => store.setDepartDate(v)}
              min={minDepartDate}
              testId="departure-date-input"
            />

            {store.tripType === 'roundTrip' && (
              <Input
                type="date"
                label={t['search.returnDate']}
                labelVariant="subheadline"
                value={store.returnDate}
                onChange={(v) => store.setReturnDate(v)}
                min={minReturnDate}
                testId="return-date-input"
              />
            )}

            <Layout layoutType="stack" gap={6}>
              <Text variant="subheadline">{t['search.adults']}</Text>
              <Layout layoutType="stack" direction="row" gap={10} alignItems="center" justifyContent="space-between">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => store.setAdultCount(Math.max(1, store.adultCount - 1))}
                  ariaLabel={t['passengers.gender']}
                  testId="adult-decrement"
                >
                  −
                </Button>
                <Text variant="headline" testId="adult-count-display">
                  {store.adultCount}
                </Text>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => store.setAdultCount(Math.min(4, store.adultCount + 1))}
                  ariaLabel={t['passengers.gender']}
                  testId="adult-increment"
                >
                  +
                </Button>
              </Layout>
            </Layout>
          </Layout>

          <Button
            variant="primary"
            size="large"
            onClick={handleSearch}
            disabled={!canSearch || loading}
            testId="search-submit-button"
          >
            {loading ? 'Tải...' : t['search.submit']}
          </Button>

          <StatusNote
            tone="error"
            visible={!!masterDataError}
            testId="search-error-alert"
          >
            {masterDataError}
          </StatusNote>

          <StatusNote
            tone="error"
            visible={!!searchError}
            testId="search-error-alert"
          >
            {searchError}
          </StatusNote>
        </Layout>

        {store.recentSearches.length > 0 && (
          <Layout layoutType="stack" gap={12}>
            <Text variant="headline">{t['search.recentSearches']}</Text>
            {store.recentSearches.map((search, idx) => (
              <Button
                key={idx}
                variant="tertiary"
                size="medium"
                onClick={() => {
                  store.setOrigin(search.origin);
                  store.setDestination(search.destination);
                  store.setTripType(search.tripType as 'roundTrip' | 'oneWay');
                }}
                testId="recent-search-item"
              >
                {search.origin} → {search.destination} ({search.tripType === 'roundTrip' ? 'Khứ hồi' : 'Một chiều'})
              </Button>
            ))}
            <Button
              variant="tertiary"
              size="small"
              onClick={() => store.clearRecentSearches()}
              testId="clear-searches-button"
            >
              {t['search.clearAll']}
            </Button>
          </Layout>
        )}
      </Layout>
    </div>
  );
};
