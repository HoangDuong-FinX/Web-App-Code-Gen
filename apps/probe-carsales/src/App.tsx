import { useState, useCallback } from "react";
import type { ScreenId, Car, Favorite, TestDriveBooking, FilterCriteria } from "./types";
import { t } from "./i18n/index";
import { sampleCars, getCarById, toFavorite, sampleAvailableSlots, sampleInventory, getLoadCatalogOutcome, getSaveFavoriteOutcome, getRemoveFavoriteOutcome, getSubmitTestDriveOutcome, getSubmitInquiryOutcome, getSubmitCarChangesOutcome, getDeleteCarOutcome, getSubmitResponseOutcome } from "./fixtures/cars";
import { sampleUser, sampleStaff } from "./fixtures/user";
import { sampleTestDrives, samplePurchaseInquiries, sampleAdminInquiries, getInquiryById, getAdminInquiryById } from "./fixtures/inquiries";
import CatalogScreen from "./screens/CatalogScreen";
import SearchFilterScreen from "./screens/SearchFilterScreen";
import SearchResultsScreen from "./screens/SearchResultsScreen";
import CarDetailScreen from "./screens/CarDetailScreen";
import ComparisonScreen from "./screens/ComparisonScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import TestDriveBookingScreen from "./screens/TestDriveBookingScreen";
import TestDriveSuccessScreen from "./screens/TestDriveSuccessScreen";
import TestDriveErrorScreen from "./screens/TestDriveErrorScreen";
import PurchaseInquiryScreen from "./screens/PurchaseInquiryScreen";
import PurchaseInquirySuccessScreen from "./screens/PurchaseInquirySuccessScreen";
import PurchaseInquiryErrorScreen from "./screens/PurchaseInquiryErrorScreen";
import MyActivityScreen from "./screens/MyActivityScreen";
import InquiryDetailScreen from "./screens/InquiryDetailScreen";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import InventoryManagementScreen from "./screens/InventoryManagementScreen";
import InventoryAddEditScreen from "./screens/InventoryAddEditScreen";
import InquiryManagementScreen from "./screens/InquiryManagementScreen";
import InquiryRespondScreen from "./screens/InquiryRespondScreen";

const emptyFilter: FilterCriteria = { make: "", model: "", yearMin: "", yearMax: "", priceMin: "", priceMax: "", bodyType: "", fuelType: "", transmission: "", mileageMin: "", mileageMax: "" };

export default function App() {
  const [screen, setScreen] = useState<ScreenId>("catalog");
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [userName] = useState(sampleUser.name);
  const [userEmail] = useState(sampleUser.email);
  const [userPhone] = useState(sampleUser.phone);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(emptyFilter);
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [editCarId, setEditCarId] = useState<string | null>(null);
  const [respondInquiryId, setRespondInquiryId] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<TestDriveBooking | null>(null);
  const [inquiryResult, setInquiryResult] = useState<{ referenceNumber: string; carMakeModel: string; offerPrice: string; financing: string } | null>(null);
  const [errorContext, setErrorContext] = useState<{ message: string; details: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const navigate = useCallback((target: ScreenId) => { setScreen(target); }, []);

  const handleSelectCar = useCallback((carId: string) => {
    setSelectedCarId(carId);
    setScreen("car-detail");
  }, []);

  const handleAddToCompare = useCallback((carId: string) => {
    setCompareList(prev => {
      if (prev.length >= 5 || prev.includes(carId)) return prev;
      return [...prev, carId];
    });
  }, []);

  const handleRemoveFromCompare = useCallback((carId: string) => {
    setCompareList(prev => prev.filter(id => id !== carId));
  }, []);

  const handleSaveFavorite = useCallback((carId: string) => {
    if (getSaveFavoriteOutcome() === "fail") {
      showToast(t("common.error"));
      return;
    }
    const car = getCarById(carId);
    if (!car) return;
    setFavorites(prev => {
      if (prev.length >= 50 || prev.some(f => f.id === carId)) return prev;
      return [...prev, toFavorite(car)];
    });
    showToast(t("detail.favoriteAdded"));
  }, [showToast]);

  const handleRemoveFavorite = useCallback((carId: string) => {
    if (getRemoveFavoriteOutcome() === "fail") {
      showToast(t("common.error"));
      return;
    }
    setFavorites(prev => prev.filter(f => f.id !== carId));
  }, [showToast]);

  const handleApplyFilter = useCallback((criteria: FilterCriteria) => {
    setFilterCriteria(criteria);
    let results = [...sampleCars].filter(c => c.status === "available");
    if (criteria.make) results = results.filter(c => c.make.toLowerCase().includes(criteria.make.toLowerCase()));
    if (criteria.model) results = results.filter(c => c.model.toLowerCase().includes(criteria.model.toLowerCase()));
    if (criteria.yearMin) results = results.filter(c => c.year >= Number(criteria.yearMin));
    if (criteria.yearMax) results = results.filter(c => c.year <= Number(criteria.yearMax));
    if (criteria.priceMin) results = results.filter(c => c.price >= Number(criteria.priceMin));
    if (criteria.priceMax) results = results.filter(c => c.price <= Number(criteria.priceMax));
    if (criteria.fuelType) results = results.filter(c => c.fuelType.toLowerCase().includes(criteria.fuelType.toLowerCase()));
    if (criteria.transmission) results = results.filter(c => c.transmission.toLowerCase().includes(criteria.transmission.toLowerCase()));
    setSearchResults(results);
    setScreen("search-results");
  }, []);

  const handleSubmitTestDrive = useCallback((data: { date: string; time: string; name: string; phone: string; email: string; notes: string }) => {
    if (getSubmitTestDriveOutcome() === "fail") {
      setErrorContext({ message: t("testDrive.error.submissionFailed"), details: "" });
      setScreen("test-drive-error");
      return;
    }
    const car = selectedCarId ? getCarById(selectedCarId) : null;
    setBookingResult({
      id: "td-new-001",
      carId: selectedCarId ?? "",
      carMakeModel: car ? `${car.make} ${car.model} ${car.year}` : "",
      date: data.date,
      time: data.time,
      status: "scheduled",
      referenceNumber: `TD-${Date.now()}`,
      location: car?.seller.name ?? "",
    });
    setScreen("test-drive-success");
  }, [selectedCarId]);

  const handleSubmitInquiry = useCallback((data: { offerPrice: number; needsFinancing: boolean; loanTerm: number; downPaymentPercent: number; name: string; phone: string; email: string; notes: string }) => {
    if (getSubmitInquiryOutcome() === "fail") {
      setErrorContext({ message: t("inquiry.error.generic"), details: "" });
      setScreen("purchase-inquiry-error");
      return;
    }
    const car = selectedCarId ? getCarById(selectedCarId) : null;
    const financingStr = data.needsFinancing ? `${data.loanTerm} ${t("inquiry.loanTerm.12").split(" ")[1] ?? "months"}, ${data.downPaymentPercent}% ${t("inquiry.downPayment")}` : "";
    setInquiryResult({
      referenceNumber: `PI-${Date.now()}`,
      carMakeModel: car ? `${car.make} ${car.model} ${car.year}` : "",
      offerPrice: data.offerPrice > 0 ? String(data.offerPrice) : "",
      financing: financingStr,
    });
    setScreen("purchase-inquiry-success");
  }, [selectedCarId]);

  const handleToggleAuth = useCallback(() => {
    setIsAuthenticated(prev => !prev);
  }, []);

  const handleToggleStaff = useCallback(() => {
    setIsStaff(prev => !prev);
  }, []);

  const selectedCar = selectedCarId ? getCarById(selectedCarId) : undefined;
  const compareCars = compareList.map(id => getCarById(id)).filter((c): c is Car => c !== undefined);
  const selectedInquiry = selectedInquiryId ? getInquiryById(selectedInquiryId) : undefined;
  const respondInquiry = respondInquiryId ? getAdminInquiryById(respondInquiryId) : undefined;

  const activeTab = screen === "favorites" ? "favorites" : screen === "my-activity" || screen === "inquiry-detail" ? "activity" : screen.startsWith("admin") || screen.startsWith("inventory") || screen.startsWith("inquiry-management") || screen === "inquiry-respond" ? "admin" : "catalog";

  function renderScreen() {
    switch (screen) {
      case "catalog":
        return <CatalogScreen cars={sampleCars.filter(c => c.status === "available")} onSelectCar={handleSelectCar} onOpenFilter={() => navigate("search-filter")} />;
      case "search-filter":
        return <SearchFilterScreen criteria={filterCriteria} onApply={handleApplyFilter} onCancel={() => navigate("catalog")} />;
      case "search-results":
        return <SearchResultsScreen cars={searchResults} onSelectCar={handleSelectCar} onClearFilters={() => navigate("catalog")} />;
      case "car-detail":
        return selectedCar ? <CarDetailScreen car={selectedCar} isAuthenticated={isAuthenticated} compareList={compareList} favorites={favorites} onBack={() => navigate("catalog")} onSaveFavorite={handleSaveFavorite} onAddToCompare={handleAddToCompare} onGoToComparison={() => navigate("comparison")} onRequestTestDrive={() => navigate("test-drive-booking")} onMakeOffer={() => navigate("purchase-inquiry")} onGoToFavorites={() => navigate("favorites")} /> : <div className="p-4"><p>{t("detail.notFound")}</p></div>;
      case "comparison":
        return <ComparisonScreen cars={compareCars} compareList={compareList} onBack={() => navigate("catalog")} onViewCar={handleSelectCar} onRemoveFromCompare={handleRemoveFromCompare} onAddMore={() => navigate("catalog")} />;
      case "favorites":
        return <FavoritesScreen favorites={favorites} onSelectCar={handleSelectCar} onRemoveFavorite={handleRemoveFavorite} onBackToCatalog={() => navigate("catalog")} onCompareSelected={() => navigate("comparison")} />;
      case "test-drive-booking":
        return selectedCar ? <TestDriveBookingScreen car={selectedCar} userName={userName} userPhone={userPhone} userEmail={userEmail} availableSlots={sampleAvailableSlots} onSubmit={handleSubmitTestDrive} onCancel={() => navigate("car-detail")} /> : null;
      case "test-drive-success":
        return bookingResult ? <TestDriveSuccessScreen booking={bookingResult} onContinueShopping={() => navigate("catalog")} onViewAppointments={() => navigate("my-activity")} /> : null;
      case "test-drive-error":
        return <TestDriveErrorScreen error={errorContext} onRetry={() => navigate("test-drive-booking")} onBackToDetail={() => navigate("car-detail")} />;
      case "purchase-inquiry":
        return selectedCar ? <PurchaseInquiryScreen car={selectedCar} userName={userName} userPhone={userPhone} userEmail={userEmail} onSubmit={handleSubmitInquiry} onCancel={() => navigate("car-detail")} /> : null;
      case "purchase-inquiry-success":
        return inquiryResult ? <PurchaseInquirySuccessScreen result={inquiryResult} onContinueShopping={() => navigate("catalog")} onViewInquiries={() => navigate("my-activity")} /> : null;
      case "purchase-inquiry-error":
        return <PurchaseInquiryErrorScreen error={errorContext} onRetry={() => navigate("purchase-inquiry")} onBackToDetail={() => navigate("car-detail")} />;
      case "my-activity":
        return <MyActivityScreen testDrives={sampleTestDrives} inquiries={samplePurchaseInquiries} onSelectInquiry={(id) => { setSelectedInquiryId(id); navigate("inquiry-detail"); }} onBackToCatalog={() => navigate("catalog")} />;
      case "inquiry-detail":
        return selectedInquiry ? <InquiryDetailScreen inquiry={selectedInquiry} onBack={() => navigate("my-activity")} /> : <div className="p-4"><p>{t("inquiryDetail.notFound")}</p></div>;
      case "admin-dashboard":
        return <AdminDashboardScreen userName={isStaff ? sampleStaff.name : userName} onManageInventory={() => navigate("inventory-management")} onManageInquiries={() => navigate("inquiry-management")} onBackToCatalog={() => navigate("catalog")} />;
      case "inventory-management":
        return <InventoryManagementScreen inventory={sampleInventory} onAddCar={() => { setEditCarId(null); navigate("inventory-add-edit"); }} onEditCar={(id) => { setEditCarId(id); navigate("inventory-add-edit"); }} onDeleteCar={() => { showToast(getDeleteCarOutcome() === "success" ? "Deleted" : t("common.error")); }} onBack={() => navigate("admin-dashboard")} />;
      case "inventory-add-edit":
        return <InventoryAddEditScreen editCarId={editCarId} onSave={() => { if (getSubmitCarChangesOutcome() === "success") navigate("inventory-management"); else showToast(t("inventoryForm.error.generic")); }} onCancel={() => navigate("inventory-management")} />;
      case "inquiry-management":
        return <InquiryManagementScreen inquiries={sampleAdminInquiries} onRespondInquiry={(id) => { setRespondInquiryId(id); navigate("inquiry-respond"); }} onBack={() => navigate("admin-dashboard")} />;
      case "inquiry-respond":
        return respondInquiry ? <InquiryRespondScreen inquiry={respondInquiry} onSend={() => { if (getSubmitResponseOutcome() === "success") navigate("inquiry-management"); else showToast(t("respond.error.generic")); }} onCancel={() => navigate("inquiry-management")} /> : null;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-lg mx-auto relative">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm" role="status" aria-live="polite">
          {toast}
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <h1 className="text-lg font-bold text-blue-700">{t("app.title")}</h1>
        <div className="flex gap-2">
          <button onClick={handleToggleAuth} className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200" aria-label={isAuthenticated ? t("nav.logout") : t("nav.login")}>
            {isAuthenticated ? t("nav.logout") : t("nav.login")}
          </button>
          <button onClick={handleToggleStaff} className={`text-xs px-2 py-1 rounded ${isStaff ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`} aria-label="Toggle staff mode">
            Staff: {isStaff ? "ON" : "OFF"}
          </button>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto pb-16">
        {renderScreen()}
      </main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-200 flex" aria-label="Main navigation">
        <button onClick={() => navigate("catalog")} className={`flex-1 py-3 text-xs font-medium text-center ${activeTab === "catalog" ? "text-blue-700 border-t-2 border-blue-700" : "text-gray-500"}`} aria-label={t("nav.catalog")}>
          {t("nav.catalog")}
        </button>
        {isAuthenticated && (
          <button onClick={() => navigate("favorites")} className={`flex-1 py-3 text-xs font-medium text-center ${activeTab === "favorites" ? "text-blue-700 border-t-2 border-blue-700" : "text-gray-500"}`} aria-label={t("nav.favorites")}>
            {t("nav.favorites")}
          </button>
        )}
        {isAuthenticated && (
          <button onClick={() => navigate("my-activity")} className={`flex-1 py-3 text-xs font-medium text-center ${activeTab === "activity" ? "text-blue-700 border-t-2 border-blue-700" : "text-gray-500"}`} aria-label={t("nav.activity")}>
            {t("nav.activity")}
          </button>
        )}
        {isStaff && (
          <button onClick={() => navigate("admin-dashboard")} className={`flex-1 py-3 text-xs font-medium text-center ${activeTab === "admin" ? "text-blue-700 border-t-2 border-blue-700" : "text-gray-500"}`} aria-label={t("nav.admin")}>
            {t("nav.admin")}
          </button>
        )}
      </nav>
    </div>
  );
}