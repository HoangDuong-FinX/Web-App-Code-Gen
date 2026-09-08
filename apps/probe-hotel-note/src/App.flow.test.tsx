import { describe, test, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import App from "./App";
import { setLoginOutcome } from "./fixtures/auth";
import { setInquiryOutcome, setTestDriveOutcome, setPaymentOutcome } from "./fixtures/reservation";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  setLoginOutcome("success");
  setInquiryOutcome("success");
  setTestDriveOutcome("success");
  setPaymentOutcome("success");
});

describe("Navigation: Home screen", () => {
  test("renders home screen with featured cars and promotions", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /Xe n\u1ed5i b\u1eadt/i })).toBeTruthy();
    expect(screen.getAllByTestId("featured-car-card").length).toBeGreaterThan(0);
  });

  test("home -> catalog via quick filter", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("quick-filter-sedan"));
    expect(screen.getByRole("heading", { name: /Danh s\u00e1ch xe/i })).toBeTruthy();
  });

  test("home -> search via search button", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("search-trigger"));
    expect(screen.getByTestId("search-input")).toBeTruthy();
  });

  test("home -> promotions via view all promos", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("view-all-promos"));
    expect(screen.getAllByTestId("promo-list-card").length).toBeGreaterThan(0);
  });

  test("home -> car-detail via featured car card", () => {
    render(<App />);
    const cards = screen.getAllByTestId("featured-car-card");
    fireEvent.click(cards[0]);
    expect(screen.getByRole("heading", { name: /Chi ti\u1ebft xe/i })).toBeTruthy();
  });
});

describe("Navigation: Catalog screen", () => {
  test("catalog -> car-detail via car card", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("quick-filter-sedan"));
    const cards = screen.getAllByTestId("car-list-card");
    fireEvent.click(cards[0]);
    expect(screen.getByRole("heading", { name: /Chi ti\u1ebft xe/i })).toBeTruthy();
  });

  test("catalog filter toggle works", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("view-all-featured"));
    fireEvent.click(screen.getByTestId("filter-suv"));
    expect(screen.getByTestId("clear-filters")).toBeTruthy();
    fireEvent.click(screen.getByTestId("clear-filters"));
    expect(screen.queryByTestId("clear-filters")).toBeNull();
  });
});

describe("Navigation: Car detail -> Login prompt for guests", () => {
  test("guest tapping inquiry shows login prompt", () => {
    render(<App />);
    const cards = screen.getAllByTestId("featured-car-card");
    fireEvent.click(cards[0]);
    fireEvent.click(screen.getByTestId("inquiry-cta"));
    expect(screen.getByTestId("login-prompt-dialog")).toBeTruthy();
  });

  test("login prompt -> login screen", () => {
    render(<App />);
    const cards = screen.getAllByTestId("featured-car-card");
    fireEvent.click(cards[0]);
    fireEvent.click(screen.getByTestId("inquiry-cta"));
    fireEvent.click(screen.getByTestId("go-to-login"));
    expect(screen.getByTestId("login-identity")).toBeTruthy();
  });

  test("login prompt dismiss closes modal", () => {
    render(<App />);
    const cards = screen.getAllByTestId("featured-car-card");
    fireEvent.click(cards[0]);
    fireEvent.click(screen.getByTestId("inquiry-cta"));
    fireEvent.click(screen.getByTestId("dismiss-login-prompt"));
    expect(screen.queryByTestId("login-prompt-dialog")).toBeNull();
  });
});

describe("Login flow", () => {
  test("successful login navigates to return screen", async () => {
    setLoginOutcome("success");
    render(<App />);
    const cards = screen.getAllByTestId("featured-car-card");
    fireEvent.click(cards[0]);
    fireEvent.click(screen.getByTestId("inquiry-cta"));
    fireEvent.click(screen.getByTestId("go-to-login"));
    fireEvent.change(screen.getByTestId("login-identity"), { target: { value: "test@email.com" } });
    fireEvent.change(screen.getByTestId("login-password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByTestId("login-submit"));
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Li\u00ean h\u1ec7 t\u01b0 v\u1ea5n/i })).toBeTruthy();
    });
  });

  test("failed login shows error", async () => {
    setLoginOutcome("fail");
    render(<App />);
    fireEvent.click(screen.getByTestId("profile-trigger"));
    fireEvent.change(screen.getByTestId("login-identity"), { target: { value: "test@email.com" } });
    fireEvent.change(screen.getByTestId("login-password"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByTestId("login-submit"));
    await waitFor(() => {
      expect(screen.getByTestId("login-error")).toBeTruthy();
    });
  });

  test("login -> register link", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("profile-trigger"));
    fireEvent.click(screen.getByTestId("register-link"));
    expect(screen.getByTestId("register-name")).toBeTruthy();
  });
});

describe("Inquiry flow", () => {
  async function loginAndGoToInquiry() {
    setLoginOutcome("success");
    render(<App />);
    const cards = screen.getAllByTestId("featured-car-card");
    fireEvent.click(cards[0]);
    fireEvent.click(screen.getByTestId("inquiry-cta"));
    fireEvent.click(screen.getByTestId("go-to-login"));
    fireEvent.change(screen.getByTestId("login-identity"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByTestId("login-password"), { target: { value: "pass" } });
    fireEvent.click(screen.getByTestId("login-submit"));
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Li\u00ean h\u1ec7 t\u01b0 v\u1ea5n/i })).toBeTruthy();
    });
  }

  test("inquiry form -> confirm -> success", async () => {
    setInquiryOutcome("success");
    await loginAndGoToInquiry();
    fireEvent.click(screen.getByTestId("inquiry-continue"));
    expect(screen.getByRole("heading", { name: /X\u00e1c nh\u1eadn y\u00eau c\u1ea7u/i })).toBeTruthy();
    fireEvent.click(screen.getByTestId("inquiry-submit"));
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Y\u00eau c\u1ea7u \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eedi/i })).toBeTruthy();
    });
  });

  test("inquiry submit failure shows error", async () => {
    setInquiryOutcome("fail");
    await loginAndGoToInquiry();
    fireEvent.click(screen.getByTestId("inquiry-continue"));
    fireEvent.click(screen.getByTestId("inquiry-submit"));
    await waitFor(() => {
      expect(screen.getByTestId("inquiry-submit-error")).toBeTruthy();
    });
  });

  test("inquiry success -> back to home", async () => {
    setInquiryOutcome("success");
    await loginAndGoToInquiry();
    fireEvent.click(screen.getByTestId("inquiry-continue"));
    fireEvent.click(screen.getByTestId("inquiry-submit"));
    await waitFor(() => {
      expect(screen.getByTestId("back-to-home")).toBeTruthy();
    });
    fireEvent.click(screen.getByTestId("back-to-home"));
    expect(screen.getByRole("heading", { name: /Xe n\u1ed5i b\u1eadt/i })).toBeTruthy();
  });
});

describe("Compare flow", () => {
  test("add cars to compare, see tray, open compare", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("view-all-featured"));
    const toggles = screen.getAllByTestId("compare-toggle");
    fireEvent.click(toggles[0]);
    fireEvent.click(toggles[1]);
    expect(screen.getByTestId("open-compare")).toBeTruthy();
    fireEvent.click(screen.getByTestId("open-compare"));
    expect(screen.getByRole("heading", { name: /So s\u00e1nh xe/i })).toBeTruthy();
  });

  test("compare tray shows after adding a car from car-detail", () => {
    render(<App />);
    const cards = screen.getAllByTestId("featured-car-card");
    fireEvent.click(cards[0]);
    fireEvent.click(screen.getByTestId("compare-cta"));
    expect(screen.getByTestId("open-compare")).toBeTruthy();
  });
});

describe("Promotions flow", () => {
  test("promotions -> promo-detail -> eligible car -> car-detail", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("view-all-promos"));
    const cards = screen.getAllByTestId("promo-list-card");
    fireEvent.click(cards[0]);
    expect(screen.getByRole("heading", { name: /Chi ti\u1ebft khuy\u1ebfn m\u00e3i/i })).toBeTruthy();
    const eligibleCards = screen.getAllByTestId("eligible-car-card");
    fireEvent.click(eligibleCards[0]);
    expect(screen.getByRole("heading", { name: /Chi ti\u1ebft xe/i })).toBeTruthy();
  });
});

describe("Bottom navigation", () => {
  test("nav-catalog navigates to catalog", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-catalog"));
    expect(screen.getByRole("heading", { name: /Danh s\u00e1ch xe/i })).toBeTruthy();
  });

  test("nav-promotions navigates to promotions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-promotions"));
    expect(screen.getAllByTestId("promo-list-card").length).toBeGreaterThan(0);
  });

  test("nav-activity navigates to my-activity", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-activity"));
    expect(screen.getByRole("heading", { name: /Ho\u1ea1t \u0111\u1ed9ng c\u1ee7a t\u00f4i/i })).toBeTruthy();
  });
});
