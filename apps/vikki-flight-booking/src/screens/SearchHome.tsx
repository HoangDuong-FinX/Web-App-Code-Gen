import React, { useState, useMemo } from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import SegmentedControl from '../components/SegmentedControl';
import TouchableField from '../components/TouchableField';
import IconButton from '../components/IconButton';
import Button from '../components/Button';
import InlineError from '../components/InlineError';
import Spinner from '../components/Spinner';
import AlertNote from '../components/AlertNote';

export default function SearchHome(props: ScreenProps) {
  const { booking, setBooking, navigate, airports, cityPairs, masterDataLoading, masterDataError, loadMasterData, recentSearches, setRecentSearches, setAirportPickerMode, handleSearch, searchLoading } = props;
  const [origin, setOrigin] = useState(booking.searchParams?.origin ?? '');
  const [destination, setDestination] = useState(booking.searchParams?.destination ?? '');
  const [departureDate, setDepartureDate] = useState(booking.searchParams?.departureDate ?? '');
  const [returnDate, setReturnDate] = useState(booking.searchParams?.returnDate ?? '');
  const [tripTypeIdx, setTripTypeIdx] = useState(booking.tripType === 'round' ? 1 : 0);
  const [passengers, setPassengers] = useState(booking.searchParams?.passengers ?? { adults: 1, children: 0, infants: 0 });

  const tripType = tripTypeIdx === 0 ? 'oneway' as const : 'round' as const;
  const masterDataReady = !masterDataLoading && !masterDataError && airports.length > 0;

  const routeValid = useMemo(() => {
    if (!origin || !destination) return false;
    return cityPairs.some(p => p.origin === origin && p.destination === destination);
  }, [origin, destination, cityPairs]);

  const routeError = origin && destination && !routeValid && cityPairs.length > 0;
  const canSearch = masterDataReady && routeValid && !!departureDate && (tripType === 'oneway' || !!returnDate);

  const originAirport = airports.find(a => a.code === origin);
  const destAirport = airports.find(a => a.code === destination);
  const passengersTotal = passengers.adults + passengers.children + passengers.infants;

  const handleSwap = () => { const tmp = origin; setOrigin(destination); setDestination(tmp); };

  const handleSubmit = () => {
    if (!canSearch) return;
    handleSearch({ origin, destination, departureDate, returnDate: tripType === 'round' ? returnDate : undefined, passengers, tripType });
  };

  const handleRecentSearch = (rs: typeof recentSearches[0]) => {
    setOrigin(rs.origin); setDestination(rs.destination); setDepartureDate(rs.departureDate);
    setTripTypeIdx(rs.tripType === 'round' ? 1 : 0); setPassengers(rs.passengers);
  };

  return (
    <div className="screen">
      <div className="header-row">
        <Text variant="title-2" as="h1" ariaLabel={t('app.logo.aria')}>Vikki Flights</Text>
        <Text variant="footnote" as="span" ariaLabel={t('app.lang.current')}>{t('app.lang.label')}</Text>
      </div>

      <SegmentedControl options={[t('search.tripType.oneWay'), t('search.tripType.roundTrip')]} value={tripTypeIdx} onChange={setTripTypeIdx} ariaLabel={t('search.tripType.aria')} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-008)' }}>
        <div style={{ flex: 1 }}>
          <TouchableField label={t('search.origin.label')} value={originAirport ? `${originAirport.city} (${originAirport.code})` : undefined} onClick={() => { setAirportPickerMode('origin'); navigate('airport-picker'); }} ariaLabel={t('search.origin.aria')} />
        </div>
        <IconButton icon="swap" onClick={handleSwap} ariaLabel={t('search.swap.aria')} />
        <div style={{ flex: 1 }}>
          <TouchableField label={t('search.destination.label')} value={destAirport ? `${destAirport.city} (${destAirport.code})` : undefined} onClick={() => { setAirportPickerMode('destination'); navigate('airport-picker'); }} ariaLabel={t('search.destination.aria')} />
        </div>
      </div>

      <TouchableField label={t('search.passengers.label')} value={`${passengersTotal}`} onClick={() => navigate('passenger-picker')} ariaLabel={t('search.passengers.aria')} />

      <div style={{ display: 'flex', gap: 'var(--gap-008)' }}>
        <div style={{ flex: 1 }}>
          <TouchableField label={t('search.date.label')} value={departureDate || undefined} onClick={() => navigate('date-picker')} ariaLabel={t('search.date.aria')} />
        </div>
        {tripType === 'round' && (
          <div style={{ flex: 1 }}>
            <TouchableField label={t('search.returnDate.label')} value={returnDate || undefined} onClick={() => navigate('date-picker')} ariaLabel={t('search.returnDate.label')} />
          </div>
        )}
      </div>

      <Button variant="gradient" disabled={!canSearch || searchLoading} onClick={handleSubmit} ariaLabel={t('search.submit.aria')}>
        {searchLoading ? t('common.loading') : t('search.submit')}
      </Button>

      <InlineError visible={!!routeError} ariaLabel={t('search.routeError.aria')}>{t('search.routeError')}</InlineError>

      {recentSearches.length > 0 && (
        <div>
          <div className="header-row">
            <Text variant="headline">{t('search.recent.title')}</Text>
            <button type="button" onClick={() => setRecentSearches([])} aria-label={t('search.recent.clearAll.aria')} style={{ fontSize: 13, color: 'var(--main-primary)', fontWeight: 600 }}>{t('search.recent.clearAll')}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-008)', marginTop: 'var(--gap-008)' }}>
            {recentSearches.slice(0, 4).map((rs, i) => (
              <button key={i} type="button" onClick={() => handleRecentSearch(rs)} aria-label={`${rs.origin} - ${rs.destination} ${rs.departureDate}`} style={{ padding: '10px 12px', borderRadius: 'var(--radius-008)', border: '1px solid var(--line-normal)', background: 'var(--common-100)', textAlign: 'left', fontSize: 13 }}>
                {rs.origin} \u2192 {rs.destination} | {rs.departureDate}
              </button>
            ))}
          </div>
        </div>
      )}

      <Spinner visible={masterDataLoading} ariaLabel={t('search.masterDataLoading')} />
      <AlertNote visible={masterDataError} variant="error" actionLabel={t('search.masterDataError.retry')} onAction={loadMasterData} ariaLabel={t('search.masterDataError.aria')}>
        {t('search.masterDataError')}
      </AlertNote>
    </div>
  );
}
