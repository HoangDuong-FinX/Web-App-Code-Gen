import React, { useState, useCallback } from 'react';
import type { ScreenId, BookingState, SearchCriteria, FareClass, Flight, PassengerDetail, AncillarySelection, SeatSelection, PaymentResult } from './types';
import { SearchScreen } from './screens/SearchScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ResultsExpiredScreen } from './screens/ResultsExpiredScreen';
import { PassengersScreen } from './screens/PassengersScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { SeatMapScreen } from './screens/SeatMapScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { DoneSuccessScreen } from './screens/DoneSuccessScreen';
import { DoneFailedScreen } from './screens/DoneFailedScreen';
import { DonePartialScreen } from './screens/DonePartialScreen';

const defaultCriteria: SearchCriteria = {
  tripType: 'one-way',
  origin: null,
  destination: null,
  departureDate: '',
  returnDate: '',
  adults: 1,
  children: 0,
  infants: 0,
};

function createInitialState(): BookingState {
  return {
    currentScreen: 'search',
    searchCriteria: { ...defaultCriteria },
    recentSearches: [],
    outboundSession: null,
    returnSession: null,
    selectedOutboundOffer: null,
    selectedOutboundFlight: null,
    selectedReturnOffer: null,
    selectedReturnFlight: null,
    passengers: [],
    iAmPassenger: false,
    outboundAncillaries: [],
    returnAncillaries: [],
    outboundSeat: null,
    returnSeat: null,
    paymentResult: null,
    vatRequested: false,
  };
}

export default function App() {
  const [state, setState] = useState<BookingState>(createInitialState);

  const navigate = useCallback((screen: ScreenId) => {
    setState((prev) => ({ ...prev, currentScreen: screen }));
  }, []);

  const updateState = useCallback((partial: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetAndGoSearch = useCallback(() => {
    setState(createInitialState());
  }, []);

  const setPassengers = useCallback((passengers: PassengerDetail[]) => {
    updateState({ passengers });
  }, [updateState]);

  const setSelectedOutbound = useCallback((offer: FareClass, flight: Flight) => {
    updateState({ selectedOutboundOffer: offer, selectedOutboundFlight: flight, outboundAncillaries: [], outboundSeat: null });
  }, [updateState]);

  const setSelectedReturn = useCallback((offer: FareClass, flight: Flight) => {
    updateState({ selectedReturnOffer: offer, selectedReturnFlight: flight, returnAncillaries: [], returnSeat: null });
  }, [updateState]);

  const expiresAt = state.outboundSession?.expiresAt ?? null;
  const earliestExpiry = (() => {
    if (state.outboundSession && state.returnSession) {
      const a = new Date(state.outboundSession.expiresAt).getTime();
      const b = new Date(state.returnSession.expiresAt).getTime();
      return new Date(Math.min(a, b)).toISOString();
    }
    return expiresAt;
  })();

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'search':
        return (
          <SearchScreen
            criteria={state.searchCriteria}
            recentSearches={state.recentSearches}
            onCriteriaChange={(c) => updateState({ searchCriteria: c })}
            onSearchSuccess={(outbound, returnSession) => {
              const passengers: PassengerDetail[] = [];
              const { adults, children: ch, infants } = state.searchCriteria;
              for (let i = 0; i < adults; i++) passengers.push({ lastName: '', firstName: '', gender: 'Nam', dateOfBirth: '', phone: '', email: '', type: 'adult', isValid: false, passengerId: '' });
              for (let i = 0; i < ch; i++) passengers.push({ lastName: '', firstName: '', gender: 'Nam', dateOfBirth: '', phone: '', email: '', type: 'child', isValid: false, passengerId: '' });
              for (let i = 0; i < infants; i++) passengers.push({ lastName: '', firstName: '', gender: 'Nam', dateOfBirth: '', phone: '', email: '', type: 'infant', isValid: false, passengerId: '' });
              const route = `${state.searchCriteria.origin?.code ?? ''} \u2192 ${state.searchCriteria.destination?.code ?? ''}`;
              const date = state.searchCriteria.departureDate;
              const paxStr = `${adults} NL, ${ch} TE, ${infants} EB`;
              const newRecent = { route, date, passengers: paxStr, criteria: { ...state.searchCriteria } };
              const recent = [newRecent, ...state.recentSearches.filter((r) => r.route !== route || r.date !== date)].slice(0, 4);
              updateState({ outboundSession: outbound, returnSession: returnSession ?? null, passengers, recentSearches: recent, currentScreen: 'results' });
            }}
          />
        );
      case 'results':
        return (
          <ResultsScreen outboundSession={state.outboundSession} returnSession={state.returnSession} tripType={state.searchCriteria.tripType} selectedOutboundOffer={state.selectedOutboundOffer} selectedReturnOffer={state.selectedReturnOffer} expiresAt={earliestExpiry} onSelectOutbound={setSelectedOutbound} onSelectReturn={setSelectedReturn} onContinue={() => navigate('passengers')} onBack={resetAndGoSearch} onExpired={() => navigate('results-expired')} />
        );
      case 'results-expired':
        return <ResultsExpiredScreen onSearchAgain={resetAndGoSearch} />;
      case 'passengers':
        return (
          <PassengersScreen passengers={state.passengers} iAmPassenger={state.iAmPassenger} expiresAt={earliestExpiry} outboundSessionId={state.outboundSession?.sessionId ?? ''} returnSessionId={state.returnSession?.sessionId ?? null} onPassengersChange={setPassengers} onIAmPassengerToggle={(v) => updateState({ iAmPassenger: v })} onContinue={() => navigate('services')} onBack={() => navigate('results')} onExpired={() => navigate('results-expired')} onHoldExpiredSearch={resetAndGoSearch} />
        );
      case 'services':
        return (
          <ServicesScreen tripType={state.searchCriteria.tripType} outboundSessionId={state.outboundSession?.sessionId ?? ''} returnSessionId={state.returnSession?.sessionId ?? null} outboundOfferId={state.selectedOutboundOffer?.offerId ?? ''} returnOfferId={state.selectedReturnOffer?.offerId ?? null} outboundAncillaries={state.outboundAncillaries} returnAncillaries={state.returnAncillaries} outboundSeat={state.outboundSeat} returnSeat={state.returnSeat} passengers={state.passengers} expiresAt={earliestExpiry} onAncillariesChange={(dir, sels) => { if (dir === 'outbound') updateState({ outboundAncillaries: sels }); else updateState({ returnAncillaries: sels }); }} onSeatChange={(dir, seat) => { if (dir === 'outbound') updateState({ outboundSeat: seat }); else updateState({ returnSeat: seat }); }} onNavigateToSeatMap={() => navigate('seat-map')} onContinue={() => navigate('payment')} onBack={() => navigate('passengers')} onExpired={() => navigate('results-expired')} onHoldExpiredSearch={resetAndGoSearch} />
        );
      case 'seat-map':
        return (
          <SeatMapScreen sessionId={state.outboundSession?.sessionId ?? ''} currentSeat={state.outboundSeat} onConfirm={(seat) => { updateState({ outboundSeat: seat }); navigate('services'); }} onBack={() => navigate('services')} />
        );
      case 'payment':
        return (
          <PaymentScreen searchCriteria={state.searchCriteria} outboundFlight={state.selectedOutboundFlight} returnFlight={state.selectedReturnFlight} outboundOffer={state.selectedOutboundOffer} returnOffer={state.selectedReturnOffer} outboundAncillaries={state.outboundAncillaries} returnAncillaries={state.returnAncillaries} outboundSeat={state.outboundSeat} returnSeat={state.returnSeat} onContinue={() => navigate('checkout')} onBack={() => navigate('services')} />
        );
      case 'checkout':
        return (
          <CheckoutScreen searchCriteria={state.searchCriteria} outboundOffer={state.selectedOutboundOffer} returnOffer={state.selectedReturnOffer} outboundAncillaries={state.outboundAncillaries} returnAncillaries={state.returnAncillaries} outboundSeat={state.outboundSeat} returnSeat={state.returnSeat} outboundSessionId={state.outboundSession?.sessionId ?? ''} returnSessionId={state.returnSession?.sessionId ?? null} expiresAt={earliestExpiry} vatRequested={state.vatRequested} onVatChange={(v) => updateState({ vatRequested: v })} onPaymentResult={(result) => { updateState({ paymentResult: result }); if (result.status === 'success') navigate('done-success'); else if (result.status === 'partial') navigate('done-partial'); else if (result.status === 'failed') navigate('done-failed'); }} onBack={() => navigate('payment')} onExpired={() => navigate('results-expired')} onHoldExpiredSearch={resetAndGoSearch} />
        );
      case 'done-success':
        return <DoneSuccessScreen paymentResult={state.paymentResult} vatRequested={state.vatRequested} onBookAnother={resetAndGoSearch} onGoHome={resetAndGoSearch} />;
      case 'done-failed':
        return <DoneFailedScreen paymentResult={state.paymentResult} onRetry={() => { updateState({ paymentResult: null }); navigate('checkout'); }} onGoHome={resetAndGoSearch} />;
      case 'done-partial':
        return <DonePartialScreen paymentResult={state.paymentResult} onGoHome={resetAndGoSearch} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FBF9] font-[Inter] max-w-[480px] mx-auto relative">
      {renderScreen()}
    </div>
  );
}
