export const PROPERTY_TYPES = [
  'Apartment',
  'Builder Floor',
  'Independent House',
  'Studio Apartment',
  'Villa',
  'Penthouse',
] as const;

export const AMENITIES = [
  'Gym/Fitness Center',
  'Swimming Pool',
  'Car Park',
  'Visitors Parking',
  'Power Backup',
  'Garbage Disposal',
  'Private Lawn',
  'Water Heater',
  'Plant Security System',
  'Laundry Service',
  'Elevator',
  'Club House',
] as const;

export const CITIES = [
  'Bengaluru',
  'Mumbai',
  'New Delhi',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Gurugram',
  'Noida',
] as const;

export type LeaseType = 'long-term' | 'short-term' | 'both';
export type PriceMode = 'per-month' | 'utilities-included';
export type ListingStatus = 'draft' | 'published';
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'area-desc';

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  propertyType: string;
  propertyName: string;
  isShared: boolean;
  address: string;
  city: string;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  leaseType: LeaseType;
  expectedRent: number;
  isNegotiable: boolean;
  priceMode: PriceMode;
  isFurnished: boolean;
  amenities: string[];
  title: string;
  description: string;
  photos: string[];
  status: ListingStatus;
  createdAt: string;
  views: number;
}

export interface ListingFilter {
  searchText: string;
  city: string;
  minPrice: number | null;
  maxPrice: number | null;
  amenities: string[];
  sortBy: SortOption;
  page: number;
  pageSize: number;
}

export const DEFAULT_FILTER: ListingFilter = {
  searchText: '',
  city: '',
  minPrice: null,
  maxPrice: null,
  amenities: [],
  sortBy: 'newest',
  page: 1,
  pageSize: 6,
};

export function emptyListing(owner: { id: string; name: string; email: string }): Listing {
  return {
    id: crypto.randomUUID(),
    ownerId: owner.id,
    ownerName: owner.name,
    ownerEmail: owner.email,
    ownerPhone: '',
    propertyType: 'Apartment',
    propertyName: '',
    isShared: false,
    address: '',
    city: '',
    squareFeet: 0,
    bedrooms: 1,
    bathrooms: 1,
    leaseType: 'long-term',
    expectedRent: 0,
    isNegotiable: false,
    priceMode: 'per-month',
    isFurnished: false,
    amenities: [],
    title: '',
    description: '',
    photos: [],
    status: 'draft',
    createdAt: new Date().toISOString(),
    views: 0,
  };
}
