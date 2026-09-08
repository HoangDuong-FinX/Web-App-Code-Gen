import React, { useState, useCallback } from 'react';
import type { ScreenId } from './types';
import HomeScreen from './screens/HomeScreen';
import CatalogScreen from './screens/CatalogScreen';
import CarDetailScreen from './screens/CarDetailScreen';
import CompareScreen from './screens/CompareScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import InquiryFormScreen from './screens/InquiryFormScreen';
import InquirySuccessScreen from './screens/InquirySuccessScreen';
import ReservationFormScreen from './screens/ReservationFormScreen';
import ReservationConfirmScreen from './screens/ReservationConfirmScreen';
import ReservationSuccessScreen from './screens/ReservationSuccessScreen';
import AdminListingsScreen from './screens/AdminListingsScreen';
import AdminAddCarScreen from './screens/AdminAddCarScreen';
import AdminInquiriesScreen from './screens/AdminInquiriesScreen';
import AdminInquiryDetailScreen from './screens/AdminInquiryDetailScreen';

interface NavState {
  screen: ScreenId;
  params: Record<string, unknown>;
}

export default function App(): React.JSX.Element {
  const [navState, setNavState] = useState<NavState>({
    screen: 'home',
    params: {},
  });
  const [history, setHistory] = useState<NavState[]>([]);

  const navigate = useCallback((screen: string, params?: Record<string, unknown>) => {
    setNavState((prev) => {
      setHistory((h) => [...h, prev]);
      return { screen: screen as ScreenId, params: params ?? {} };
    });
  }, []);

  const { screen, params } = navState;

  switch (screen) {
    case 'home':
      return <HomeScreen onNavigate={navigate} />;
    case 'catalog':
      return <CatalogScreen onNavigate={navigate} params={params} />;
    case 'car-detail':
      return <CarDetailScreen onNavigate={navigate} params={params} />;
    case 'compare':
      return <CompareScreen onNavigate={navigate} />;
    case 'favorites':
      return <FavoritesScreen onNavigate={navigate} />;
    case 'search-results':
      return <SearchResultsScreen onNavigate={navigate} params={params} />;
    case 'inquiry-form':
      return <InquiryFormScreen onNavigate={navigate} params={params} />;
    case 'inquiry-success':
      return <InquirySuccessScreen onNavigate={navigate} params={params} />;
    case 'reservation-form':
      return <ReservationFormScreen onNavigate={navigate} params={params} />;
    case 'reservation-confirm':
      return <ReservationConfirmScreen onNavigate={navigate} params={params} />;
    case 'reservation-success':
      return <ReservationSuccessScreen onNavigate={navigate} params={params} />;
    case 'admin-listings':
      return <AdminListingsScreen onNavigate={navigate} />;
    case 'admin-add-car':
      return <AdminAddCarScreen onNavigate={navigate} params={params} />;
    case 'admin-inquiries':
      return <AdminInquiriesScreen onNavigate={navigate} />;
    case 'admin-inquiry-detail':
      return <AdminInquiryDetailScreen onNavigate={navigate} params={params} />;
    default: {
      const _exhaustive: never = screen;
      return <HomeScreen onNavigate={navigate} />;
    }
  }
}
