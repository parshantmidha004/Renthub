import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AMENITIES,
  CITIES,
  PROPERTY_TYPES,
  LeaseType,
  Listing,
  PriceMode,
  emptyListing,
} from '../../../core/models/listing.model';
import { AuthService } from '../../../core/services/auth.service';
import { ListingService } from '../../../core/services/listing.service';
import { ToastService } from '../../../core/services/toast.service';

function positiveNumber(control: AbstractControl): ValidationErrors | null {
  const value = Number(control.value);
  if (control.value === null || control.value === '' || isNaN(value)) {
    return null; // "required" handles empties
  }
  return value > 0 ? null : { positive: true };
}

/** Create / edit property post with full validation and a preview step (bonus). */
@Component({
  selector: 'app-listing-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './listing-form.html',
  styleUrl: './listing-form.scss',
})
export class ListingForm {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly listingService = inject(ListingService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly propertyTypes = PROPERTY_TYPES;
  readonly cities = CITIES;
  readonly amenitiesList = AMENITIES;
  readonly leaseTypes: { value: LeaseType; label: string }[] = [
    { value: 'long-term', label: 'Long term (6+ months)' },
    { value: 'short-term', label: 'Short term' },
    { value: 'both', label: 'Both' },
  ];
  readonly priceModes: { value: PriceMode; label: string }[] = [
    { value: 'per-month', label: 'Per Month' },
    { value: 'utilities-included', label: 'Utilities included in rent' },
  ];

  readonly editing = signal<Listing | null>(null);
  readonly submitted = signal(false);
  readonly submitting = signal(false);

  readonly descriptionLimit = 1400;

  readonly form = this.buildForm();

  readonly descriptionLength = computed(() => this.description.value?.length ?? 0);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const fromDraft = this.route.snapshot.queryParamMap.get('fromDraft') === '1';

    if (id) {
      const saved = this.listingService.getById(id);
      const staged = this.listingService.pendingDraft();
      if (saved) {
        if (saved.ownerId !== this.auth.currentUser()?.id) {
          this.toast.error('You can only edit your own posts.');
          this.router.navigate(['/listings', saved.id]);
          return;
        }
        this.editing.set(saved);
        this.patchFromListing(saved);
      } else if (staged && staged.id === id) {
        // Editing a staged (not yet saved) draft from the preview screen.
        this.patchFromListing(staged);
      } else {
        this.toast.error('That post does not exist.');
        this.router.navigate(['/home']);
      }
    } else if (fromDraft) {
      const staged = this.listingService.pendingDraft();
      if (staged) {
        this.patchFromListing(staged);
      }
    }
  }

  get propertyType() {
    return this.form.controls.propertyType;
  }

  get propertyName() {
    return this.form.controls.propertyName;
  }

  get address() {
    return this.form.controls.address;
  }

  get city() {
    return this.form.controls.city;
  }

  get squareFeet() {
    return this.form.controls.squareFeet;
  }

  get expectedRent() {
    return this.form.controls.expectedRent;
  }

  get bedrooms() {
    return this.form.controls.bedrooms;
  }

  get bathrooms() {
    return this.form.controls.bathrooms;
  }

  get phone() {
    return this.form.controls.phone;
  }

  get title() {
    return this.form.controls.title;
  }

  get description() {
    return this.form.controls.description;
  }

  get photoUrls(): FormArray<FormControl<string>> {
    return this.form.controls.photos;
  }

  amenityChecked(amenity: string): boolean {
    return this.form.controls.amenities.value.includes(amenity);
  }

  toggleAmenity(amenity: string): void {
    const current = this.form.controls.amenities.value;
    this.form.controls.amenities.setValue(
      current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity],
    );
  }

  addPhoto(): void {
    this.photoUrls.push(this.fb.nonNullable.control('', [Validators.pattern(/^https?:\/\/.+/)]));
  }

  removePhoto(index: number): void {
    this.photoUrls.removeAt(index);
  }

  invalid(control: AbstractControl): boolean {
    return this.submitted() && control.invalid;
  }

  /** Bonus flow: validate, stage the draft and show the preview screen. */
  preview(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.toast.error('Please fix the highlighted errors before previewing.');
      return;
    }
    const staged = this.toListing('published');
    this.listingService.stageDraft(staged);
    this.router.navigate(['/listings', staged.id, 'preview']);
  }

  saveDraft(): void {
    this.submitted.set(true);
    if (this.title.invalid || this.city.invalid) {
      this.toast.error('A title and city are the minimum needed to save a draft.');
      return;
    }
    const draft = this.toListing('draft');
    this.listingService.save(draft);
    this.listingService.clearDraft();
    this.toast.success('Draft saved. You can finish it from My Posts.');
    this.router.navigate(['/profile']);
  }

  cancel(): void {
    this.listingService.clearDraft();
    this.router.navigate(['/home']);
  }

  private buildForm() {
    return this.fb.nonNullable.group({
      propertyType: ['Apartment', Validators.required],
      propertyName: ['', [Validators.required, Validators.maxLength(80)]],
      isShared: [false, Validators.required],
      address: ['', [Validators.required, Validators.maxLength(160)]],
      city: ['', Validators.required],
      squareFeet: [null as number | null, [Validators.required, positiveNumber, Validators.min(50)]],
      bedrooms: [1, [Validators.required, Validators.min(0), Validators.max(20)]],
      bathrooms: [1, [Validators.required, Validators.min(0), Validators.max(20)]],
      leaseType: ['long-term' as LeaseType, Validators.required],
      expectedRent: [null as number | null, [Validators.required, positiveNumber, Validators.min(500)]],
      isNegotiable: [false],
      priceMode: ['per-month' as PriceMode, Validators.required],
      isFurnished: [false, Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s-]{7,14}$/)]],
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(1400)]],
      amenities: [[] as string[]],
      photos: this.fb.nonNullable.array<FormControl<string>>([]),
    });
  }

  private patchFromListing(listing: Listing): void {
    this.form.patchValue({
      propertyType: listing.propertyType,
      propertyName: listing.propertyName,
      isShared: listing.isShared,
      address: listing.address,
      city: listing.city,
      squareFeet: listing.squareFeet,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      leaseType: listing.leaseType,
      expectedRent: listing.expectedRent,
      isNegotiable: listing.isNegotiable,
      priceMode: listing.priceMode,
      isFurnished: listing.isFurnished,
      phone: listing.ownerPhone,
      title: listing.title,
      description: listing.description,
      amenities: [...listing.amenities],
    });
    for (const photo of listing.photos) {
      this.photoUrls.push(this.fb.nonNullable.control(photo));
    }
  }

  private toListing(status: Listing['status']): Listing {
    const user = this.auth.currentUser()!;
    const value = this.form.getRawValue();
    const base = this.editing() ?? emptyListing(user);
    return {
      ...base,
      ownerId: user.id,
      ownerName: user.name,
      ownerEmail: user.email,
      ownerPhone: value.phone,
      propertyType: value.propertyType,
      propertyName: value.propertyName,
      isShared: value.isShared,
      address: value.address,
      city: value.city,
      squareFeet: Number(value.squareFeet),
      bedrooms: Number(value.bedrooms),
      bathrooms: Number(value.bathrooms),
      leaseType: value.leaseType,
      expectedRent: Number(value.expectedRent),
      isNegotiable: value.isNegotiable,
      priceMode: value.priceMode,
      isFurnished: value.isFurnished,
      title: value.title,
      description: value.description,
      amenities: value.amenities as string[],
      photos: (value.photos as string[]).filter((p) => p.trim().length > 0),
      status: this.editing()?.status === 'published' ? 'published' : status,
    };
  }
}

