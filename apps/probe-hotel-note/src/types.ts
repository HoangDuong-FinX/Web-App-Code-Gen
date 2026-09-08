export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  promoPrice?: number;
  installment?: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  engineCapacity: string;
  color: string;
  seats: number;
  condition: string;
  description: string;
  photos: string[];
  thumbnailUrl: string;
  keySpecs: string;
  specs: { label: string; value: string }[];
  status: CarStatus;
}

export type CarStatus = 'active' | 'sold' | 'reserved' | 'draft';

export interface Category {
  id: string;
  name: string;
  type: string;
}

export interface Inquiry {
  id: string;
  buyerName: string;
  phone: string;
  email?: string;
  preferredContactTime?: string;
  message?: string;
  carId: string;
  carName: string;
  carPrice: string;
  carThumbnailUrl: string;
  status: InquiryStatus;
  date: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'closed';

export interface CatalogFilters {
  brand?: string;
  priceRange?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  year?: string;
}

export interface ReservationFormData {
  fullName: string;
  phone: string;
  email: string;
  preferredVisitDate: string;
  preferredVisitTime: string;
}

export interface InquiryFormData {
  fullName: string;
  phone: string;
  email: string;
  preferredContactTime: string;
  message: string;
}

export interface CarFormData {
  carId?: string;
  brand: string;
  model: string;
  year: string;
  condition: string;
  color: string;
  seats: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  engineCapacity: string;
  price: string;
  promoPrice: string;
  description: string;
  photos: string[];
  status: 'active' | 'draft';
}

export type ScreenId =
  | 'home'
  | 'catalog'
  | 'car-detail'
  | 'compare'
  | 'inquiry-form'
  | 'inquiry-success'
  | 'reservation-form'
  | 'reservation-confirm'
  | 'reservation-success'
  | 'favorites'
  | 'search-results'
  | 'admin-listings'
  | 'admin-add-car'
  | 'admin-inquiries'
  | 'admin-inquiry-detail';

export interface NavigationState {
  screen: ScreenId;
  params: Record<string, unknown>;
}
