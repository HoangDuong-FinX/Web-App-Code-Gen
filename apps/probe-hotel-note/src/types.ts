export interface Car {
  id: string;
  name: string;
  thumbnailUrl: string;
  formattedPrice: string;
  condition: string;
  specsSummary: string;
  status: 'available' | 'reserved' | 'sold';
  hasActivePromo: boolean;
  promoLabel: string;
  monthlyInstallment: string;
  photos: Array<{ url: string; label: string }>;
  specs: Array<{ label: string; value: string }>;
  dealer: Dealer;
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
  applicableModelsPreview: string;
  termsAndConditions: string;
  eligibleCars: Array<EligibleCar>;
}

export interface EligibleCar {
  id: string;
  name: string;
  thumbnailUrl: string;
  formattedPrice: string;
  promoDiscountTag: string;
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
}

export interface Buyer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface InquiryData {
  contactMethod: 'call' | 'zalo' | 'email';
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
  holdUntilDate: string;
  depositAmountPaid: string;
  nextStepsMessage: string;
}

export interface ActivityItem {
  id: string;
  type: 'inquiry' | 'test-drive' | 'reservation';
  carId: string;
  carName: string;
  statusLabel: string;
  statusVariant: 'success' | 'warning' | 'neutral' | 'error';
  date: string;
  showroomName?: string;
  depositAmount?: string;
}

export interface ActivityDetail {
  car: { name: string; thumbnailUrl: string; formattedPrice: string; id: string };
  activity: { statusLabel: string; statusVariant: string; typeSpecificDetails: string };
  timeline: Array<{ date: string; description: string }>;
}

export type ScreenId =
  | 'home' | 'catalog' | 'car-detail' | 'search' | 'compare'
  | 'login' | 'register'
  | 'inquiry-form' | 'inquiry-confirm' | 'inquiry-success'
  | 'td-select-showroom' | 'td-select-datetime' | 'td-confirm' | 'td-success'
  | 'reservation-terms' | 'reservation-payment' | 'reservation-success'
  | 'my-activity' | 'activity-detail'
  | 'promotions' | 'promo-detail';
