import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AMENITIES,
  CITIES,
  DEFAULT_FILTER,
  Listing,
  ListingFilter,
  SortOption,
} from '../../core/models/listing.model';
import { ListingService, applyFilter } from '../../core/services/listing.service';
import { AuthService } from '../../core/services/auth.service';
import { ListingCardComponent } from '../../shared/components/listing-card/listing-card';

/** Home screen: featured carousel, search & filters, sort and paginated listings. */
@Component({
  selector: 'app-home',
  imports: [DecimalPipe, RouterLink, ListingCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  private readonly listingService = inject(ListingService);
  readonly auth = inject(AuthService);

  readonly amenities = AMENITIES;
  readonly cities = CITIES;
  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest first' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
    { value: 'area-desc', label: 'Area: large to small' },
  ];

  readonly filter = signal<ListingFilter>({ ...DEFAULT_FILTER });

  readonly result = computed(() =>
    applyFilter(this.listServicePublished(), this.filter()),
  );

  readonly featured = computed<Listing[]>(() =>
    this.listServicePublished()
      .slice()
      .sort((a, b) => b.views - a.views)
      .slice(0, 5),
  );

  readonly activeSlide = signal(0);
  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;

  private readonly listServicePublished = computed(() =>
    this.listingService.listings().filter((l) => l.status === 'published'),
  );

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  // ---- Carousel ----

  startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoPlay(): void {
    if (this.autoPlayTimer !== null) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  nextSlide(): void {
    const count = this.featured().length;
    if (count > 0) {
      this.activeSlide.set((this.activeSlide() + 1) % count);
    }
  }

  prevSlide(): void {
    const count = this.featured().length;
    if (count > 0) {
      this.activeSlide.set((this.activeSlide() - 1 + count) % count);
    }
  }

  goToSlide(index: number): void {
    this.activeSlide.set(index);
    this.startAutoPlay();
  }

  // ---- Search & filters ----

  onSearchText(value: string): void {
    this.patchFilter({ searchText: value, page: 1 });
  }

  onCityChange(value: string): void {
    this.patchFilter({ city: value, page: 1 });
  }

  onMinPrice(value: string): void {
    this.patchFilter({ minPrice: value ? Number(value) : null, page: 1 });
  }

  onMaxPrice(value: string): void {
    this.patchFilter({ maxPrice: value ? Number(value) : null, page: 1 });
  }

  onSortChange(value: string): void {
    this.patchFilter({ sortBy: value as SortOption, page: 1 });
  }

  toggleAmenity(amenity: string): void {
    const current = this.filter().amenities;
    const amenities = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    this.patchFilter({ amenities, page: 1 });
  }

  clearFilters(): void {
    this.filter.set({ ...DEFAULT_FILTER });
  }

  hasActiveFilters(): boolean {
    const f = this.filter();
    return (
      !!f.searchText ||
      !!f.city ||
      f.minPrice !== null ||
      f.maxPrice !== null ||
      f.amenities.length > 0
    );
  }

  // ---- Pagination ----

  goToPage(page: number): void {
    this.patchFilter({ page });
  }

  pages(): number[] {
    const total = this.result().totalPages;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  private patchFilter(partial: Partial<ListingFilter>): void {
    this.filter.update((current) => ({ ...current, ...partial }));
  }
}
