import { useState, useCallback } from "react";
import type { AppState, ScreenId, ModalId, InquiryFormData, Buyer } from "./types";
import { getBackTarget } from "./navigation";
import HomeScreen from "./screens/HomeScreen";
import CatalogScreen from "./screens/CatalogScreen";
import CarDetailScreen from "./screens/CarDetailScreen";
import SearchScreen from "./screens/SearchScreen";
import CompareScreen from "./screens/CompareScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import InquiryFormScreen from "./screens/InquiryFormScreen";
import InquiryConfirmScreen from "./screens/InquiryConfirmScreen";
import InquirySuccessScreen from "./screens/InquirySuccessScreen";
import TdSelectShowroomScreen from "./screens/TdSelectShowroomScreen";
import TdSelectDatetimeScreen from "./screens/TdSelectDatetimeScreen";
import TdConfirmScreen from "./screens/TdConfirmScreen";
import TdSuccessScreen from "./screens/TdSuccessScreen";
import ReservationTermsScreen from "./screens/ReservationTermsScreen";
import ReservationPaymentScreen from "./screens/ReservationPaymentScreen";
import ReservationSuccessScreen from "./screens/ReservationSuccessScreen";
import MyActivityScreen from "./screens/MyActivityScreen";
import ActivityDetailScreen from "./screens/ActivityDetailScreen";
import PromotionsScreen from "./screens/PromotionsScreen";
import PromoDetailScreen from "./screens/PromoDetailScreen";
import CompareTray from "./components/CompareTray";
import CompareFullWarning from "./components/CompareFullWarning";
import LoginPromptModal from "./components/LoginPrompt";
import NetworkErrorModal from "./components/NetworkError";

const initialState: AppState = {
  currentScreen: "home",
  previousScreen: null,
  isLoggedIn: false,
  buyer: null,
  currentCarId: null,
  currentPromoId: null,
  currentActivityId: null,
  compareList: [],
  catalogFilter: null,
  activeModal: null,
  loginReturnScreen: null,
  loginReturnAction: null,
  inquiryForm: null,
  testDriveBooking: {},
  loginAttempts: 0,
  lockUntil: null,
};

export default function App() {
  const [state, setState] = useState<AppState>(initialState);

  const navigate = useCallback((screen: ScreenId) => {
    setState((prev) => ({
      ...prev,
      previousScreen: prev.currentScreen,
      currentScreen: screen,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      const target = getBackTarget(prev.currentScreen, prev.previousScreen);
      return { ...prev, previousScreen: prev.currentScreen, currentScreen: target };
    });
  }, []);

  const setModal = useCallback((modal: ModalId) => {
    setState((prev) => ({ ...prev, activeModal: modal }));
  }, []);

  const setCurrentCar = useCallback(
    (carId: string) => {
      setState((prev) => ({ ...prev, currentCarId: carId }));
      navigate("car-detail");
    },
    [navigate],
  );

  const setCurrentPromo = useCallback(
    (promoId: string) => {
      setState((prev) => ({ ...prev, currentPromoId: promoId }));
      navigate("promo-detail");
    },
    [navigate],
  );

  const setCurrentActivity = useCallback(
    (activityId: string) => {
      setState((prev) => ({ ...prev, currentActivityId: activityId }));
      navigate("activity-detail");
    },
    [navigate],
  );

  const setCatalogFilter = useCallback(
    (bodyType: string | null) => {
      setState((prev) => ({ ...prev, catalogFilter: bodyType }));
      navigate("catalog");
    },
    [navigate],
  );

  const toggleCompare = useCallback(
    (carId: string) => {
      setState((prev) => {
        const isIn = prev.compareList.includes(carId);
        if (isIn) {
          return { ...prev, compareList: prev.compareList.filter((id) => id !== carId) };
        }
        if (prev.compareList.length >= 3) {
          return { ...prev, activeModal: "compare-full-warning" };
        }
        return { ...prev, compareList: [...prev.compareList, carId] };
      });
    },
    [],
  );

  const requireLogin = useCallback(
    (returnScreen: ScreenId, action: string) => {
      if (state.isLoggedIn) {
        navigate(returnScreen);
      } else {
        setState((prev) => ({
          ...prev,
          loginReturnScreen: returnScreen,
          loginReturnAction: action,
          activeModal: "login-prompt",
        }));
      }
    },
    [state.isLoggedIn, navigate],
  );

  const onLoginSuccess = useCallback(
    (buyer: Buyer) => {
      setState((prev) => {
        const returnScreen = prev.loginReturnScreen ?? "car-detail";
        return {
          ...prev,
          isLoggedIn: true,
          buyer,
          loginAttempts: 0,
          lockUntil: null,
          previousScreen: prev.currentScreen,
          currentScreen: returnScreen,
          loginReturnScreen: null,
          loginReturnAction: null,
        };
      });
    },
    [],
  );

  const setInquiryForm = useCallback((data: InquiryFormData) => {
    setState((prev) => ({ ...prev, inquiryForm: data }));
  }, []);

  const setTestDriveBooking = useCallback(
    (booking: Partial<AppState["testDriveBooking"]>) => {
      setState((prev) => ({
        ...prev,
        testDriveBooking: { ...prev.testDriveBooking, ...booking },
      }));
    },
    [],
  );

  const incrementLoginAttempts = useCallback(() => {
    setState((prev) => {
      const attempts = prev.loginAttempts + 1;
      if (attempts >= 5) {
        return { ...prev, loginAttempts: attempts, lockUntil: Date.now() + 15 * 60 * 1000 };
      }
      return { ...prev, loginAttempts: attempts };
    });
  }, []);

  const screenProps = {
    navigate,
    goBack,
    setModal,
    setCurrentCar,
    setCurrentPromo,
    setCurrentActivity,
    setCatalogFilter,
    toggleCompare,
    requireLogin,
    onLoginSuccess,
    setInquiryForm,
    setTestDriveBooking,
    incrementLoginAttempts,
    state,
  };

  const renderScreen = () => {
    switch (state.currentScreen) {
      case "home":
        return <HomeScreen {...screenProps} />;
      case "catalog":
        return <CatalogScreen {...screenProps} />;
      case "car-detail":
        return <CarDetailScreen {...screenProps} />;
      case "search":
        return <SearchScreen {...screenProps} />;
      case "compare":
        return <CompareScreen {...screenProps} />;
      case "login":
        return <LoginScreen {...screenProps} />;
      case "register":
        return <RegisterScreen {...screenProps} />;
      case "inquiry-form":
        return <InquiryFormScreen {...screenProps} />;
      case "inquiry-confirm":
        return <InquiryConfirmScreen {...screenProps} />;
      case "inquiry-success":
        return <InquirySuccessScreen {...screenProps} />;
      case "td-select-showroom":
        return <TdSelectShowroomScreen {...screenProps} />;
      case "td-select-datetime":
        return <TdSelectDatetimeScreen {...screenProps} />;
      case "td-confirm":
        return <TdConfirmScreen {...screenProps} />;
      case "td-success":
        return <TdSuccessScreen {...screenProps} />;
      case "reservation-terms":
        return <ReservationTermsScreen {...screenProps} />;
      case "reservation-payment":
        return <ReservationPaymentScreen {...screenProps} />;
      case "reservation-success":
        return <ReservationSuccessScreen {...screenProps} />;
      case "my-activity":
        return <MyActivityScreen {...screenProps} />;
      case "activity-detail":
        return <ActivityDetailScreen {...screenProps} />;
      case "promotions":
        return <PromotionsScreen {...screenProps} />;
      case "promo-detail":
        return <PromoDetailScreen {...screenProps} />;
      default:
        return <HomeScreen {...screenProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 max-w-md mx-auto relative" lang="vi">
      {renderScreen()}
      {state.compareList.length > 0 && state.currentScreen !== "compare" && (
        <CompareTray
          compareList={state.compareList}
          onOpen={() => navigate("compare")}
          onRemove={(carId) => toggleCompare(carId)}
        />
      )}
      {state.activeModal === "compare-full-warning" && (
        <CompareFullWarning onDismiss={() => setModal(null)} />
      )}
      {state.activeModal === "login-prompt" && (
        <LoginPromptModal
          onLogin={() => {
            setModal(null);
            navigate("login");
          }}
          onDismiss={() => setModal(null)}
        />
      )}
      {state.activeModal === "network-error" && (
        <NetworkErrorModal
          onRetry={() => setModal(null)}
          onDismiss={() => setModal(null)}
        />
      )}
    </div>
  );
}
