import type { PurchaseInquiry, TestDriveBooking, AdminInquiry } from "../types";

export const sampleTestDrives: TestDriveBooking[] = [
  {
    id: "td-001",
    carId: "car-001",
    carMakeModel: "Toyota Camry 2024",
    date: "2025-07-15",
    time: "10:00",
    status: "scheduled",
    referenceNumber: "TD-20250715-001",
    location: "Saigon Auto Center, Q1, HCM",
  },
  {
    id: "td-002",
    carId: "car-003",
    carMakeModel: "Hyundai Tucson 2024",
    date: "2025-07-10",
    time: "14:00",
    status: "completed",
    referenceNumber: "TD-20250710-002",
    location: "TC Motor Showroom, Q7, HCM",
  },
];

export const samplePurchaseInquiries: PurchaseInquiry[] = [
  {
    id: "pi-001",
    carId: "car-002",
    carMakeModel: "Honda CR-V 2023",
    offerPrice: 1000000000,
    submittedDate: "2025-07-05",
    status: "pending",
    referenceNumber: "PI-20250705-001",
    type: "purchase",
    financing: { loanTerm: 36, downPaymentPercent: 20 },
    responses: [],
  },
  {
    id: "pi-002",
    carId: "car-004",
    carMakeModel: "Mercedes-Benz C200 2023",
    offerPrice: 1600000000,
    submittedDate: "2025-07-01",
    status: "responded",
    referenceNumber: "PI-20250701-002",
    type: "purchase",
    responses: [
      { date: "2025-07-02", text: "Thank you for your interest. We can offer a special price of 1,650,000,000 VND with complimentary service package." },
    ],
  },
];

export const sampleAdminInquiries: AdminInquiry[] = [
  {
    id: "ai-001",
    customerName: "Nguyen Van A",
    customerContact: "0901-234-567 / nguyenvana@email.com",
    carMakeModel: "Honda CR-V 2023",
    type: "purchase",
    submittedDate: "2025-07-05",
    status: "pending",
    offerPrice: 1000000000,
    financing: "36 months, 20% down",
    customerNotes: "Interested in the CR-V. Can you offer any additional discounts?",
  },
  {
    id: "ai-002",
    customerName: "Le Van C",
    customerContact: "0903-456-789 / levanc@email.com",
    carMakeModel: "Toyota Camry 2024",
    type: "test-drive",
    submittedDate: "2025-07-08",
    status: "pending",
    appointmentDetails: "July 15, 2025 at 10:00 AM",
    customerNotes: "Would like to test drive the Camry with the family.",
  },
  {
    id: "ai-003",
    customerName: "Pham Thi D",
    customerContact: "0904-567-890 / phamthid@email.com",
    carMakeModel: "Mercedes-Benz C200 2023",
    type: "purchase",
    submittedDate: "2025-07-01",
    status: "responded",
    offerPrice: 1600000000,
    customerNotes: "Looking for the best price on the C200.",
  },
];

export function getInquiryById(id: string): PurchaseInquiry | undefined {
  return samplePurchaseInquiries.find((i) => i.id === id);
}

export function getAdminInquiryById(id: string): AdminInquiry | undefined {
  return sampleAdminInquiries.find((i) => i.id === id);
}