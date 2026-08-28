import React, { useState, useEffect } from 'react';
import { ScreenId } from '../App';
import { useStore } from '../store/useStore';
import { t } from '../i18n';
import { loadAirports, loadCityPairs, submitSearch } from '../sdk/http';
import { Airport, CityPair } from '../types';
import { formatDate, getDefaultDepartureDate, getDefaultReturnDate } from '../utils/format';

interface Props {
  navigate: (screen: ScreenId) => void;
}

export const HomeSearch: React.FC<Props> = ({ navigate }) => {
  const store = useStore();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cityPairs, setCityPairs] = useState<CityPair[]>([]);
  const [masterDataLoaded, setMasterDataLoaded] = useState(false);
  const [masterDataError, setMasterDataError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOriginPicker, setShowOriginPicker] = useState(false);
  const [showDestPicker, setShowDestPicker] = useState(false);
  const [noRouteError, setNoRouteError] = useState(false);

  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>(store.tripType);
  const [origin, setOrigin] = useState<string | null>(store.origin);
  const [originName, setOriginName] = useState<string | null>(store.originName);
  const [destination, setDestination] = useState<string | null>(store.destination);
  const [destinationName, setDestinationName] = useState<string | null>(store.destinationName);
  const [departureDate, setDepartureDate] = useState<string>(store.departureDate ?? getDefaultDepartureDate());
  const [returnDate, setReturnDate] = useState<string>(store.returnDate ?? getDefaultReturnDate(store.departureDate ?? getDefaultDepartureDate()));
  const [adults, setAdults] = useState(store.adults);
  const [children, setChildren] = useState(store.children);
  const [infants, setInfants] = useState(store.infants);

  useEffect(() => {
    let cancelled = false;
    async function loadMasterData() {
      try {
        const [airportData, cityPairData] = await Promise.all([loadAirports(), loadCityPairs()]);
        if (!cancelled) {
          setAirports(airportData);
          setCityPairs(cityPairData);
          setMasterDataLoaded(true);
          setMasterDataError(null);
        }
      } catch {
        if (!cancelled) {
          setMasterDataError(t('home.error.masterData'));
        }
      }
    }
    loadMasterData();
    return () => { cancelled = true; };
  }, []);

  const isRouteValid = (orig: string | null, dest: string | null): boolean => {
    if (!orig || !dest) return false;
    return cityPairs.some((cp) => cp.origin === orig && cp.destination === dest);
  };

  const handleSwap = () => {
    const tmpCode = origin;
    const tmpName = originName;
    setOrigin(destination);
    setOriginName(destinationName);
    setDestination(tmpCode);
    setDestinationName(tmpName);
    setNoRouteError(!isRouteValid(destination, tmpCode));
  };

  const handleSelectOrigin = (airport: Airport) => {
    setOrigin(airport.code);
    setOriginName(`${airport.city} (${airport.code})`);
    setShowOriginPicker(false);
    if (destination) {
      setNoRouteError(!isRouteValid(airport.code, destination));
    }
  };

  const handleSelectDestination = (airport: Airport) => {
    setDestination(airport.code);
    setDestinationName(`${airport.city} (${airport.code})`);
    setShowDestPicker(false);
    if (origin) {
      setNoRouteError(!isRouteValid(origin, airport.code));
    }
  };

  const handleSearch = async () => {
    if (!origin || !destination || noRouteError || !masterDataLoaded) return;
    setLoading(true);
    setSearchError(null);
    try {
      const result = await submitSearch({
        origin,
        destination,
        departureDate,
        passengers: { adults, children, infants },
      });
      store.update({
        tripType,
        origin,
        originName,
        destination,
        destinationName,
        departureDate,
        returnDate: tripType === 'round-trip' ? returnDate : null,
        adults,
        children,
        infants,
        sessionId: result.sessionId,
        expiresAt: result.expiresAt,
        offers: result.offers.map((o) => ({
          offerId: o.offerId,
          flightNumber: o.flightNumber,
          departureTime: o.departureTime,
          arrivalTime: o.arrivalTime,
          duration: o.duration,
          departureAirport: o.departureAirport,
          arrivalAirport: o.arrivalAirport,
          departureAirportName: o.departureAirportName,
          arrivalAirportName: o.arrivalAirportName,
          airlineLogo: o.airlineLogo,
          fareClassName: o.fareClassName,
          farePrice: o.farePrice,
        })),
      });

      if (tripType === 'round-trip') {
        const returnResult = await submitSearch({
          origin: destination,
          destination: origin,
          departureDate: returnDate,
          passengers: { adults, children, infants },
        });
        store.update({
          returnSessionId: returnResult.sessionId,
          returnOffers: returnResult.offers.map((o) => ({
            offerId: o.offerId,
            flightNumber: o.flightNumber,
            departureTime: o.departureTime,
            arrivalTime: o.arrivalTime,
            duration: o.duration,
            departureAirport: o.departureAirport,
            arrivalAirport: o.arrivalAirport,
            departureAirportName: o.departureAirportName,
            arrivalAirportName: o.arrivalAirportName,
            airlineLogo: o.airlineLogo,
            fareClassName: o.fareClassName,
            farePrice: o.farePrice,
          })),
        });
      }
      navigate('flight-results');
    } catch {
      setSearchError(t('home.error.search'));
    } finally {
      setLoading(false);
    }
  };

  const canSearch = masterDataLoaded && origin && destination && !noRouteError && !loading;

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>{t('home.title')}</h1>

      {/* Trip type selector */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderRadius: 8, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
        <button
          type="button"
          onClick={() => setTripType('one-way')}
          style={{
            flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
            backgroundColor: tripType === 'one-way' ? '#E31837' : '#fff',
            color: tripType === 'one-way' ? '#fff' : '#333',
            fontWeight: 'bold', fontSize: 14,
          }}
          aria-pressed={tripType === 'one-way'}
        >
          {t('home.tripType.oneWay')}
        </button>
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          style={{
            flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
            backgroundColor: tripType === 'round-trip' ? '#E31837' : '#fff',
            color: tripType === 'round-trip' ? '#fff' : '#333',
            fontWeight: 'bold', fontSize: 14,
          }}
          aria-pressed={tripType === 'round-trip'}
        >
          {t('home.tripType.roundTrip')}
        </button>
      </div>

      {/* Origin/Destination */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, position: 'relative' }}>
        <button
          type="button"
          onClick={() => setShowOriginPicker(!showOriginPicker)}
          aria-label={t('home.origin.label')}
          style={{ padding: 12, border: '1px solid #e0e0e0', borderRadius: 8, textAlign: 'left', backgroundColor: '#fff', cursor: 'pointer', fontSize: 14 }}
        >
          <span style={{ fontSize: 11, color: '#666', display: 'block' }}>{t('home.origin.label')}</span>
          {originName ?? t('home.origin.placeholder')}
        </button>

        <button
          type="button"
          onClick={handleSwap}
          aria-label={t('home.swap.ariaLabel')}
          style={{ alignSelf: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid #e0e0e0', backgroundColor: '#fff', cursor: 'pointer', fontSize: 18 }}
        >
          ⇅
        </button>

        <button
          type="button"
          onClick={() => setShowDestPicker(!showDestPicker)}
          aria-label={t('home.destination.label')}
          style={{ padding: 12, border: `1px solid ${noRouteError ? '#c62828' : '#e0e0e0'}`, borderRadius: 8, textAlign: 'left', backgroundColor: '#fff', cursor: 'pointer', fontSize: 14 }}
        >
          <span style={{ fontSize: 11, color: '#666', display: 'block' }}>{t('home.destination.label')}</span>
          {destinationName ?? t('home.destination.placeholder')}
        </button>
        {noRouteError && (
          <span style={{ color: '#c62828', fontSize: 12 }}>{t('home.error.noRoute')}</span>
        )}
      </div>

      {/* Airport picker modals */}
      {showOriginPicker && (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 8, marginBottom: 16, maxHeight: 200, overflow: 'auto', backgroundColor: '#fafafa' }}>
          {airports.map((a) => (
            <button
              key={a.code}
              type="button"
              onClick={() => handleSelectOrigin(a)}
              style={{ display: 'block', width: '100%', padding: '8px 12px', border: 'none', backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', fontSize: 13 }}
            >
              {a.city} ({a.code}) - {a.name}
            </button>
          ))}
        </div>
      )}
      {showDestPicker && (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 8, marginBottom: 16, maxHeight: 200, overflow: 'auto', backgroundColor: '#fafafa' }}>
          {airports.map((a) => (
            <button
              key={a.code}
              type="button"
              onClick={() => handleSelectDestination(a)}
              style={{ display: 'block', width: '100%', padding: '8px 12px', border: 'none', backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', fontSize: 13 }}
            >
              {a.city} ({a.code}) - {a.name}
            </button>
          ))}
        </div>
      )}

      {/* Dates */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>{t('home.departureDate.label')}</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => {
              setDepartureDate(e.target.value);
              if (tripType === 'round-trip' && e.target.value > returnDate) {
                setReturnDate(getDefaultReturnDate(e.target.value));
              }
            }}
            aria-label={t('home.departureDate.label')}
            style={{ width: '100%', padding: 10, border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }}
          />
        </div>
        {tripType === 'round-trip' && (
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>{t('home.returnDate.label')}</label>
            <input
              type="date"
              value={returnDate}
              min={departureDate}
              onChange={(e) => setReturnDate(e.target.value)}
              aria-label={t('home.returnDate.label')}
              style={{ width: '100%', padding: 10, border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }}
            />
          </div>
        )}
      </div>

      {/* Passengers */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>{t('home.passengers.label')}</label>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} aria-label="Adults" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }}>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} NL</option>)}
            </select>
            <select value={children} onChange={(e) => setChildren(Number(e.target.value))} aria-label="Children" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }}>
              {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} TE</option>)}
            </select>
            <select value={infants} onChange={(e) => setInfants(Number(e.target.value))} aria-label="Infants" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e0e0e0' }}>
              {Array.from({ length: adults + 1 }, (_, i) => i).map((n) => <option key={n} value={n}>{n} EB</option>)}
            </select>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>{t('home.fareClass.label')}</label>
          <select disabled aria-label={t('home.fareClass.label')} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e0e0e0', backgroundColor: '#f5f5f5' }}>
            <option>Eco</option>
          </select>
        </div>
      </div>

      {/* Error alerts */}
      {masterDataError && (
        <div role="alert" style={{ padding: 12, backgroundColor: '#ffebee', borderRadius: 8, marginBottom: 16, color: '#c62828', fontSize: 13 }}>
          {masterDataError}
          <button type="button" onClick={() => window.location.reload()} style={{ marginLeft: 8, color: '#c62828', textDecoration: 'underline', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 13 }}>
            {t('home.retry')}
          </button>
        </div>
      )}
      {searchError && (
        <div role="alert" style={{ padding: 12, backgroundColor: '#ffebee', borderRadius: 8, marginBottom: 16, color: '#c62828', fontSize: 13 }}>
          {searchError}
          <button type="button" onClick={handleSearch} style={{ marginLeft: 8, color: '#c62828', textDecoration: 'underline', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 13 }}>
            {t('home.retry')}
          </button>
        </div>
      )}

      {/* Search button */}
      <button
        type="button"
        onClick={handleSearch}
        disabled={!canSearch}
        aria-label={t('home.search.ariaLabel')}
        style={{
          width: '100%', padding: 14, borderRadius: 8, border: 'none',
          backgroundColor: canSearch ? '#E31837' : '#e0e0e0',
          color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: canSearch ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? '...' : t('home.search.button')}
      </button>
    </div>
  );
};
