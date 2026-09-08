export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: "available" | "out_of_stock" | "discontinued";
  thumbnailUrl: string;
  images: string[];
  has360View: boolean;
  colors: CarColor[];
  variants: CarVariant[];
  specs: CarSpec[];
  description: string;
  fuelType: string;
  seats: number;
  isWishlisted: boolean;
}

export interface CarColor {
  id: string;
  name: string;
  hex: string;
}

export interface CarVariant {
  id: string;
  name: string;
  price: number;
}

export interface CarSpec {
  label: string;
  value: string;
}

export interface Brand {
  id: string;
  name: string;
  iconUrl: string;
}

export interface PromoBanner {
  id: string;
  imageUrl: string;
  targetType: string;
  targetId: string;
}

export interface Dealer {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Order {
  id: string;
  orderCode: string;
  carName: string;
  carThumbnailUrl: string;
  depositAmount: number;
  status: string;
  createdAt: string;
}

export interface OrderDetail {
  id: string;
  orderCode: string;
  status: string;
  car: {
    name: string;
    thumbnailUrl: string;
    variant: string;
    color: string;
    listedPrice: number;
  };
  depositAmount: number;
  timeline: { status: string; datetime: string; note?: string }[];
  dealer: { name: string; address: string; phone: string };
  canCancel: boolean;
  testDrive?: { bookingCode: string; datetime: string; canCancel: boolean };
}

export interface AdminDashboardData {
  newOrdersCount: number;
  monthlyRevenue: number;
  testDrivesToday: number;
  topSellingCar: { name: string; count: number };
}

export interface AdminCar {
  id: string;
  name: string;
  thumbnailUrl: string;
  price: number;
  stockStatus: string;
  hasActiveDeposits: boolean;
}

export interface AdminOrder {
  id: string;
  orderCode: string;
  customerName: string;
  carName: string;
  depositAmount: number;
  status: string;
  createdAt: string;
}

export interface AdminOrderDetail {
  id: string;
  orderCode: string;
  status: string;
  customer: { name: string; phone: string; cccd: string; address: string };
  car: { name: string; variant: string; color: string; listedPrice: number };
  depositAmount: number;
}

export interface AdminTestDrive {
  id: string;
  bookingCode: string;
  customerName: string;
  carName: string;
  dealerName: string;
  dateTime: string;
  status: string;
}

export interface AdminTestDriveDetail {
  id: string;
  bookingCode: string;
  status: string;
  customer: { name: string; phone: string };
  car: { name: string };
  dealer: { name: string };
  dateTime: string;
}

export interface SalesReportData {
  revenueTimeSeries: { date: string; revenue: number }[];
  ordersByModel: { model: string; count: number }[];
  ordersByDealer: { dealer: string; count: number }[];
  conversionFunnel: { views: number; testDrives: number; deposits: number; confirmed: number };
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
}

export type ScreenId =
  | "home"
  | "search-results"
  | "car-detail"
  | "compare"
  | "loan-calc"
  | "login"
  | "otp"
  | "otp-failed"
  | "profile-setup"
  | "wishlist"
  | "profile"
  | "test-drive-select"
  | "test-drive-confirm"
  | "test-drive-success"
  | "test-drive-no-slot"
  | "deposit-variant"
  | "deposit-info"
  | "deposit-review"
  | "deposit-payment"
  | "deposit-success"
  | "deposit-failed"
  | "orders-list"
  | "order-detail"
  | "admin-dashboard"
  | "admin-car-list"
  | "admin-car-form"
  | "admin-orders"
  | "admin-order-detail"
  | "admin-test-drives"
  | "admin-test-drive-detail"
  | "admin-sales-report";

export type AuthRole = "guest" | "customer" | "admin";
