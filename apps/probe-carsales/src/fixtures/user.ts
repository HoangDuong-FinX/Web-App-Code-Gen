import type { PurchaseInquiry, TestDriveBooking } from "../types";

export const sampleUser = {
  userId: "user-001",
  name: "Nguyen Van A",
  email: "nguyenvana@email.com",
  phone: "0901-234-567",
  isAuthenticated: true,
  isStaff: false,
};

export const sampleStaff = {
  userId: "staff-001",
  name: "Tran Thi B",
  email: "tranthib@carsales.local",
  phone: "0902-345-678",
  isAuthenticated: true,
  isStaff: true,
};