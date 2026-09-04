// Root state machine — navigation controller for branch-appointment mini app
import React, { useState, useEffect } from 'react';
import './styles/index.css';
import { t } from './i18n';
import { getCustomerId } from './api/identity';
import { BranchList } from './screens/BranchList';
import { SlotPicker } from './screens/SlotPicker';
import { TransactionType } from './screens/TransactionType';
import { ConfirmBooking } from './screens/ConfirmBooking';
import { BookingSuccess } from './screens/BookingSuccess';
import { MyAppointments } from './screens/MyAppointments';
import { BranchDayView } from './screens/BranchDayView';
import type { ScreenId, Branch, BookingState, TransactionType as TxType } from './types';

const INITIAL_BOOKING: BookingState = {
  branchId: '',
  branchName: '',
  branchAddress: '',
  date: '',
  slotId: '',
  slotTimeRange: '',
  transactionType: null,
};

const App: React.FC = () => {
  // Identity
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [identityError, setIdentityError] = useState(false);

  // Navigation state machine
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('branch-list');

  // Booking flow state (lifted to common ancestor)
  const [booking, setBooking] = useState<BookingState>(INITIAL_BOOKING);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [appointmentCode, setAppointmentCode] = useState<string>('');

  // Resolve customer identity on mount
  useEffect(() => {
    let cancelled = false;
    getCustomerId()
      .then((identity) => {
        if (!cancelled) {
          setCustomerId(identity.customerId);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIdentityError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // === Navigation transition functions ===

  const navigateToBranchList = () => {
    setBooking(INITIAL_BOOKING);
    setSelectedBranch(null);
    setAppointmentCode('');
    setCurrentScreen('branch-list');
  };

  const navigateToSlotPicker = (branch?: Branch) => {
    if (branch) {
      setSelectedBranch(branch);
      setBooking((prev) => ({
        ...prev,
        branchId: branch.id,
        branchName: branch.name,
        branchAddress: branch.address,
        // Clear slot selection when branch changes
        date: '',
        slotId: '',
        slotTimeRange: '',
        transactionType: null,
      }));
    } else {
      // Coming back from slot-taken — keep branch, clear slot
      setBooking((prev) => ({
        ...prev,
        slotId: '',
        slotTimeRange: '',
      }));
    }
    setCurrentScreen('slot-picker');
  };

  const navigateToTransactionType = (date: string, slotId: string, slotTimeRange: string) => {
    setBooking((prev) => ({ ...prev, date, slotId, slotTimeRange }));
    setCurrentScreen('transaction-type');
  };

  const navigateToConfirmBooking = (txType: TxType) => {
    setBooking((prev) => ({ ...prev, transactionType: txType }));
    setCurrentScreen('confirm-booking');
  };

  const navigateToBookingSuccess = (code: string) => {
    setAppointmentCode(code);
    setCurrentScreen('booking-success');
  };

  const navigateToMyAppointments = () => {
    setCurrentScreen('my-appointments');
  };

  const navigateBackToSlotPicker = () => {
    // Preserve branch, clear slot
    setBooking((prev) => ({ ...prev, slotId: '', slotTimeRange: '' }));
    setCurrentScreen('slot-picker');
  };

  const navigateBackToTransactionType = () => {
    setCurrentScreen('transaction-type');
  };

  // Identity error blocking screen
  if (identityError) {
    return (
      <div className="app-container">
        <div className="error-state" role="alert" aria-label={t('common.identityError')}>
          <div className="error-state-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
              <path d="M24 14v14M24 32v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="error-state-title">{t('common.identityError')}</h1>
        </div>
      </div>
    );
  }

  // Loading identity
  if (customerId === null) {
    return (
      <div className="app-container">
        <div className="loading-container" role="status" aria-label={t('common.loading')}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  // === Screen renderer (state machine) ===
  const renderScreen = (): React.ReactNode => {
    switch (currentScreen) {
      case 'branch-list':
        return (
          <BranchList
            onSelectBranch={(branch) => navigateToSlotPicker(branch)}
            onNavigateToMyAppointments={navigateToMyAppointments}
          />
        );

      case 'slot-picker':
        if (!selectedBranch) {
          navigateToBranchList();
          return null;
        }
        return (
          <SlotPicker
            branch={selectedBranch}
            onContinue={navigateToTransactionType}
            onBack={navigateToBranchList}
          />
        );

      case 'transaction-type':
        return (
          <TransactionType
            branchName={booking.branchName}
            date={booking.date}
            slotTimeRange={booking.slotTimeRange}
            initialValue={booking.transactionType}
            onContinue={navigateToConfirmBooking}
            onBack={navigateBackToSlotPicker}
          />
        );

      case 'confirm-booking':
        return (
          <ConfirmBooking
            booking={booking}
            customerId={customerId}
            onSuccess={navigateToBookingSuccess}
            onSlotTaken={() => navigateToSlotPicker()}
            onNavigateToMyAppointments={navigateToMyAppointments}
            onBack={navigateBackToTransactionType}
          />
        );

      case 'booking-success':
        return (
          <BookingSuccess
            appointmentCode={appointmentCode}
            booking={booking}
            onViewMyAppointments={navigateToMyAppointments}
            onBookAnother={navigateToBranchList}
          />
        );

      case 'my-appointments':
        return (
          <MyAppointments
            customerId={customerId}
            onNavigateToBranchList={navigateToBranchList}
          />
        );

      case 'branch-day-view':
        return <BranchDayView />;

      default: {
        const _exhaustive: never = currentScreen;
        return _exhaustive;
      }
    }
  };

  return <div className="app-container">{renderScreen()}</div>;
};

export default App;
