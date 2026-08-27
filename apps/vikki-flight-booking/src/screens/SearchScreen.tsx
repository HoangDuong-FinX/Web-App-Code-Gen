import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../i18n';
import { useBooking } from '../context/BookingContext';
import { TopBar } from '../components/TopBar';
import { TripTypeToggle } from '../components/shared';
import { InputField } from '../components/shared';
import { SwapButton } from '../components/shared';
import { ButtonBig } from '../components/shared';
import { InlineError } from '../components/shared';
import { BottomNavBar } from '../components/shared';
import { LocationPickerModal } from '../components/LocationPickerModal';
import { DatePickerModal } from '../components/DatePickerModal';
import { PassengerCountModal } from '../components/PassengerCountModal';
import { fetchAirports, fetchCityPairs, searchFlights } from '../api';
import { fixtureAirports, fixtureCityPairs } from '../fixtures/airports';
import type { Airport, CityPair, TripType } from '../types';

interface SearchScreenProps {
  onNavigate: (screen: 'results') => void;
}

export function SearchScreen({ onNavigate }: SearchScreenProps) {
  const { t } = useI18n();
  const { state, dispatch } = useBooking();

  // Local state
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cityPairs, setCityPairs] = useState<CityPair[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationMode, setLocationMode] = useState<'origin' | 'destination'>('origin');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<'departure' | 'return'>('departure');
  const [showPaxModal, setShowPaxModal] = useState(false);

  // Load airports and city pairs on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [airportsData, pairsData] = await Promise.all([
          fetchAirports(),
          fetchCityPairs(),
        ]);
        if (!cancelled) {
          setAirports(airportsData);
          setCityPairs(pairsData);
        }
      } catch {
        // Fallback to fixtures
        if (!cancelled) {
          setAirports(fixtureAirports);
          setCityPairs(fixtureCityPairs);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const tripTypeLabel = state.tripType === 'oneway'
    ? t('search.tripType.oneway')
    : t('search.tripType.round');

  const handleTripTypeChange = (val: string) => {
    const type: TripType = val === t('search.tripType.round') ? 'round' : 'oneway';
    dispatch({ type: 'SET_TRIP_TYPE', payload: type });
  };

  const handleSwap = () => {
    dispatch({ type: 'SWAP_LOCATIONS' });
  };

  const handleOriginTap = () => {
    setLocationMode('origin');
    setShowLocationPicker(true);
  };

  const handleDestinationTap = () => {
    setLocationMode('destination');
    setShowLocationPicker(true);
  };

  const handleLocationSelect = (airport: Airport) => {
    if (locationMode === 'origin') {
      dispatch({ type: 'SET_ORIGIN', payload: airport });
    } else {
      dispatch({ type: 'SET_DESTINATION', payload: airport });
    }
  };

  const handleDepartureDateTap = () => {
    setDatePickerTarget('departure');
    setShowDatePicker(true);
  };

  const handleReturnDateTap = () => {
    setDatePickerTarget('return');
    setShowDatePicker(true);
  };

  const handleDateSelect = (date: string) => {
    if (datePickerTarget === 'departure') {
      dispatch({ type: 'SET_DEPARTURE_DATE', payload: date });
    } else {
      dispatch({ type: 'SET_RETURN_DATE', payload: date });
    }
  };

  const handlePaxConfirm = (count: typeof state.passengerCount) => {
    dispatch({ type: 'SET_PASSENGER_COUNT', payload: count });
  };

  const formatPassengerSummary = (): string => {
    const { adults, children, infants } = state.passengerCount;
    let text = `${adults} ${t('passengers.type.adult')}`;
    if (children > 0) text += `, ${children} ${t('passengers.type.child')}`;
    if (infants > 0) text += `, ${infants} ${t('passengers.type.infant')}`;
    return text;
  };

  const validate = (): string | null => {
    if (!state.origin) return t('error.originRequired');
    if (!state.destination) return t('error.destinationRequired');
    if (!state.departureDate) return t('error.departureDateRequired');
    if (state.tripType === 'round') {
      if (!state.returnDate) return t('error.returnDateRequired');
      if (state.returnDate <= state.departureDate) return t('error.returnDateAfterDeparture');
    }
    return null;
  };

  const handleSearch = async () => {
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const response = await searchFlights({
        origin: state.origin!.code,
        destination: state.destination!.code,
        departureDate: state.departureDate,
        adults: state.passengerCount.adults,
        children: state.passengerCount.children,
        infants: state.passengerCount.infants,
      });
      dispatch({
        type: 'SET_OUTBOUND_SESSION',
        payload: {
          sessionId: response.session_id,
          expiresAt: response.expires_at,
          offers: response.offers.map((o) => ({
            offerId: o.offer_id,
            airline: o.airline,
            airlineLogo: o.airline_logo,
            flightNumber: o.flight_number,
            departureTime: o.departure_time,
            arrivalTime: o.arrival_time,
            duration: o.duration,
            stops: o.stops,
            price: o.price_amount,
          })),
        },
      });
      onNavigate('results');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('HTTP')) {
        setError(t('error.searchFailed'));
      } else {
        setError(t('error.generic'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Date constraints: 28-day window for departure, 6-month for return
  const today = new Date().toISOString().split('T')[0];
  const maxDeparture = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 28);
    return d.toISOString().split('T')[0];
  })();
  const maxReturn = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  })();

  return (
    <div className="screen screen--search">
      <TopBar title={t('topbar.search')} ariaLabel={t('search.submit.ariaLabel')} />

      <div className="screen__content">
        <TripTypeToggle
          options={[t('search.tripType.oneway'), t('search.tripType.round')]}
          value={state.tripType === 'oneway' ? t('search.tripType.oneway') : t('search.tripType.round')}
          onChange={handleTripTypeChange}
          ariaLabel={t('search.tripTypeLabel')}
        />

        <InputField
          label={t('search.origin.label')}
          value={state.origin ? `${state.origin.code} - ${state.origin.city}` : ''}
          placeholder={t('search.origin.placeholder')}
          type="selector"
          readOnly
          ariaLabel={t('search.origin.label')}
          onTap={handleOriginTap}
        />

        <SwapButton onClick={handleSwap} ariaLabel={t('search.swap.ariaLabel')} />

        <InputField
          label={t('search.destination.label')}
          value={state.destination ? `${state.destination.code} - ${state.destination.city}` : ''}
          placeholder={t('search.destination.placeholder')}
          type="selector"
          readOnly
          ariaLabel={t('search.destination.label')}
          onTap={handleDestinationTap}
        />

        <InputField
          label={t('search.departureDate.label')}
          value={state.departureDate}
          placeholder={t('search.date.placeholder')}
          type="selector"
          readOnly
          ariaLabel={t('search.departureDate.label')}
          onTap={handleDepartureDateTap}
        />

        {state.tripType === 'round' && (
          <InputField
            label={t('search.returnDate.label')}
            value={state.returnDate}
            placeholder={t('search.date.placeholder')}
            type="selector"
            readOnly
            ariaLabel={t('search.returnDate.label')}
            onTap={handleReturnDateTap}
          />
        )}

        <InputField
          label={t('search.passengers.label')}
          value={formatPassengerSummary()}
          placeholder={t('search.passengers.placeholder')}
          type="selector"
          readOnly
          ariaLabel={t('search.passengers.label')}
          onTap={() => setShowPaxModal(true)}
        />

        <ButtonBig
          variant={loading ? 'Disabled' : 'Active'}
          onClick={handleSearch}
          ariaLabel={t('search.submit.ariaLabel')}
          loading={loading}
        >
          {t('search.submit')}
        </ButtonBig>

        <InlineError visible={!!error}>{error}</InlineError>
      </div>

      <BottomNavBar activeTab="Home" />

      {/* Modals */}
      <LocationPickerModal
        open={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        airports={airports}
        cityPairs={cityPairs}
        currentOrigin={state.origin?.code}
        mode={locationMode}
        onSelect={handleLocationSelect}
      />

      <DatePickerModal
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleDateSelect}
        minDate={datePickerTarget === 'return' ? (state.departureDate || today) : today}
        maxDate={datePickerTarget === 'departure' ? maxDeparture : maxReturn}
        initialDate={datePickerTarget === 'departure' ? state.departureDate : state.returnDate}
      />

      <PassengerCountModal
        open={showPaxModal}
        onClose={() => setShowPaxModal(false)}
        value={state.passengerCount}
        onConfirm={handlePaxConfirm}
      />
    </div>
  );
}
