import React, { useReducer } from 'react';
import type { AppState, NavigationAction } from './types';
import { Home } from './screens/Home';
import { SearchResults } from './screens/SearchResults';
import { VehicleDetail } from './screens/VehicleDetail';
import { Comparison } from './screens/Comparison';
import { Register } from './screens/Register';
import { EmailVerification } from './screens/EmailVerification';
import { EmailVerificationFailed } from './screens/EmailVerificationFailed';
import { Login } from './screens/Login';
import { LoginFailed } from './screens/LoginFailed';
import { AccountLocked } from './screens/AccountLocked';
import { Profile } from './screens/Profile';
import { Favorites } from './screens/Favorites';
import { QuoteForm } from './screens/QuoteForm';
import { QuoteConfirmation } from './screens/QuoteConfirmation';
import { TestDriveBooking } from './screens/TestDriveBooking';
import { TestDriveConfirmation } from './screens/TestDriveConfirmation';
import { TestDriveUnavailable } from './screens/TestDriveUnavailable';
import { TestDriveInvalidLicense } from './screens/TestDriveInvalidLicense';
import { Contact } from './screens/Contact';
import { ContactConfirmation } from './screens/ContactConfirmation';
import { InventoryDashboard } from './screens/InventoryDashboard';
import { AddVehicle } from './screens/AddVehicle';
import { EditVehicle } from './screens/EditVehicle';
import { LeadsDashboard } from './screens/LeadsDashboard';
import { LeadDetail } from './screens/LeadDetail';
import { ReportsDashboard } from './screens/ReportsDashboard';

const initialState: AppState = {
  currentScreenId: 'home',
  userRole: 'guest',
  sessionToken: null,
  searchFilters: {
    make: '',
    model: '',
    priceMin: 0,
    priceMax: 500000,
    yearMin: 1980,
    yearMax: new Date().getFullYear(),
    mileageMin: 0,
    mileageMax: 500000,
    transmission: '',
    fuelType: '',
    bodyType: '',
    color: '',
  },
  searchResults: [],
  selectedVehicleId: null,
  comparisonList: [],
  favoritesList: [],
};

function navigationReducer(state: AppState, action: NavigationAction): AppState {
  switch (action.type) {
    case 'NAVIGATE_HOME':
      return { ...state, currentScreenId: 'home' };
    case 'NAVIGATE_SEARCH_RESULTS':
      return { ...state, currentScreenId: 'search-results', searchFilters: action.payload?.filters || state.searchFilters };
    case 'NAVIGATE_VEHICLE_DETAIL':
      return { ...state, currentScreenId: 'vehicle-detail', selectedVehicleId: action.payload?.vehicleId };
    case 'NAVIGATE_COMPARISON':
      return { ...state, currentScreenId: 'comparison' };
    case 'NAVIGATE_REGISTER':
      return { ...state, currentScreenId: 'register' };
    case 'NAVIGATE_EMAIL_VERIFICATION':
      return { ...state, currentScreenId: 'email-verification' };
    case 'NAVIGATE_EMAIL_VERIFICATION_FAILED':
      return { ...state, currentScreenId: 'email-verification-failed' };
    case 'NAVIGATE_LOGIN':
      return { ...state, currentScreenId: 'login' };
    case 'NAVIGATE_LOGIN_FAILED':
      return { ...state, currentScreenId: 'login-failed' };
    case 'NAVIGATE_ACCOUNT_LOCKED':
      return { ...state, currentScreenId: 'account-locked' };
    case 'NAVIGATE_PROFILE':
      return { ...state, currentScreenId: 'profile' };
    case 'NAVIGATE_FAVORITES':
      return { ...state, currentScreenId: 'favorites' };
    case 'NAVIGATE_QUOTE_FORM':
      return { ...state, currentScreenId: 'quote-form' };
    case 'NAVIGATE_QUOTE_CONFIRMATION':
      return { ...state, currentScreenId: 'quote-confirmation' };
    case 'NAVIGATE_TEST_DRIVE_BOOKING':
      return { ...state, currentScreenId: 'test-drive-booking' };
    case 'NAVIGATE_TEST_DRIVE_CONFIRMATION':
      return { ...state, currentScreenId: 'test-drive-confirmation' };
    case 'NAVIGATE_TEST_DRIVE_UNAVAILABLE':
      return { ...state, currentScreenId: 'test-drive-unavailable' };
    case 'NAVIGATE_TEST_DRIVE_INVALID_LICENSE':
      return { ...state, currentScreenId: 'test-drive-invalid-license' };
    case 'NAVIGATE_CONTACT':
      return { ...state, currentScreenId: 'contact' };
    case 'NAVIGATE_CONTACT_CONFIRMATION':
      return { ...state, currentScreenId: 'contact-confirmation' };
    case 'NAVIGATE_INVENTORY_DASHBOARD':
      return { ...state, currentScreenId: 'inventory-dashboard' };
    case 'NAVIGATE_ADD_VEHICLE':
      return { ...state, currentScreenId: 'add-vehicle' };
    case 'NAVIGATE_EDIT_VEHICLE':
      return { ...state, currentScreenId: 'edit-vehicle', selectedVehicleId: action.payload?.vehicleId };
    case 'NAVIGATE_LEADS_DASHBOARD':
      return { ...state, currentScreenId: 'leads-dashboard' };
    case 'NAVIGATE_LEAD_DETAIL':
      return { ...state, currentScreenId: 'lead-detail' };
    case 'NAVIGATE_REPORTS_DASHBOARD':
      return { ...state, currentScreenId: 'reports-dashboard' };
    case 'SET_USER_ROLE':
      return { ...state, userRole: action.payload?.role || 'guest' };
    case 'SET_SESSION_TOKEN':
      return { ...state, sessionToken: action.payload?.token || null };
    case 'ADD_TO_COMPARISON':
      return { ...state, comparisonList: [...state.comparisonList, action.payload?.vehicleId].slice(-5) };
    case 'REMOVE_FROM_COMPARISON':
      return { ...state, comparisonList: state.comparisonList.filter(id => id !== action.payload?.vehicleId) };
    case 'ADD_TO_FAVORITES':
      return { ...state, favoritesList: [...state.favoritesList, action.payload?.vehicleId] };
    case 'REMOVE_FROM_FAVORITES':
      return { ...state, favoritesList: state.favoritesList.filter(id => id !== action.payload?.vehicleId) };
    default:
      return state;
  }
}

export function App() {
  const [state, dispatch] = useReducer(navigationReducer, initialState);

  const renderScreen = () => {
    switch (state.currentScreenId) {
      case 'home':
        return <Home dispatch={dispatch} state={state} />;
      case 'search-results':
        return <SearchResults dispatch={dispatch} state={state} />;
      case 'vehicle-detail':
        return <VehicleDetail dispatch={dispatch} state={state} />;
      case 'comparison':
        return <Comparison dispatch={dispatch} state={state} />;
      case 'register':
        return <Register dispatch={dispatch} state={state} />;
      case 'email-verification':
        return <EmailVerification dispatch={dispatch} state={state} />;
      case 'email-verification-failed':
        return <EmailVerificationFailed dispatch={dispatch} state={state} />;
      case 'login':
        return <Login dispatch={dispatch} state={state} />;
      case 'login-failed':
        return <LoginFailed dispatch={dispatch} state={state} />;
      case 'account-locked':
        return <AccountLocked dispatch={dispatch} state={state} />;
      case 'profile':
        return <Profile dispatch={dispatch} state={state} />;
      case 'favorites':
        return <Favorites dispatch={dispatch} state={state} />;
      case 'quote-form':
        return <QuoteForm dispatch={dispatch} state={state} />;
      case 'quote-confirmation':
        return <QuoteConfirmation dispatch={dispatch} state={state} />;
      case 'test-drive-booking':
        return <TestDriveBooking dispatch={dispatch} state={state} />;
      case 'test-drive-confirmation':
        return <TestDriveConfirmation dispatch={dispatch} state={state} />;
      case 'test-drive-unavailable':
        return <TestDriveUnavailable dispatch={dispatch} state={state} />;
      case 'test-drive-invalid-license':
        return <TestDriveInvalidLicense dispatch={dispatch} state={state} />;
      case 'contact':
        return <Contact dispatch={dispatch} state={state} />;
      case 'contact-confirmation':
        return <ContactConfirmation dispatch={dispatch} state={state} />;
      case 'inventory-dashboard':
        return <InventoryDashboard dispatch={dispatch} state={state} />;
      case 'add-vehicle':
        return <AddVehicle dispatch={dispatch} state={state} />;
      case 'edit-vehicle':
        return <EditVehicle dispatch={dispatch} state={state} />;
      case 'leads-dashboard':
        return <LeadsDashboard dispatch={dispatch} state={state} />;
      case 'lead-detail':
        return <LeadDetail dispatch={dispatch} state={state} />;
      case 'reports-dashboard':
        return <ReportsDashboard dispatch={dispatch} state={state} />;
      default:
        return <Home dispatch={dispatch} state={state} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderScreen()}
    </div>
  );
}

export default App;