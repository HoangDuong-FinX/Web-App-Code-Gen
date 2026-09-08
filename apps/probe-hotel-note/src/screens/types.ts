import type { AppState, ScreenId, ModalId, InquiryFormData, Buyer, TestDriveBooking } from "../types";

export interface ScreenProps {
  navigate: (screen: ScreenId) => void;
  goBack: () => void;
  setModal: (modal: ModalId) => void;
  setCurrentCar: (carId: string) => void;
  setCurrentPromo: (promoId: string) => void;
  setCurrentActivity: (activityId: string) => void;
  setCatalogFilter: (bodyType: string | null) => void;
  toggleCompare: (carId: string) => void;
  requireLogin: (returnScreen: ScreenId, action: string) => void;
  onLoginSuccess: (buyer: Buyer) => void;
  setInquiryForm: (data: InquiryFormData) => void;
  setTestDriveBooking: (booking: Partial<TestDriveBooking>) => void;
  incrementLoginAttempts: () => void;
  state: AppState;
}
