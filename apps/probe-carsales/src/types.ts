export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  priceNegotiable: boolean;
  thumbnailUrl: string;
  summarySpecs: string;
  photos: { url: string; alt: string }[];
  engine: string;
  transmission: string;
  fuelType: string;
  mileage: number;
  color: string;
  interior: string;
  features: string[];
  seller: { name: string; contact: string };
  status: "available" | "sold" | "pending";
}

export interface Favorite {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  thumbnailUrl: string;
}

export interface TestDriveBooking {
  id: string;
  carId: string;
  carMakeModel: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  referenceNumber: string;
  location: string;
}

export interface PurchaseInquiry {
  id: string;
  carId: string;
  carMakeModel: string;
  offerPrice: number;
  submittedDate: string;
  status: "pending" | "responded" | "accepted" | "rejected";
  referenceNumber: string;
  type: "test-drive" | "purchase";
  financing?: {
    loanTerm: number;
    downPaymentPercent: number;
  };
  appointmentDate?: string;
  responses: { date: string; text: string }[];
}

export interface AdminInquiry {
  id: string;
  customerName: string;
  customerContact: string;
  carMakeModel: string;
  type: "test-drive" | "purchase";
  submittedDate: string;
  status: "pending" | "responded" | "accepted" | "rejected";
  offerPrice?: number;
  financing?: string;
  appointmentDetails?: string;
  customerNotes?: string;
}

export interface InventoryCar {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: "available" | "sold" | "pending";
  thumbnailUrl: string;
}

export interface AvailableSlot {
  time: string;
  available: boolean;
}

export type ScreenId =
  | "catalog"
  | "search-filter"
  | "search-results"
  | "car-detail"
  | "comparison"
  | "favorites"
  | "test-drive-booking"
  | "test-drive-success"
  | "test-drive-error"
  | "purchase-inquiry"
  | "purchase-inquiry-success"
  | "purchase-inquiry-error"
  | "my-activity"
  | "inquiry-detail"
  | "admin-dashboard"
  | "inventory-management"
  | "inventory-add-edit"
  | "inquiry-management"
  | "inquiry-respond";

export interface AppState {
  currentScreen: ScreenId;
  selectedCarId: string | null;
  compareList: string[];
  favorites: Favorite[];
  isAuthenticated: boolean;
  isStaff: boolean;
  userId: string | null;
  userName: string;
  userEmail: string;
  userPhone: string;
  filterCriteria: FilterCriteria;
  searchResults: Car[];
  selectedInquiryId: string | null;
  editCarId: string | null;
  respondInquiryId: string | null;
  bookingResult: TestDriveBooking | null;
  inquiryResult: { referenceNumber: string; carMakeModel: string; offerPrice: string; financing: string } | null;
  errorContext: { message: string; details: string } | null;
}

export interface FilterCriteria {
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  mileageMin: string;
  mileageMax: string;
}