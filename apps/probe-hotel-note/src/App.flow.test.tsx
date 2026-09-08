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
    expect(screen.getByText("Xe n\u1ed5i b\u1eadt")).toBeTruthy();
    expect(screen.getByText("Khuy\u1ebfn m\u00e3i")).toBeTruthy();
    expect(screen.getAllByTestId("featured-car-card").length).toBeGreaterThan(0);
  });

  test("home -> catalog via quick filter", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("quick-filter-sedan"));
    expect(screen.getByText("Danh s\u00e1ch xe")).toBeTruthy();
  });

  test("home -> search via search button", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("search-trigger"));
    expect(screen.getByTestId("search-input")).toBeTruthy();
  });

  test("home -> promotions via view all promos", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("view-all-promos"));
    expect(screen.getByText("Khuy\u1ebfn m\u00e3i")).toBeTruthy();
    expect(screen.getAllByTestId("promo-list-card").length).toBeGreaterThan(0);
  });

  test("home -> car-detail via featured car card", () => {
    render(<App />);
    const cards = screen.getAllByTestId("featured-car-card");
    fireEvent.click(cards[0]);
    expect(screen.getByText("Chi ti\u1ebft xe")).toBeTruthy();
  });
});

describe("Navigation: Catalog screen", () => {
  test("catalog -> car-detail via car card", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("quick-filter-sedan"));
    const cards = screen.getAllByTestId("car-list-card");
    fireEvent.click(cards[0]);
    expect(screen.getByText("Chi ti\u1ebft xe")).toBeTruthy();
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
      expect(screen.getByText("Li\u00ean h\u1ec7 t\u01b0 v\u1ea5n")).toBeTruthy();
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
      expect(screen.getByText("Li\u00ean h\u1ec7 t\u01b0 v\u1ea5n")).toBeTruthy();
    });
  }

  test("inquiry form -> confirm -> success", async () => {
    setInquiryOutcome("success");
    await loginAndGoToInquiry();
    fireEvent.click(screen.getByTestId("inquiry-continue"));
    expect(screen.getByText("X\u00e1c nh\u1eadn y\u00eau c\u1ea7u")).toBeTruthy();
    fireEvent.click(screen.getByTestId("inquiry-submit"));
    await waitFor(() => {
      expect(screen.getByText("Y\u00eau c\u1ea7u \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eedi")).toBeTruthy();
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
    expect(screen.getByText("Xe n\u1ed5i b\u1eadt")).toBeTruthy();
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
    expect(screen.getByText("So s\u00e1nh xe")).toBeTruthy();
  });

  test("compare full warning when adding 4th car", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("view-all-featured"));
    const toggles = screen.getAllByTestId("compare-toggle");
    fireEvent.click(toggles[0]);
    fireEvent.click(toggles[1]);
    fireEvent.click(toggles[2]);
    fireEvent.click(toggles[3]);
    expect(screen.getByTestId("compare-full-dialog")).toBeTruthy();
    fireEvent.click(screen.getByTestId("dismiss-compare-warning"));
    expect(screen.queryByTestId("compare-full-dialog")).toBeNull();
  });
});

describe("Promotions flow", () => {
  test("promotions -> promo-detail -> eligible car -> car-detail", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("view-all-promos"));
    const cards = screen.getAllByTestId("promo-list-card");
    fireEvent.click(cards[0]);
    expect(screen.getByText("Chi ti\u1ebft khuy\u1ebfn m\u00e3i")).toBeTruthy();
    const eligibleCards = screen.getAllByTestId("eligible-car-card");
    fireEvent.click(eligibleCards[0]);
    expect(screen.getByText("Chi ti\u1ebft xe")).toBeTruthy();
  });
});

describe("Bottom navigation", () => {
  test("nav-catalog navigates to catalog", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-catalog"));
    expect(screen.getByText("Danh s\u00e1ch xe")).toBeTruthy();
  });

  test("nav-promotions navigates to promotions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-promotions"));
    expect(screen.getAllByTestId("promo-list-card").length).toBeGreaterThan(0);
  });

  test("nav-activity navigates to my-activity", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-activity"));
    expect(screen.getByText("Ho\u1ea1t \u0111\u1ed9ng c\u1ee7a t\u00f4i")).toBeTruthy();
  });
});
