import { TestBed } from '@angular/core/testing';
import { ListingService, applyFilter } from './listing.service';
import { Listing } from '../models/listing.model';

function makeListing(partial: Partial<Listing>): Listing {
  return {
    id: partial.id ?? crypto.randomUUID(),
    ownerId: 'owner',
    ownerName: 'Owner',
    ownerEmail: 'owner@renthub.com',
    ownerPhone: '',
    propertyType: 'Apartment',
    propertyName: 'Test Towers',
    isShared: false,
    address: '1 Main Street',
    city: 'Bengaluru',
    squareFeet: 1000,
    bedrooms: 2,
    bathrooms: 2,
    leaseType: 'long-term',
    expectedRent: 20000,
    isNegotiable: false,
    priceMode: 'per-month',
    isFurnished: false,
    amenities: [],
    title: 'Test Listing',
    description: 'A test listing used by unit tests.',
    photos: [],
    status: 'published',
    createdAt: new Date().toISOString(),
    views: 0,
    ...partial,
  };
}

describe('ListingService', () => {
  let service: ListingService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(ListingService);
  });

  it('seeds demo listings on first run', () => {
    expect(service.listings().length).toBeGreaterThan(0);
  });

  it('saves, updates and deletes listings', () => {
    const listing = makeListing({ title: 'My Test Flat' });
    service.save(listing);
    expect(service.getById(listing.id)?.title).toBe('My Test Flat');

    service.save({ ...listing, title: 'Renamed Flat' });
    expect(service.getById(listing.id)?.title).toBe('Renamed Flat');

    service.delete(listing.id);
    expect(service.getById(listing.id)).toBeUndefined();
  });

  it('toggles favourites per user', () => {
    const listing = makeListing({});
    service.save(listing);

    expect(service.isFavorite('user-1', listing.id)).toBe(false);
    expect(service.toggleFavorite('user-1', listing.id)).toBe(true);
    expect(service.isFavorite('user-1', listing.id)).toBe(true);
    expect(service.toggleFavorite('user-1', listing.id)).toBe(false);
    // Independent per-user lists
    expect(service.isFavorite('user-2', listing.id)).toBe(false);
  });
});

describe('applyFilter', () => {
  const listings = [
    makeListing({ id: 'a', title: 'Sunny 2BHK', city: 'Bengaluru', expectedRent: 30000, amenities: ['Elevator'], squareFeet: 1200, createdAt: '2026-01-03' }),
    makeListing({ id: 'b', title: 'Cheap 1BHK', city: 'Mumbai', expectedRent: 10000, amenities: [], squareFeet: 600, createdAt: '2026-01-02' }),
    makeListing({ id: 'c', title: 'Luxury 3BHK', city: 'Bengaluru', expectedRent: 80000, amenities: ['Elevator', 'Gym/Fitness Center'], squareFeet: 2000, createdAt: '2026-01-01' }),
  ];

  const base = { searchText: '', city: '', minPrice: null, maxPrice: null, amenities: [], sortBy: 'newest' as const, page: 1, pageSize: 2 };

  it('filters by search text across fields', () => {
    expect(applyFilter(listings, { ...base, searchText: 'sunny' }).total).toBe(1);
    expect(applyFilter(listings, { ...base, searchText: 'bengaluru' }).total).toBe(2);
  });

  it('filters by city and price range', () => {
    expect(applyFilter(listings, { ...base, city: 'Mumbai' }).total).toBe(1);
    const result = applyFilter(listings, { ...base, minPrice: 15000, maxPrice: 50000 });
    expect(result.total).toBe(1);
    expect(result.items[0].id).toBe('a');
  });

  it('requires all selected amenities', () => {
    const result = applyFilter(listings, { ...base, amenities: ['Elevator', 'Gym/Fitness Center'] });
    expect(result.total).toBe(1);
    expect(result.items[0].id).toBe('c');
  });

  it('sorts by price ascending', () => {
    const result = applyFilter(listings, { ...base, sortBy: 'price-asc' });
    expect(result.items[0].id).toBe('b');
  });

  it('paginates results', () => {
    const result = applyFilter(listings, { ...base, sortBy: 'price-asc', page: 2 });
    expect(result.total).toBe(3);
    expect(result.totalPages).toBe(2);
    expect(result.items.length).toBe(1);
    expect(result.items[0].id).toBe('c');
  });
});
