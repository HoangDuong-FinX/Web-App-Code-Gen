import React, { useState, useCallback } from 'react';
import { BookingState } from './types';

const initialBookingState: BookingState = {
  searchCriteria: null,
  outboundSession: null,
  returnSession: null,
  selectedOutboundOffer: null,
  selectedReturnOffer: null,
  passengers: [],
  paymentResult: null,
  transactionId: null,
  bookingCode: null,
  paymentError: null,
  viaHost: true,
};

interface StoreContextType {
  currentScreen: string;
  booking: BookingState;
  navigateTo: (screen: string) => void;
  updateBooking: (updates: Partial<BookingState>) => void;
  resetBooking: () => void;
}

const StoreContext = React.createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('search');
  const [booking, setBooking] = useState<BookingState>(initialBookingState);

  const navigateTo = useCallback((screen: string) => {
    setCurrentScreen(screen);
  }, []);

  const updateBooking = useCallback((updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(initialBookingState);
    setCurrentScreen('search');
  }, []);

  const value: StoreContextType = {
    currentScreen,
    booking,
    navigateTo,
    updateBooking,
    resetBooking,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
