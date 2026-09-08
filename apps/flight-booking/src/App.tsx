import { useState, useCallback } from 'react';
import type {
  ScreenId,
  BookingState,
  SearchCriteria,
  Airport,
  Flight,
  FareClass,
  SearchResult,
  PassengerForm,
  AncillaryOption,
  AncillarySelection,
  SeatSelection,
  PaymentPayload,
  PaymentResult,
} from './types';
import { SearchScreen } from './screens/SearchScreen';
import { AirportPickerModal } from './screens/AirportPickerModal';
import { DatePickerModal } from './screens/DatePickerModal';
import { PassengerCountModal } from './screens/PassengerCountModal';
import { ResultsScreen } from './screens/ResultsScreen';
import { PassengersScreen } from './screens/PassengersScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { SeatSelectionSheet } from './screens/SeatSelectionSheet';
import { PaymentReviewScreen } from './screens/PaymentReviewScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { DoneSuccessScreen } from './screens/DoneSuccessScreen';
import { DoneFailedScreen } from './screens/DoneFailedScreen';
import { DonePartialScreen } from './screens/DonePartialScreen';

const initialSearchCriteria: SearchCriteria = {
  origin: null,
  destination: null,
  tripType: 'one-way',
  departureDate: null,
  returnDate: null,
  passengers: { adults: 1, children: 0, infants: 0 },
};

const initialBookingState: BookingState = {
  searchCriteria: initialSearchCriteria,
  searchResult: null,
  selectedOutboundFlight: null,
  selectedOutboundFare: null,
  selectedInboundFlight: null,
  selectedInboundFare: null,
  passengerForms: [],
  ancillaryOptions: [],
  ancillarySelections: [],
  seatSelections: [],
  inboundSeatSelections: [],
  paymentPayload: null,
  inboundPaymentPayload: null,
  paymentResult: null,
  inboundPaymentResult: null,
  vatRequested: false,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('search');
  const [modalScreen, setModalScreen] = useState<ScreenId | null>(null);
  const [modalContext, setModalContext] = useState<string>('');
  const [booking, setBooking] = useState<BookingState>(initialBookingState);

  const navigate = useCallback((screen: ScreenId) => {
    setModalScreen(null);
    setCurrentScreen(screen);
  }, []);

  const openModal = useCallback((modal: ScreenId, context?: string) => {
    setModalContext(context ?? '');
    setModalScreen(modal);
  }, []);

  const closeModal = useCallback(() => {
    setModalScreen(null);
    setModalContext('');
  }, []);

  const updateBooking = useCallback((partial: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...partial }));
  }, []);

  const updateSearchCriteria = useCallback((partial: Partial<SearchCriteria>) => {
    setBooking((prev) => ({
      ...prev,
      searchCriteria: { ...prev.searchCriteria, ...partial },
    }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(initialBookingState);
    navigate('search');
  }, [navigate]);

  const handleSelectAirport = useCallback(
    (airport: Airport) => {
      if (modalContext === 'origin') {
        updateSearchCriteria({ origin: airport });
      } else {
        updateSearchCriteria({ destination: airport });
      }
      closeModal();
    },
    [modalContext, updateSearchCriteria, closeModal],
  );

  const handleSelectDate = useCallback(
    (date: string) => {
      if (modalContext === 'departure') {
        updateSearchCriteria({ departureDate: date });
      } else {
        updateSearchCriteria({ returnDate: date });
      }
      closeModal();
    },
    [modalContext, updateSearchCriteria, closeModal],
  );

  const handleSearchSuccess = useCallback(
    (result: SearchResult) => {
      updateBooking({ searchResult: result });
      navigate('results');
    },
    [updateBooking, navigate],
  );

  const handleSelectFare = useCallback(
    (flight: Flight, fare: FareClass, leg: 'outbound' | 'inbound') => {
      if (leg === 'outbound') {
        updateBooking({ selectedOutboundFlight: flight, selectedOutboundFare: fare });
      } else {
        updateBooking({ selectedInboundFlight: flight, selectedInboundFare: fare });
      }
    },
    [updateBooking],
  );

  const handlePassengersSubmitted = useCallback(
    (forms: PassengerForm[]) => {
      updateBooking({ passengerForms: forms });
      navigate('services');
    },
    [updateBooking, navigate],
  );

  const handleAncillaryLoaded = useCallback(
    (options: AncillaryOption[]) => {
      updateBooking({ ancillaryOptions: options });
    },
    [updateBooking],
  );

  const handleServicesSaved = useCallback(
    (ancillarySelections: AncillarySelection[], seatSelections: SeatSelection[], inboundSeatSelections: SeatSelection[]) => {
      updateBooking({ ancillarySelections, seatSelections, inboundSeatSelections });
      navigate('payment-review');
    },
    [updateBooking, navigate],
  );

  const handlePayloadFetched = useCallback(
    (payload: PaymentPayload, inboundPayload: PaymentPayload | null) => {
      updateBooking({ paymentPayload: payload, inboundPaymentPayload: inboundPayload });
    },
    [updateBooking],
  );

  const handlePaymentDone = useCallback(
    (result: PaymentResult, inboundResult: PaymentResult | null) => {
      updateBooking({ paymentResult: result, inboundPaymentResult: inboundResult });
      if (inboundResult) {
        if (result.outcome === 'success' && inboundResult.outcome === 'success') {
          navigate('done-success');
        } else if (result.outcome === 'failed') {
          navigate('done-failed');
        } else if (inboundResult.outcome === 'failed') {
          navigate('done-partial');
        } else {
          navigate('checkout');
        }
      } else {
        if (result.outcome === 'success') {
          navigate('done-success');
        } else if (result.outcome === 'failed') {
          navigate('done-failed');
        } else {
          navigate('checkout');
        }
      }
    },
    [updateBooking, navigate],
  );

  const expiresAt = booking.searchResult?.outbound?.expiresAt ?? null;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'search':
        return (
          <SearchScreen
            criteria={booking.searchCriteria}
            onUpdateCriteria={updateSearchCriteria}
            onOpenAirportPicker={(ctx) => openModal('airport-picker-modal', ctx)}
            onOpenDatePicker={(ctx) => openModal('date-picker-modal', ctx)}
            onOpenPassengerCount={() => openModal('passenger-count-modal')}
            onSearchSuccess={handleSearchSuccess}
          />
        );
      case 'results':
        return (
          <ResultsScreen
            searchResult={booking.searchResult}
            criteria={booking.searchCriteria}
            selectedOutboundFare={booking.selectedOutboundFare}
            selectedInboundFare={booking.selectedInboundFare}
            onSelectFare={handleSelectFare}
            onContinue={() => navigate('passengers')}
            onBack={() => navigate('search')}
            onHoldExpired={resetBooking}
          />
        );
      case 'passengers':
        return (
          <PassengersScreen
            expiresAt={expiresAt}
            criteria={booking.searchCriteria}
            sessionId={booking.searchResult?.outbound?.sessionId ?? ''}
            onSubmitted={handlePassengersSubmitted}
            onBack={() => navigate('results')}
            onHoldExpired={resetBooking}
          />
        );
      case 'services':
        return (
          <ServicesScreen
            expiresAt={expiresAt}
            searchResult={booking.searchResult}
            passengerForms={booking.passengerForms}
            onOpenSeatSelection={() => openModal('seat-selection-sheet')}
            onServicesSaved={handleServicesSaved}
            onAncillaryLoaded={handleAncillaryLoaded}
            onBack={() => navigate('passengers')}
            onHoldExpired={resetBooking}
          />
        );
      case 'payment-review':
        return (
          <PaymentReviewScreen
            booking={booking}
            onContinue={() => navigate('checkout')}
            onBack={() => navigate('services')}
            onHoldExpired={resetBooking}
          />
        );
      case 'checkout':
        return (
          <CheckoutScreen
            booking={booking}
            onUpdateBooking={updateBooking}
            onPayloadFetched={handlePayloadFetched}
            onPaymentDone={handlePaymentDone}
            onBack={() => navigate('payment-review')}
            onHoldExpired={resetBooking}
          />
        );
      case 'done-success':
        return (
          <DoneSuccessScreen
            booking={booking}
            onBookAnother={resetBooking}
            onHome={resetBooking}
          />
        );
      case 'done-failed':
        return (
          <DoneFailedScreen
            booking={booking}
            onRetry={() => navigate('checkout')}
            onHome={resetBooking}
          />
        );
      case 'done-partial':
        return (
          <DonePartialScreen
            booking={booking}
            onHome={resetBooking}
          />
        );
      default:
        return null;
    }
  };

  const renderModal = () => {
    if (!modalScreen) return null;

    switch (modalScreen) {
      case 'airport-picker-modal':
        return (
          <AirportPickerModal
            context={modalContext as 'origin' | 'destination'}
            currentOrigin={booking.searchCriteria.origin}
            currentDestination={booking.searchCriteria.destination}
            onSelect={handleSelectAirport}
            onClose={closeModal}
          />
        );
      case 'date-picker-modal':
        return (
          <DatePickerModal
            context={modalContext as 'departure' | 'return'}
            selectedDepartureDate={booking.searchCriteria.departureDate}
            selectedReturnDate={booking.searchCriteria.returnDate}
            onSelect={handleSelectDate}
            onClose={closeModal}
          />
        );
      case 'passenger-count-modal':
        return (
          <PassengerCountModal
            passengers={booking.searchCriteria.passengers}
            onConfirm={(p) => {
              updateSearchCriteria({ passengers: p });
              closeModal();
            }}
            onClose={closeModal}
          />
        );
      case 'seat-selection-sheet':
        return (
          <SeatSelectionSheet
            searchResult={booking.searchResult}
            passengerCount={
              booking.searchCriteria.passengers.adults +
              booking.searchCriteria.passengers.children
            }
            existingSelections={booking.seatSelections}
            existingInboundSelections={booking.inboundSeatSelections}
            onConfirm={(outbound, inbound) => {
              updateBooking({ seatSelections: outbound, inboundSeatSelections: inbound });
              closeModal();
            }}
            onClose={closeModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FBF9] font-['Inter',sans-serif] text-[#191919]">
      {renderScreen()}
      {renderModal()}
    </div>
  );
}
