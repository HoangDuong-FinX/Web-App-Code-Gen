export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  bodyType: string;
  color: string;
  engine?: string;
  horsepower?: number;
  features?: string[];
  warranty?: string;
  photos?: string[];
  status: 'available' | 'sold' | 'reserved' | 'maintenance';
  dealership?: {
    name: string;
    phone: string;
    address: string;
  };
  rating?: number;
}

export const featuredVehicles: Vehicle[] = [
  {
    id: 'v1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 28500,
    mileage: 15000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    color: 'Black',
    engine: '2.5L 4-Cylinder',
    horsepower: 203,
    features: ['Air Conditioning', 'Leather Seats', 'Navigation', 'Backup Camera'],
    status: 'available',
    dealership: {
      name: 'AutoHub Main',
      phone: '+1-555-0123',
      address: '123 Main St, City, State 12345',
    },
    rating: 4.5,
  },
  {
    id: 'v2',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    price: 24500,
    mileage: 25000,
    transmission: 'Manual',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    color: 'White',
    engine: '2.0L 4-Cylinder',
    horsepower: 158,
    features: ['Air Conditioning', 'Power Steering'],
    status: 'available',
    dealership: {
      name: 'AutoHub Main',
      phone: '+1-555-0123',
      address: '123 Main St, City, State 12345',
    },
    rating: 4.2,
  },
  {
    id: 'v3',
    make: 'BMW',
    model: 'X5',
    year: 2023,
    price: 65000,
    mileage: 8000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'SUV',
    color: 'Silver',
    engine: '3.0L 6-Cylinder',
    horsepower: 335,
    features: ['Leather Seats', 'Sunroof', 'Navigation', 'Backup Camera', 'All-Wheel Drive'],
    status: 'available',
    dealership: {
      name: 'AutoHub Main',
      phone: '+1-555-0123',
      address: '123 Main St, City, State 12345',
    },
    rating: 4.8,
  },
  {
    id: 'v4',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    price: 52000,
    mileage: 12000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    color: 'Red',
    engine: '2.0L 4-Cylinder Turbo',
    horsepower: 255,
    features: ['Leather Seats', 'Sunroof', 'Navigation', 'Backup Camera'],
    status: 'available',
    dealership: {
      name: 'AutoHub Main',
      phone: '+1-555-0123',
      address: '123 Main St, City, State 12345',
    },
    rating: 4.7,
  },
];

export const searchVehicles: Vehicle[] = [
  ...featuredVehicles,
  {
    id: 'v5',
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    price: 35000,
    mileage: 45000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Truck',
    color: 'Blue',
    engine: '3.5L 6-Cylinder',
    horsepower: 400,
    features: ['Power Steering', 'Air Conditioning'],
    status: 'available',
    dealership: {
      name: 'AutoHub Main',
      phone: '+1-555-0123',
      address: '123 Main St, City, State 12345',
    },
    rating: 4.3,
  },
  {
    id: 'v6',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 45000,
    mileage: 5000,
    transmission: 'Automatic',
    fuelType: 'Electric',
    bodyType: 'Sedan',
    color: 'White',
    engine: 'Electric Motor',
    horsepower: 358,
    features: ['Autopilot', 'Navigation', 'Backup Camera', 'Sunroof'],
    status: 'available',
    dealership: {
      name: 'AutoHub Main',
      phone: '+1-555-0123',
      address: '123 Main St, City, State 12345',
    },
    rating: 4.9,
  },
];
