import { render, screen, fireEvent, cleanup, waitFor, act } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import App from "./App";
import { setSubmitTestDriveOutcome, setSubmitInquiryOutcome } from "./fixtures/cars";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  setSubmitTestDriveOutcome("success");
  setSubmitInquiryOutcome("success");
});

describe("Catalog screen", () => {
  it("renders catalog with car listings", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
  });

  it("navigates to filter when filter button clicked", () => {
    render(<App />);
    const filterBtn = screen.getByRole("button", { name: /b\u1ed9 l\u1ecdc|open filter/i });
    fireEvent.click(filterBtn);
    expect(screen.getByText(/l\u1ecdc xe|filter cars/i)).toBeTruthy();
  });

  it("navigates to car detail when car clicked", () => {
    render(<App />);
    const carButtons = screen.getAllByRole("button", { name: /toyota|honda|hyundai|mercedes|vinfast|mazda/i });
    fireEvent.click(carButtons[0]);
    expect(screen.getByText(/th\u00f4ng s\u1ed1 k\u1ef9 thu\u1eadt|specifications/i)).toBeTruthy();
  });
});

describe("Car detail screen", () => {
  function goToDetail() {
    render(<App />);
    const carButtons = screen.getAllByRole("button", { name: /toyota camry/i });
    fireEvent.click(carButtons[0]);
  }

  it("shows car specifications", () => {
    goToDetail();
    expect(screen.getByText(/th\u00f4ng s\u1ed1 k\u1ef9 thu\u1eadt|specifications/i)).toBeTruthy();
    expect(screen.getByText(/2\.5L 4-Cylinder/i)).toBeTruthy();
  });

  it("can save to favorites", () => {
    goToDetail();
    const saveBtn = screen.getByRole("button", { name: /l\u01b0u xe v\u00e0o|save this car/i });
    fireEvent.click(saveBtn);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("can add to compare", () => {
    goToDetail();
    const compareBtn = screen.getByRole("button", { name: /th\u00eam xe v\u00e0o so s\u00e1nh|add this car to comparison/i });
    fireEvent.click(compareBtn);
  });

  it("navigates to test drive booking", () => {
    goToDetail();
    const tdBtn = screen.getByRole("button", { name: /\u0111\u1eb7t l\u1ecbch l\u00e1i th\u1eed|schedule a test drive/i });
    fireEvent.click(tdBtn);
    expect(screen.getByText(/\u0111\u1eb7t l\u00e1i th\u1eed|request test drive/i)).toBeTruthy();
  });

  it("navigates to purchase inquiry", () => {
    goToDetail();
    const offerBtn = screen.getByRole("button", { name: /g\u1eedi y\u00eau c\u1ea7u mua|submit a purchase inquiry/i });
    fireEvent.click(offerBtn);
    expect(screen.getByText(/\u0111\u1eb7t gi\u00e1|make an offer/i)).toBeTruthy();
  });

  it("navigates back to catalog", () => {
    goToDetail();
    const backBtn = screen.getByRole("button", { name: /quay l\u1ea1i m\u00e0n h\u00ecnh|go back/i });
    fireEvent.click(backBtn);
    expect(screen.getByText(/danh m\u1ee5c xe|car catalog/i)).toBeTruthy();
  });
});

describe("Test drive flow", () => {
  function goToTestDrive() {
    render(<App />);
    const carButtons = screen.getAllByRole("button", { name: /toyota camry/i });
    fireEvent.click(carButtons[0]);
    const tdBtn = screen.getByRole("button", { name: /\u0111\u1eb7t l\u1ecbch l\u00e1i th\u1eed|schedule a test drive/i });
    fireEvent.click(tdBtn);
  }

  it("shows booking form with pre-filled user info", () => {
    goToTestDrive();
    const nameInput = screen.getByLabelText(/h\u1ecd v\u00e0 t\u00ean c\u1ee7a b\u1ea1n|your full name/i);
    expect((nameInput as HTMLInputElement).value).toBe("Nguyen Van A");
  });

  it("submits and shows success screen", async () => {
    vi.useFakeTimers();
    goToTestDrive();
    const dateInput = screen.getByLabelText(/ch\u1ecdn ng\u00e0y|select test drive date/i);
    fireEvent.change(dateInput, { target: { value: "2026-01-15" } });
    const timeSelect = screen.getByLabelText(/ch\u1ecdn gi\u1edd|select test drive time/i);
    fireEvent.change(timeSelect, { target: { value: "09:00" } });
    const confirmBtn = screen.getByRole("button", { name: /x\u00e1c nh\u1eadn \u0111\u1eb7t|confirm test drive/i });
    fireEvent.click(confirmBtn);
    await act(async () => { vi.advanceTimersByTime(600); });
    expect(screen.getByText(/th\u00e0nh c\u00f4ng|confirmed/i)).toBeTruthy();
    vi.useRealTimers();
  });

  it("shows error screen on failure", async () => {
    vi.useFakeTimers();
    setSubmitTestDriveOutcome("fail");
    goToTestDrive();
    const dateInput = screen.getByLabelText(/ch\u1ecdn ng\u00e0y|select test drive date/i);
    fireEvent.change(dateInput, { target: { value: "2026-01-15" } });
    const timeSelect = screen.getByLabelText(/ch\u1ecdn gi\u1edd|select test drive time/i);
    fireEvent.change(timeSelect, { target: { value: "09:00" } });
    const confirmBtn = screen.getByRole("button", { name: /x\u00e1c nh\u1eadn \u0111\u1eb7t|confirm test drive/i });
    fireEvent.click(confirmBtn);
    expect(screen.getByText(/th\u1ea5t b\u1ea1i|failed/i)).toBeTruthy();
    vi.useRealTimers();
  });

  it("cancel returns to car detail", () => {
    goToTestDrive();
    const cancelBtns = screen.getAllByRole("button", { name: /h\u1ee7y \u0111\u1eb7t l\u00e1i th\u1eed|cancel test drive/i });
    fireEvent.click(cancelBtns[cancelBtns.length - 1]);
    expect(screen.getByText(/th\u00f4ng s\u1ed1 k\u1ef9 thu\u1eadt|specifications/i)).toBeTruthy();
  });
});

describe("Purchase inquiry flow", () => {
  function goToInquiry() {
    render(<App />);
    const carButtons = screen.getAllByRole("button", { name: /toyota camry/i });
    fireEvent.click(carButtons[0]);
    const offerBtn = screen.getByRole("button", { name: /g\u1eedi y\u00eau c\u1ea7u mua|submit a purchase inquiry/i });
    fireEvent.click(offerBtn);
  }

  it("shows offer validation error for out-of-range price", () => {
    goToInquiry();
    const offerInput = screen.getByLabelText(/nh\u1eadp gi\u00e1|enter your offer/i);
    fireEvent.change(offerInput, { target: { value: "100" } });
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("cancel returns to car detail", () => {
    goToInquiry();
    const cancelBtns = screen.getAllByRole("button", { name: /h\u1ee7y y\u00eau c\u1ea7u|cancel purchase/i });
    fireEvent.click(cancelBtns[cancelBtns.length - 1]);
    expect(screen.getByText(/th\u00f4ng s\u1ed1 k\u1ef9 thu\u1eadt|specifications/i)).toBeTruthy();
  });
});

describe("Navigation tabs", () => {
  it("navigates to favorites tab", () => {
    render(<App />);
    const favTab = screen.getByRole("button", { name: /y\u00eau th\u00edch|favorites/i });
    fireEvent.click(favTab);
    expect(screen.getByText(/xe y\u00eau th\u00edch|my favorites/i)).toBeTruthy();
  });

  it("navigates to activity tab", () => {
    render(<App />);
    const actTab = screen.getByRole("button", { name: /ho\u1ea1t \u0111\u1ed9ng|my activity/i });
    fireEvent.click(actTab);
    expect(screen.getByText(/ho\u1ea1t \u0111\u1ed9ng|my activity/i)).toBeTruthy();
  });

  it("shows admin tab when staff mode is on", () => {
    render(<App />);
    const staffBtn = screen.getByRole("button", { name: /toggle staff/i });
    fireEvent.click(staffBtn);
    const adminTab = screen.getByRole("button", { name: /qu\u1ea3n tr\u1ecb|admin/i });
    fireEvent.click(adminTab);
    expect(screen.getByText(/b\u1ea3ng \u0111i\u1ec1u khi\u1ec3n|staff dashboard/i)).toBeTruthy();
  });
});

describe("Admin flow", () => {
  function goToAdmin() {
    render(<App />);
    const staffBtn = screen.getByRole("button", { name: /toggle staff/i });
    fireEvent.click(staffBtn);
    const adminTab = screen.getByRole("button", { name: /qu\u1ea3n tr\u1ecb|admin/i });
    fireEvent.click(adminTab);
  }

  it("navigates to inventory management", () => {
    goToAdmin();
    const invBtn = screen.getByRole("button", { name: /qu\u1ea3n l\u00fd kho|manage inventory/i });
    fireEvent.click(invBtn);
    expect(screen.getByText(/qu\u1ea3n l\u00fd kho xe|inventory management/i)).toBeTruthy();
  });

  it("navigates to inquiry management", () => {
    goToAdmin();
    const inqBtn = screen.getByRole("button", { name: /qu\u1ea3n l\u00fd y\u00eau c\u1ea7u|manage inquiries/i });
    fireEvent.click(inqBtn);
    expect(screen.getByText(/qu\u1ea3n l\u00fd y\u00eau c\u1ea7u|inquiry management/i)).toBeTruthy();
  });
});
