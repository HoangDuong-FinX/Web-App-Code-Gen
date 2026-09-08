import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ScreenId, Car, InquiryData, TestDriveBooking, ReservationTerms, ReservationResult } from '../types';

interface AppNav {
  screen: ScreenId;
  currentCarId: string | null;
  currentPromoId: string | null;
  currentActivityId: string | null;
  currentActivityType: 'inquiry' | 'test-drive' | 'reservation' | null;
  returnTo: ScreenId | null;
  returnAction: 'inquiry' | 'test-drive' | 'reserve' | null;
  inquiryData: InquiryData | null;
  testDriveBooking: Partial<TestDriveBooking>;
  reservationTerms: ReservationTerms | null;
  reservationResult: ReservationResult | null;
  tdReferenceCode: string | null;
  selectedCar: Car | null;
  navigate: (screen: ScreenId, params?: Partial<AppNav>) => void;
}

const AppContext = createContext<AppNav>({
  screen: 'home',
  currentCarId: null,
  currentPromoId: null,
  currentActivityId: null,
  currentActivityType: null,
  returnTo: null,
  returnAction: null,
  inquiryData: null,
  testDriveBooking: {},
  reservationTerms: null,
  reservationResult: null,
  tdReferenceCode: null,
  selectedCar: null,
  navigate: () => {},
});

export function AppProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [state, setState] = useState<Omit<AppNav, 'navigate'>>({
    screen: 'home',
    currentCarId: null,
    currentPromoId: null,
    currentActivityId: null,
    currentActivityType: null,
    returnTo: null,
    returnAction: null,
    inquiryData: null,
    testDriveBooking: {},
    reservationTerms: null,
    reservationResult: null,
    tdReferenceCode: null,
    selectedCar: null,
  });

  const navigate = useCallback((screen: ScreenId, params?: Partial<AppNav>) => {
    setState(prev => ({ ...prev, screen, ...params } as Omit<AppNav, 'navigate'>));
  }, []);

  return (
    <AppContext.Provider value={{ ...state, navigate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppNav {
  return useContext(AppContext);
}
