import { useState, useCallback } from 'react';
import type { ScreenId, ModalId, AppState, UserProfile, TimeSlot } from './types';

import HomeScreen from './screens/HomeScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import CarDetailScreen from './screens/CarDetailScreen';
import PhotoGalleryScreen from './screens/PhotoGalleryScreen';
import CompareScreen from './screens/CompareScreen';
import FinancingCalculatorScreen from './screens/FinancingCalculatorScreen';
import TestDriveBookingScreen from './screens/TestDriveBookingScreen';
import TestDriveSuccessScreen from './screens/TestDriveSuccessScreen';
import TestDriveFailedScreen from './screens/TestDriveFailedScreen';
import WishlistScreen from './screens/WishlistScreen';
import OrderReviewScreen from './screens/OrderReviewScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';
import PaymentFailedScreen from './screens/PaymentFailedScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import OtpVerifyScreen from './screens/OtpVerifyScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ContactOptionsModal from './screens/ContactOptionsModal';
import SendInquiryScreen from './screens/SendInquiryScreen';
import InquirySentScreen from './screens/InquirySentScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import DealerDashboardScreen from './screens/DealerDashboardScreen';
import AddEditCarScreen from './screens/AddEditCarScreen';
import DealerLeadsScreen from './screens/DealerLeadsScreen';

const initialState: AppState = {
  currentScreen: 'home',
  previousScreen: null,
  isAuthenticated: false,
  user: null,
  compareList: [],
  wishlistIds: [],
  cartOrigin: null,
  selectedCarId: null,
  selectedOrderId: null,
  activeModal: null,
  searchKeyword: '',
  searchFilters: {},
  testDriveReferenceNumber: null,
  paymentOrderNumber: null,
  paymentFailureReason: null,
  registerPhone: null,
  alternativeSlots: [],
  editingCarId: null,
};

export default function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const navigate = useCallback((screen: ScreenId) => {
    setState((prev) => ({
      ...prev,
      previousScreen: prev.currentScreen,
      currentScreen: screen,
      activeModal: null,
    }));
  }, []);

  const setModal = useCallback((modal: ModalId) => {
    setState((prev) => ({ ...prev, activeModal: modal }));
  }, []);

  const selectCar = useCallback((carId: string) => {
    setState((prev) => ({
      ...prev,
      selectedCarId: carId,
      previousScreen: prev.currentScreen,
      currentScreen: 'car-detail',
      activeModal: null,
    }));
  }, []);

  const selectOrder = useCallback((orderId: string) => {
    setState((prev) => ({
      ...prev,
      selectedOrderId: orderId,
      previousScreen: prev.currentScreen,
      currentScreen: 'order-detail',
      activeModal: null,
    }));
  }, []);

  const handleAuthGate = useCallback((targetScreen: ScreenId) => {
    setState((prev) => ({
      ...prev,
      cartOrigin: targetScreen,
      previousScreen: prev.currentScreen,
      currentScreen: 'login',
      activeModal: null,
    }));
  }, []);

  const handleLoginSuccess = useCallback((user: UserProfile) => {
    setState((prev) => {
      const returnTo = prev.cartOrigin ?? 'home';
      return {
        ...prev,
        isAuthenticated: true,
        user,
        cartOrigin: null,
        previousScreen: prev.currentScreen,
        currentScreen: returnTo,
        activeModal: null,
      };
    });
  }, []);

  const handleLogout = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      wishlistIds: [],
      previousScreen: prev.currentScreen,
      currentScreen: 'home',
      activeModal: null,
    }));
  }, []);

  const handleToggleWishlist = useCallback((carId: string) => {
    if (!state.isAuthenticated) {
      handleAuthGate('car-detail');
      return;
    }
    setState((prev) => {
      const ids = prev.wishlistIds.includes(carId)
        ? prev.wishlistIds.filter((id) => id !== carId)
        : [...prev.wishlistIds, carId];
      return { ...prev, wishlistIds: ids };
    });
  }, [state.isAuthenticated, handleAuthGate]);

  const handleToggleCompare = useCallback((carId: string) => {
    setState((prev) => {
      if (prev.compareList.includes(carId)) {
        return { ...prev, compareList: prev.compareList.filter((id) => id !== carId) };
      }
      if (prev.compareList.length >= 3) return prev;
      return { ...prev, compareList: [...prev.compareList, carId] };
    });
  }, []);

  const handleClearCompare = useCallback(() => {
    setState((prev) => ({ ...prev, compareList: [] }));
  }, []);

  const handleSearch = useCallback((keyword: string) => {
    setState((prev) => ({ ...prev, searchKeyword: keyword }));
  }, []);

  const handleTestDriveSuccess = useCallback((refNumber: string) => {
    setState((prev) => ({
      ...prev,
      testDriveReferenceNumber: refNumber,
      previousScreen: prev.currentScreen,
      currentScreen: 'test-drive-success',
      activeModal: null,
    }));
  }, []);

  const handleTestDriveFailed = useCallback((altSlots: TimeSlot[]) => {
    setState((prev) => ({
      ...prev,
      alternativeSlots: altSlots,
      previousScreen: prev.currentScreen,
      currentScreen: 'test-drive-failed',
      activeModal: null,
    }));
  }, []);

  const handlePaymentSuccess = useCallback((orderNumber: string) => {
    setState((prev) => ({
      ...prev,
      paymentOrderNumber: orderNumber,
      previousScreen: prev.currentScreen,
      currentScreen: 'payment-success',
      activeModal: null,
    }));
  }, []);

  const handlePaymentFailed = useCallback((reason: string) => {
    setState((prev) => ({
      ...prev,
      paymentFailureReason: reason,
      previousScreen: prev.currentScreen,
      currentScreen: 'payment-failed',
      activeModal: null,
    }));
  }, []);

  const handleRegisterSuccess = useCallback((phone: string) => {
    setState((prev) => ({
      ...prev,
      registerPhone: phone,
      previousScreen: prev.currentScreen,
      currentScreen: 'otp-verify',
      activeModal: null,
    }));
  }, []);

  const handleSaveProfile = useCallback((updated: UserProfile) => {
    setState((prev) => ({ ...prev, user: updated }));
  }, []);

  const handleEditCar = useCallback((carId: string | null) => {
    setState((prev) => ({
      ...prev,
      editingCarId: carId,
      previousScreen: prev.currentScreen,
      currentScreen: 'add-edit-car',
      activeModal: null,
    }));
  }, []);

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigate={navigate}
            onSelectCar={selectCar}
            onSearch={handleSearch}
            isAuthenticated={state.isAuthenticated}
            wishlistIds={state.wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            compareList={state.compareList}
            onToggleCompare={handleToggleCompare}
          />
        );
      case 'search-results':
        return (
          <SearchResultsScreen
            onNavigate={navigate}
            onSelectCar={selectCar}
            keyword={state.searchKeyword}
            onKeywordChange={handleSearch}
            isAuthenticated={state.isAuthenticated}
            wishlistIds={state.wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            compareList={state.compareList}
            onToggleCompare={handleToggleCompare}
          />
        );
      case 'car-detail':
        return (
          <>
            <CarDetailScreen
              carId={state.selectedCarId}
              onNavigate={navigate}
              isAuthenticated={state.isAuthenticated}
              onAuthGate={handleAuthGate}
              wishlistIds={state.wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              compareList={state.compareList}
              onToggleCompare={handleToggleCompare}
              onOpenGallery={() => navigate('photo-gallery')}
              onOpenContactOptions={() => setContactModalOpen(true)}
            />
            {contactModalOpen && (
              <ContactOptionsModal
                carId={state.selectedCarId}
                onNavigate={(screen) => { setContactModalOpen(false); navigate(screen); }}
                onClose={() => setContactModalOpen(false)}
              />
            )}
          </>
        );
      case 'photo-gallery':
        return <PhotoGalleryScreen carId={state.selectedCarId} onNavigate={navigate} />;
      case 'compare':
        return (
          <CompareScreen
            compareList={state.compareList}
            onToggleCompare={handleToggleCompare}
            onClearCompare={handleClearCompare}
            onNavigate={navigate}
            onSelectCar={selectCar}
          />
        );
      case 'financing-calculator':
        return <FinancingCalculatorScreen carId={state.selectedCarId} onNavigate={navigate} />;
      case 'test-drive-booking':
        return (
          <TestDriveBookingScreen
            carId={state.selectedCarId}
            onNavigate={navigate}
            onSuccess={handleTestDriveSuccess}
            onFailed={handleTestDriveFailed}
            userName={state.user?.name}
            userPhone={state.user?.phone}
          />
        );
      case 'test-drive-success':
        return <TestDriveSuccessScreen referenceNumber={state.testDriveReferenceNumber} onNavigate={navigate} />;
      case 'test-drive-failed':
        return <TestDriveFailedScreen alternativeSlots={state.alternativeSlots} onNavigate={navigate} />;
      case 'wishlist':
        return (
          <WishlistScreen
            wishlistIds={state.wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onSelectCar={selectCar}
            onNavigate={navigate}
            isAuthenticated={state.isAuthenticated}
          />
        );
      case 'order-review':
        return <OrderReviewScreen carId={state.selectedCarId} onNavigate={navigate} />;
      case 'payment-method':
        return (
          <PaymentMethodScreen
            carId={state.selectedCarId}
            onNavigate={navigate}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailed={handlePaymentFailed}
          />
        );
      case 'payment-success':
        return <PaymentSuccessScreen orderNumber={state.paymentOrderNumber} onNavigate={navigate} onViewOrder={selectOrder} />;
      case 'payment-failed':
        return <PaymentFailedScreen failureReason={state.paymentFailureReason} onNavigate={navigate} />;
      case 'my-orders':
        return <MyOrdersScreen onNavigate={navigate} onSelectOrder={selectOrder} isAuthenticated={state.isAuthenticated} />;
      case 'order-detail':
        return <OrderDetailScreen orderId={state.selectedOrderId} onNavigate={navigate} activeModal={state.activeModal} onSetModal={setModal} />;
      case 'login':
        return <LoginScreen onNavigate={navigate} onLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return <RegisterScreen onNavigate={navigate} onRegisterSuccess={handleRegisterSuccess} />;
      case 'otp-verify':
        return <OtpVerifyScreen phone={state.registerPhone} onNavigate={navigate} onVerified={handleLoginSuccess} />;
      case 'forgot-password':
        return <ForgotPasswordScreen onNavigate={navigate} />;
      case 'contact-options':
        return (
          <ContactOptionsModal
            carId={state.selectedCarId}
            onNavigate={navigate}
            onClose={() => navigate('car-detail')}
          />
        );
      case 'send-inquiry':
        return <SendInquiryScreen carId={state.selectedCarId} onNavigate={navigate} />;
      case 'inquiry-sent':
        return <InquirySentScreen onNavigate={navigate} />;
      case 'profile':
        return (
          <ProfileScreen
            user={state.user}
            onNavigate={navigate}
            isAuthenticated={state.isAuthenticated}
            onLogout={handleLogout}
            activeModal={state.activeModal}
            onSetModal={setModal}
          />
        );
      case 'edit-profile':
        return <EditProfileScreen user={state.user} onNavigate={navigate} onSave={handleSaveProfile} />;
      case 'dealer-dashboard':
        return <DealerDashboardScreen onNavigate={navigate} onEditCar={handleEditCar} activeModal={state.activeModal} onSetModal={setModal} />;
      case 'add-edit-car':
        return <AddEditCarScreen editingCarId={state.editingCarId} onNavigate={navigate} />;
      case 'dealer-leads':
        return <DealerLeadsScreen onNavigate={navigate} onSelectOrder={selectOrder} />;
      default:
        return null;
    }
  };

  return <div className="font-sans antialiased">{renderScreen()}</div>;
}
