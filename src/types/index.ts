export type ScreenId = 'home' | 'search-results' | 'vehicle-detail' | 'comparison' | 'register' | 'email-verification' | 'email-verification-failed' | 'login' | 'login-failed' | 'account-locked' | 'profile' | 'favorites' | 'quote-form' | 'quote-confirmation' | 'test-drive-booking' | 'test-drive-confirmation' | 'test-drive-unavailable' | 'test-drive-invalid-license' | 'contact' | 'contact-confirmation' | 'inventory-dashboard' | 'add-vehicle' | 'edit-vehicle' | 'leads-dashboard' | 'lead-detail' | 'reports-dashboard';

export type UserRole = 'guest' | 'registered-customer' | 'sales-rep' | 'admin';

export interface SearchFilters {
  make: string;
  model: string;
  priceMin: number;
  priceMax: number;
  yearMin: number;
  yearMax: number;
  mileageMin: number;
  mileageMax: number;
  transmission: string;
  fuelType: string;
  bodyType: string;
  color: string;
}

export interface AppState {
  currentScreenId: ScreenId;
  userRole: UserRole;
  sessionToken: string | null;
  searchFilters: SearchFilters;
  searchResults: any[];
  selectedVehicleId: string | null;
  comparisonList: string[];
  favoritesList: string[];
}

export interface NavigationAction {
  type: string;
  payload?: any;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  bodyType: string;
  color: string;
  engine?: string;
  horsepower?: number;
  features?: string[];
  warranty?: string;
  photos?: string[];
  status: 'available' | 'sold' | 'reserved' | 'maintenance';
  dealership?: {
    name: string;
    phone: string;
    address: string;
  };
  rating?: number;
}