import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { ScreenId, BookingState, SearchParams, FlightOffer, SearchSession, PassengerData, AncillaryOption, AncillarySelection, SeatSelection, RecentSearch, Airport, CityPair } from './types';
import { t } from './i18n';
import { httpGet, httpPost, unwrap } from './sdk/http';
import { startPayment, pollTransactionId } from './sdk/payment';
import SearchHome from './screens/SearchHome';
import AirportPicker from './screens/AirportPicker';
import DatePicker from './screens/DatePicker';
import PassengerPicker from './screens/PassengerPicker';
import SelectFlight from './screens/SelectFlight';
import BookingSummary from './screens/BookingSummary';
import EnterPassengers from './screens/EnterPassengers';
import ServicesHub from './screens/ServicesHub';
import SeatMap from './screens/SeatMap';
import MealSelection from './screens/MealSelection';
import BaggageSelection from './screens/BaggageSelection';
import ReviewDetail from './screens/ReviewDetail';
import CheckoutPay from './screens/CheckoutPay';
import ResultSuccess from './screens/ResultSuccess';
import ResultFailure from './screens/ResultFailure';
import ResultPartial from './screens/ResultPartial';
import HoldExpired from './screens/HoldExpired';
import ErrorMasterData from './screens/ErrorMasterData';
import './styles/index.css';

const initialBookingState: BookingState = {
  tripType: 'oneway',
  searchParams: null,
  outboundSession: null,
  returnSession: null,
  selectedOutboundOffer: null,
  selectedReturnOffer: null,
  passengers: [],
  ancillarySelections: [],
  seatSelections: [],
  returnAncillarySelections: [],
  returnSeatSelections: [],
  vatRequested: false,
  bookingKeys: {},
  paymentResult: null,
  transactionId: null,
};

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('search-home');
  const [booking, setBooking] = useState<BookingState>(initialBookingState);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cityPairs, setCityPairs] = useState<CityPair[]>([]);
  const [masterDataLoading, setMasterDataLoading] = useState(true);
  const [masterDataError, setMasterDataError] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [airportPickerMode, setAirportPickerMode] = useState<'origin' | 'destination'>('origin');
  const [ancillaryOptions, setAncillaryOptions] = useState<AncillaryOption[]>([]);
  const [returnAncillaryOptions, setReturnAncillaryOptions] = useState<AncillaryOption[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [paymentFailureReason, setPaymentFailureReason] = useState('');
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback((target: ScreenId) => { setScreen(target); }, []);

  const loadMasterData = useCallback(async () => {
    setMasterDataLoading(true);
    setMasterDataError(false);
    try {
      const [airportsRes, pairsRes] = await Promise.all([
        httpGet<Airport[]>('/airports', 'wrapper'),
        httpGet<CityPair[]>('/city-pairs', 'wrapper'),
      ]);
      setAirports(unwrap(airportsRes));
      setCityPairs(unwrap(pairsRes));
      setMasterDataLoading(false);
    } catch {
      setMasterDataError(true);
      setMasterDataLoading(false);
    }
  }, []);

  useEffect(() => { loadMasterData(); }, [loadMasterData]);

  const startHoldTimer = useCallback((expiresAt: string) => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    const ms = new Date(expiresAt).getTime() - Date.now();
    if (ms <= 0) { navigate('hold-expired'); return; }
    holdTimerRef.current = setTimeout(() => { navigate('hold-expired'); }, ms);
  }, [navigate]);

  const resetBooking = useCallback(() => {
    setBooking(initialBookingState);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    navigate('search-home');
  }, [navigate]);

  const handleSearch = useCallback(async (params: SearchParams) => {
    setSearchLoading(true);
    try {
      const outboundRes = await httpPost<SearchSession>('/search', {
        origin: params.origin, destination: params.destination, departure_date: params.departureDate,
        adult_count: params.passengers.adults, child_count: params.passengers.children, infant_count: params.passengers.infants,
      }, 'booking');
      const outbound = unwrap(outboundRes);
      let returnSession: SearchSession | null = null;
      if (params.tripType === 'round' && params.returnDate) {
        const returnRes = await httpPost<SearchSession>('/search', {
          origin: params.destination, destination: params.origin, departure_date: params.returnDate,
          adult_count: params.passengers.adults, child_count: params.passengers.children, infant_count: params.passengers.infants,
        }, 'booking');
        returnSession = unwrap(returnRes);
      }
      setBooking(prev => ({ ...prev, tripType: params.tripType, searchParams: params, outboundSession: outbound, returnSession, selectedOutboundOffer: null, selectedReturnOffer: null }));
      setRecentSearches(prev => [{ ...params }, ...prev.filter(s => s.origin !== params.origin || s.destination !== params.destination)].slice(0, 4));
      startHoldTimer(outbound.expiresAt);
      setSearchLoading(false);
      navigate('select-flight');
    } catch {
      setSearchLoading(false);
    }
  }, [navigate, startHoldTimer]);

  const handleSelectOutbound = useCallback((offer: FlightOffer) => {
    setBooking(prev => ({ ...prev, selectedOutboundOffer: offer }));
    if (booking.tripType === 'round') { navigate('select-return-flight'); } else { navigate('booking-summary'); }
  }, [booking.tripType, navigate]);

  const handleSelectReturn = useCallback((offer: FlightOffer) => {
    setBooking(prev => ({ ...prev, selectedReturnOffer: offer }));
    navigate('booking-summary');
  }, [navigate]);

  const handleSubmitPassengers = useCallback(async (passengers: PassengerData[]) => {
    try {
      const body = { passengers: passengers.map(p => ({ last_name: p.lastName, first_name: p.firstName, gender: p.gender, date_of_birth: p.dateOfBirth || null, phone: p.phone, email: p.email })) };
      const res = await httpPost<{ passengers: { passenger_id: string }[] }>(`/sessions/${booking.outboundSession?.sessionId}/passengers`, body, 'booking');
      const data = unwrap(res);
      const withIds = passengers.map((p, i) => ({ ...p, passengerId: data.passengers[i]?.passenger_id }));
      if (booking.tripType === 'round' && booking.returnSession) {
        const res2 = await httpPost<{ passengers: { passenger_id: string }[] }>(`/sessions/${booking.returnSession.sessionId}/passengers`, body, 'booking');
        unwrap(res2);
      }
      setBooking(prev => ({ ...prev, passengers: withIds }));
      navigate('services-hub');
      return { success: true };
    } catch {
      return { success: false };
    }
  }, [booking.outboundSession, booking.returnSession, booking.tripType, navigate]);

  const handlePay = useCallback(async () => {
    try {
      const outboundResult = await startPayment({ sessionId: booking.outboundSession?.sessionId ?? '', offerId: booking.selectedOutboundOffer?.offerId ?? '' });
      if (!outboundResult.isSuccess) { setPaymentFailureReason(outboundResult.error?.message ?? ''); navigate('result-failure'); return; }
      if (booking.tripType === 'round' && booking.returnSession && booking.selectedReturnOffer) {
        const returnResult = await startPayment({ sessionId: booking.returnSession.sessionId, offerId: booking.selectedReturnOffer.offerId });
        if (!returnResult.isSuccess) {
          const txId = outboundResult.paymentSessionId ? await pollTransactionId(outboundResult.paymentSessionId) : null;
          setBooking(prev => ({ ...prev, transactionId: txId, paymentResult: outboundResult }));
          navigate('result-partial'); return;
        }
        const txId = returnResult.paymentSessionId ? await pollTransactionId(returnResult.paymentSessionId) : null;
        setBooking(prev => ({ ...prev, transactionId: txId, paymentResult: returnResult }));
      } else {
        const txId = outboundResult.paymentSessionId ? await pollTransactionId(outboundResult.paymentSessionId) : null;
        setBooking(prev => ({ ...prev, transactionId: txId, paymentResult: outboundResult }));
      }
      navigate('result-success');
    } catch {
      setPaymentFailureReason(t('common.error.generic'));
      navigate('result-failure');
    }
  }, [booking, navigate]);

  const screenProps = { booking, setBooking, navigate, airports, cityPairs, masterDataLoading, masterDataError, loadMasterData, recentSearches, setRecentSearches, airportPickerMode, setAirportPickerMode, handleSearch, searchLoading, handleSelectOutbound, handleSelectReturn, handleSubmitPassengers, handlePay, ancillaryOptions, setAncillaryOptions, returnAncillaryOptions, setReturnAncillaryOptions, resetBooking, paymentFailureReason };

  const renderScreen = () => {
    switch (screen) {
      case 'search-home': return <SearchHome {...screenProps} />;
      case 'airport-picker': return <AirportPicker {...screenProps} />;
      case 'date-picker': return <DatePicker {...screenProps} />;
      case 'passenger-picker': return <PassengerPicker {...screenProps} />;
      case 'select-flight': return <SelectFlight {...screenProps} />;
      case 'select-return-flight': return <SelectFlight {...screenProps} isReturn />;
      case 'booking-summary': return <BookingSummary {...screenProps} />;
      case 'enter-passengers': return <EnterPassengers {...screenProps} />;
      case 'services-hub': return <ServicesHub {...screenProps} />;
      case 'seat-map': return <SeatMap {...screenProps} />;
      case 'meal-selection': return <MealSelection {...screenProps} />;
      case 'baggage-selection': return <BaggageSelection {...screenProps} />;
      case 'review-detail': return <ReviewDetail {...screenProps} />;
      case 'checkout-pay': return <CheckoutPay {...screenProps} />;
      case 'result-success': return <ResultSuccess {...screenProps} />;
      case 'result-failure': return <ResultFailure {...screenProps} />;
      case 'result-partial': return <ResultPartial {...screenProps} />;
      case 'hold-expired': return <HoldExpired {...screenProps} />;
      case 'error-master-data': return <ErrorMasterData {...screenProps} />;
      default: return <SearchHome {...screenProps} />;
    }
  };

  return <div data-theme="light" className="app-root">{renderScreen()}</div>;
}
