export type CarCondition = 'new' | 'used';
export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid';
export type Transmission = 'automatic' | 'manual';
export type ListingStatus = 'active' | 'sold' | 'reserved' | 'draft';
export type InquiryStatus = 'new' | 'contacted' | 'closed';
export type InquiryType = 'contact' | 'reservation';

export interface Car {
  id: string;
  brand: string;
  model: string;
  name: string;
  year: number;
  condition: CarCondition;
  color: string;
  seats: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  engineCapacity: string;
  price: number;
  promoPrice: number | null;
  description: string;
  photos: string[];
  status: ListingStatus;
  featured: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  filterKey: string;
  filterValue: string;
}

export interface Inquiry {
  id: string;
  type: InquiryType;
  carId: string;
  carName: string;
  carPrice: number;
  carPhoto: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  preferredContactTime: string;
  preferredVisitDate: string;
  preferredVisitTime: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface CatalogFilters {
  brand: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  priceRange: string;
  year: string;
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
  params: Record<string, string>;
  history: Array<{ screen: ScreenId; params: Record<string, string> }>;
}
