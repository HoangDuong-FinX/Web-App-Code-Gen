import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { AppProvider, useApp } from './context/AppContext';
import HomeScreen from './screens/HomeScreen';
import CatalogScreen from './screens/CatalogScreen';
import CarDetailScreen from './screens/CarDetailScreen';
import SearchScreen from './screens/SearchScreen';
import CompareScreen from './screens/CompareScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import InquiryFormScreen from './screens/InquiryFormScreen';
import InquiryConfirmScreen from './screens/InquiryConfirmScreen';
import InquirySuccessScreen from './screens/InquirySuccessScreen';
import TdSelectShowroomScreen from './screens/TdSelectShowroomScreen';
import TdSelectDatetimeScreen from './screens/TdSelectDatetimeScreen';
import TdConfirmScreen from './screens/TdConfirmScreen';
import TdSuccessScreen from './screens/TdSuccessScreen';
import ReservationTermsScreen from './screens/ReservationTermsScreen';
import ReservationPaymentScreen from './screens/ReservationPaymentScreen';
import ReservationSuccessScreen from './screens/ReservationSuccessScreen';
import MyActivityScreen from './screens/MyActivityScreen';
import ActivityDetailScreen from './screens/ActivityDetailScreen';
import PromotionsScreen from './screens/PromotionsScreen';
import PromoDetailScreen from './screens/PromoDetailScreen';

function ScreenRouter(): React.JSX.Element {
  const { screen } = useApp();

  switch (screen) {
    case 'home': return <HomeScreen />;
    case 'catalog': return <CatalogScreen />;
    case 'car-detail': return <CarDetailScreen />;
    case 'search': return <SearchScreen />;
    case 'compare': return <CompareScreen />;
    case 'login': return <LoginScreen />;
    case 'register': return <RegisterScreen />;
    case 'inquiry-form': return <InquiryFormScreen />;
    case 'inquiry-confirm': return <InquiryConfirmScreen />;
    case 'inquiry-success': return <InquirySuccessScreen />;
    case 'td-select-showroom': return <TdSelectShowroomScreen />;
    case 'td-select-datetime': return <TdSelectDatetimeScreen />;
    case 'td-confirm': return <TdConfirmScreen />;
    case 'td-success': return <TdSuccessScreen />;
    case 'reservation-terms': return <ReservationTermsScreen />;
    case 'reservation-payment': return <ReservationPaymentScreen />;
    case 'reservation-success': return <ReservationSuccessScreen />;
    case 'my-activity': return <MyActivityScreen />;
    case 'activity-detail': return <ActivityDetailScreen />;
    case 'promotions': return <PromotionsScreen />;
    case 'promo-detail': return <PromoDetailScreen />;
    default: return <HomeScreen />;
  }
}

export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <CompareProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900 font-sans max-w-md mx-auto relative">
            <ScreenRouter />
          </div>
        </AppProvider>
      </CompareProvider>
    </AuthProvider>
  );
}
