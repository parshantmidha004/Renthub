import { Injectable, inject, signal } from '@angular/core';
import { Listing, ListingFilter } from '../models/listing.model';
import { Inquiry } from '../models/inquiry.model';
import { StorageService } from './storage.service';
import { SEED_LISTINGS } from '../data/seed-listings';

const LISTINGS_KEY = 'renthub.listings';
const FAVORITES_KEY = 'renthub.favorites';
const INQUIRIES_KEY = 'renthub.inquiries';
const DRAFT_KEY = 'renthub.pending-draft';

export interface FilterResult {
  items: Listing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Applies search text, city, price range and amenity filters, sorts and paginates. */
export function applyFilter(listings: Listing[], filter: ListingFilter): FilterResult {
  const text = filter.searchText.trim().toLowerCase();
  const min = filter.minPrice ?? 0;
  const max = filter.maxPrice ?? Number.MAX_SAFE_INTEGER;

  const filtered = listings.filter((listing) => {
    const matchesText =
      !text ||
      listing.title.toLowerCase().includes(text) ||
      listing.propertyName.toLowerCase().includes(text) ||
      listing.address.toLowerCase().includes(text) ||
      listing.city.toLowerCase().includes(text) ||
      listing.description.toLowerCase().includes(text);
    const matchesCity = !filter.city || listing.city === filter.city;
    const matchesPrice = listing.expectedRent >= min && listing.expectedRent <= max;
    const matchesAmenities =
      filter.amenities.length === 0 ||
      filter.amenities.every((amenity) => listing.amenities.includes(amenity));
    return matchesText && matchesCity && matchesPrice && matchesAmenities;
  });

  const sorted = filtered.sort((a, b) => {
    switch (filter.sortBy) {
      case 'price-asc':
        return a.expectedRent - b.expectedRent;
      case 'price-desc':
        return b.expectedRent - a.expectedRent;
      case 'area-desc':
        return b.squareFeet - a.squareFeet;
      case 'newest':
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });

  const pageSize = filter.pageSize;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.min(Math.max(1, filter.page), totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Manages apartment listings, favourites ("show interest") and landlord inquiries.
 * Everything is persisted in localStorage and seeded with demo data on first run.
 */
@Injectable({ providedIn: 'root' })
export class ListingService {
  private readonly storage = inject(StorageService);

  readonly listings = signal<Listing[]>(this.loadOrSeed());
  readonly favorites = signal<Record<string, string[]>>(this.storage.read(FAVORITES_KEY, {}));
  readonly inquiries = signal<Inquiry[]>(this.storage.read<Inquiry[]>(INQUIRIES_KEY, []));

  /** Listing being previewed in the bonus "Preview and Submit" flow. */
  readonly pendingDraft = signal<Listing | null>(this.storage.read<Listing | null>(DRAFT_KEY, null));

  getById(id: string): Listing | undefined {
    return this.listings().find((l) => l.id === id);
  }

  myPosts(userId: string): Listing[] {
    return this.listings().filter((l) => l.ownerId === userId);
  }

  /** Creates or updates a listing; returns the stored entity. */
  save(listing: Listing): Listing {
    this.listings.update((list) => {
      const index = list.findIndex((l) => l.id === listing.id);
      if (index >= 0) {
        const copy = [...list];
        copy[index] = listing;
        return copy;
      }
      return [...list, listing];
    });
    this.persist();
    return listing;
  }

  delete(id: string): void {
    this.listings.update((list) => list.filter((l) => l.id !== id));
    this.persist();
  }

  incrementViews(id: string): void {
    this.listings.update((list) =>
      list.map((l) => (l.id === id ? { ...l, views: l.views + 1 } : l)),
    );
    this.persist();
  }

  // ---- Preview & Submit (bonus) ----

  stageDraft(listing: Listing): void {
    this.pendingDraft.set(listing);
    this.storage.write(DRAFT_KEY, listing);
  }

  clearDraft(): void {
    this.pendingDraft.set(null);
    this.storage.remove(DRAFT_KEY);
  }

  // ---- Show interest: favourites ----

  isFavorite(userId: string, listingId: string): boolean {
    return this.favorites()[userId]?.includes(listingId) ?? false;
  }

  favoritesOf(userId: string): Listing[] {
    const ids = this.favorites()[userId] ?? [];
    return ids
      .map((id) => this.getById(id))
      .filter((l): l is Listing => !!l && l.status === 'published');
  }

  /** Toggles favourite state; returns true when the listing is now a favourite. */
  toggleFavorite(userId: string, listingId: string): boolean {
    const current = this.favorites()[userId] ?? [];
    const updated = current.includes(listingId)
      ? current.filter((id) => id !== listingId)
      : [...current, listingId];
    this.favorites.update((map) => ({ ...map, [userId]: updated }));
    this.storage.write(FAVORITES_KEY, this.favorites());
    return updated.includes(listingId);
  }

  // ---- Show interest: inquiries ----

  addInquiry(inquiry: Inquiry): void {
    this.inquiries.update((list) => [...list, inquiry]);
    this.storage.write(INQUIRIES_KEY, this.inquiries());
  }

  inquiriesForListing(listingId: string): Inquiry[] {
    return this.inquiries().filter((i) => i.listingId === listingId);
  }

  inquiriesByUser(userId: string): Inquiry[] {
    return this.inquiries().filter((i) => i.userId === userId);
  }

  private loadOrSeed(): Listing[] {
    const existing = this.storage.read<Listing[] | null>(LISTINGS_KEY, null);
    if (existing === null) {
      this.storage.write(LISTINGS_KEY, SEED_LISTINGS);
      return [...SEED_LISTINGS];
    }
    return existing;
  }

  private persist(): void {
    this.storage.write(LISTINGS_KEY, this.listings());
  }
}

