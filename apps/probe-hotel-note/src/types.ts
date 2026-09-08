export interface Car {
  id: string;
  name: string;
  thumbnailUrl: string;
  photos: { url: string; label: string }[];
  formattedPrice: string;
  price: number;
  condition: string;
  specsSummary: string;
  specs: { label: string; value: string }[];
  bodyType: string;
  make: string;
  fuelType: string;
  transmission: string;
  year: number;
  monthlyInstallment: string;
  promoLabel: string;
  hasActivePromo: boolean;
  status: "available" | "reserved" | "sold";
  dealer: Dealer;
  isInCompare: boolean;
}

export interface Dealer {
  name: string;
  address: string;
  phone: string;
}

export interface Promotion {
  id: string;
  title: string;
  bannerUrl: string;
  validity: string;
  termsAndConditions: string;
  applicableModelsPreview: string;
  eligibleCars: Car[];
}

export interface Showroom {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
}

export interface TimeSlot {
  time: string;
  isUnavailable: boolean;
  isSelected: boolean;
}

export interface Buyer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface InquiryFormData {
  contactMethod: string;
  preferredTime: string;
  message: string;
}

export interface TestDriveBooking {
  showroomId: string;
  showroomName: string;
  showroomAddress: string;
  date: string;
  time: string;
  referenceCode: string;
  datetime: string;
}

export interface ReservationTerms {
  depositAmount: string;
  holdPeriod: string;
  cancellationPolicy: string;
}

export interface ReservationResult {
  code: string;
  depositAmountPaid: string;
  holdUntilDate: string;
  nextStepsMessage: string;
}

export interface ActivityItem {
  id: string;
  type: "inquiry" | "test-drive" | "reservation";
  carId: string;
  carName: string;
  carThumbnailUrl: string;
  carFormattedPrice: string;
  statusLabel: string;
  statusVariant: "success" | "warning" | "neutral" | "error";
  inquiryDate?: string;
  bookingDatetime?: string;
  showroomName?: string;
  reservationDate?: string;
  depositAmount?: string;
  typeSpecificDetails: string;
  timeline: { date: string; description: string }[];
}

export type ScreenId =
  | "home"
  | "catalog"
  | "car-detail"
  | "search"
  | "compare"
  | "login"
  | "register"
  | "inquiry-form"
  | "inquiry-confirm"
  | "inquiry-success"
  | "td-select-showroom"
  | "td-select-datetime"
  | "td-confirm"
  | "td-success"
  | "reservation-terms"
  | "reservation-payment"
  | "reservation-success"
  | "my-activity"
  | "activity-detail"
  | "promotions"
  | "promo-detail";

export type ModalId =
  | "compare-tray"
  | "compare-full-warning"
  | "login-prompt"
  | "network-error"
  | null;

export interface AppState {
  currentScreen: ScreenId;
  previousScreen: ScreenId | null;
  isLoggedIn: boolean;
  buyer: Buyer | null;
  currentCarId: string | null;
  currentPromoId: string | null;
  currentActivityId: string | null;
  compareList: string[];
  catalogFilter: string | null;
  activeModal: ModalId;
  loginReturnScreen: ScreenId | null;
  loginReturnAction: string | null;
  inquiryForm: InquiryFormData | null;
  testDriveBooking: Partial<TestDriveBooking>;
  loginAttempts: number;
  lockUntil: number | null;
}
