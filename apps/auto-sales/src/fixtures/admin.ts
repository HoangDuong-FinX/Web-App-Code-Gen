import type { AdminDashboardData, AdminCar, AdminTestDrive, AdminTestDriveDetail, SalesReportData } from "../types";

export const FIXTURE_ADMIN_DASHBOARD: AdminDashboardData = {
  newOrdersCount: 12,
  monthlyRevenue: 2500000000,
  testDrivesToday: 5,
  topSellingCar: { name: "Toyota Camry 2.5Q", count: 28 },
};

export const FIXTURE_ADMIN_CARS: AdminCar[] = [
  { id: "car-001", name: "Toyota Camry 2.5Q", thumbnailUrl: "https://placehold.co/80x55/1a1a2e/eaeaea?text=Camry", price: 1405000000, stockStatus: "available", hasActiveDeposits: true },
  { id: "car-002", name: "Honda CR-V L", thumbnailUrl: "https://placehold.co/80x55/16213e/eaeaea?text=CRV", price: 1138000000, stockStatus: "available", hasActiveDeposits: false },
  { id: "car-003", name: "Hyundai Tucson 2.0", thumbnailUrl: "https://placehold.co/80x55/0f3460/eaeaea?text=Tucson", price: 979000000, stockStatus: "available", hasActiveDeposits: false },
  { id: "car-004", name: "VinFast VF 8 Plus", thumbnailUrl: "https://placehold.co/80x55/2d4059/eaeaea?text=VF8", price: 1319000000, stockStatus: "available", hasActiveDeposits: true },
  { id: "car-005", name: "Mazda CX-5 Premium", thumbnailUrl: "https://placehold.co/80x55/533483/eaeaea?text=CX5", price: 979000000, stockStatus: "out_of_stock", hasActiveDeposits: false },
  { id: "car-006", name: "Kia Seltos 1.6 Turbo", thumbnailUrl: "https://placehold.co/80x55/e94560/eaeaea?text=Seltos", price: 759000000, stockStatus: "available", hasActiveDeposits: false },
];

export const FIXTURE_ADMIN_TEST_DRIVES: AdminTestDrive[] = [
  { id: "td-001", bookingCode: "TD-20240905-001", customerName: "Nguyen Van A", carName: "Toyota Camry 2.5Q", dealerName: "AutoMart Quan 1", dateTime: "05/09/2024 10:00", status: "pending" },
  { id: "td-002", bookingCode: "TD-20240906-002", customerName: "Tran Thi B", carName: "Honda CR-V L", dealerName: "AutoMart Quan 7", dateTime: "06/09/2024 14:00", status: "confirmed" },
  { id: "td-003", bookingCode: "TD-20240904-003", customerName: "Le Van C", carName: "Kia Seltos", dealerName: "AutoMart Ha Noi", dateTime: "04/09/2024 09:00", status: "completed" },
];

export const FIXTURE_ADMIN_TEST_DRIVE_DETAIL: AdminTestDriveDetail = {
  id: "td-001",
  bookingCode: "TD-20240905-001",
  status: "pending",
  customer: { name: "Nguyen Van A", phone: "0901234567" },
  car: { name: "Toyota Camry 2.5Q" },
  dealer: { name: "AutoMart Quan 1" },
  dateTime: "05/09/2024 10:00",
};

export const FIXTURE_SALES_REPORT: SalesReportData = {
  revenueTimeSeries: [
    { date: "01/09", revenue: 350000000 },
    { date: "02/09", revenue: 500000000 },
    { date: "03/09", revenue: 280000000 },
    { date: "04/09", revenue: 620000000 },
    { date: "05/09", revenue: 450000000 },
    { date: "06/09", revenue: 380000000 },
    { date: "07/09", revenue: 720000000 },
  ],
  ordersByModel: [
    { model: "Toyota Camry", count: 28 },
    { model: "Honda CR-V", count: 22 },
    { model: "VinFast VF 8", count: 18 },
    { model: "Hyundai Tucson", count: 15 },
    { model: "Mazda CX-5", count: 12 },
  ],
  ordersByDealer: [
    { dealer: "AutoMart Q.1", count: 45 },
    { dealer: "AutoMart Q.7", count: 32 },
    { dealer: "AutoMart HN", count: 28 },
  ],
  conversionFunnel: { views: 15000, testDrives: 450, deposits: 120, confirmed: 95 },
};
