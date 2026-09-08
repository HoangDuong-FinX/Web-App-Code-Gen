export interface Car {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  engine: string;
  exteriorColor: string;
  interiorColor: string;
  description: string;
  condition: 'new' | 'used';
  tag?: string;
  photos: { url: string; thumbnailUrl: string }[];
  dealer: Dealer;
  features?: string[];
  dimensions?: string;
}

export interface Dealer {
  id: string;
  name: string;
  rating: number;
  location: string;
  avatarUrl: string;
  phone: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
}

export interface BodyType {
  id: string;
  label: string;
  iconUrl: string;
}

export interface TimeSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface DealerLocation {
  locationId: string;
  name: string;
  address: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  carName: string;
  carThumbnail: string;
  date: string;
  amount: number;
  status: OrderStatus;
  car?: { name: string; thumbnail: string; keySpecs: string };
  paymentMethod?: string;
  amountPaid?: number;
  remainingBalance?: number;
  dealer?: { name: string; phone: string; notes: string };
  statusTimeline?: { status: string; timestamp: string }[];
}

export type OrderStatus =
  | 'DepositPaid'
  | 'Processing'
  | 'ReadyForDelivery'
  | 'Delivered'
  | 'CancellationRequested'
  | 'Cancelled';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: 'buyer' | 'dealer';
}

export interface PaymentMethod {
  id: string;
  type: string;
  label: string;
  iconUrl: string;
  enabled: boolean;
}

export type ScreenId =
  | 'home'
  | 'search-results'
  | 'car-detail'
  | 'photo-gallery'
  | 'compare'
  | 'financing-calculator'
  | 'test-drive-booking'
  | 'test-drive-success'
  | 'test-drive-failed'
  | 'wishlist'
  | 'order-review'
  | 'payment-method'
  | 'payment-success'
  | 'payment-failed'
  | 'my-orders'
  | 'order-detail'
  | 'login'
  | 'register'
  | 'otp-verify'
  | 'forgot-password'
  | 'contact-options'
  | 'send-inquiry'
  | 'inquiry-sent'
  | 'profile'
  | 'edit-profile'
  | 'dealer-dashboard'
  | 'add-edit-car'
  | 'dealer-leads';

export type ModalId =
  | 'compare-bar'
  | 'wishlist-toast'
  | 'cancel-order-confirm'
  | 'remove-listing-confirm'
  | 'logout-confirm'
  | null;

export interface AppState {
  currentScreen: ScreenId;
  previousScreen: ScreenId | null;
  isAuthenticated: boolean;
  user: UserProfile | null;
  compareList: string[];
  wishlistIds: string[];
  cartOrigin: ScreenId | null;
  selectedCarId: string | null;
  selectedOrderId: string | null;
  activeModal: ModalId;
  searchKeyword: string;
  searchFilters: Record<string, string>;
  testDriveReferenceNumber: string | null;
  paymentOrderNumber: string | null;
  paymentFailureReason: string | null;
  registerPhone: string | null;
  alternativeSlots: TimeSlot[];
  editingCarId: string | null;
}