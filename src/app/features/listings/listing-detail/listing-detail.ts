import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommentService } from '../../../core/services/comment.service';
import { ListingService } from '../../../core/services/listing.service';
import { ToastService } from '../../../core/services/toast.service';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { CommentSection } from '../comment-section/comment-section';

const LEASE_LABELS: Record<string, string> = {
  'long-term': 'Long term (6+ months)',
  'short-term': 'Short term',
  both: 'Long & short term',
};

const PRICE_LABELS: Record<string, string> = {
  'per-month': 'Per month',
  'utilities-included': 'Utilities included',
};

/** View Details screen: gallery, full information, inquiries and comments. */
@Component({
  selector: 'app-listing-detail',
  imports: [DecimalPipe, ReactiveFormsModule, RouterLink, TimeAgoPipe, CommentSection],
  templateUrl: './listing-detail.html',
  styleUrl: './listing-detail.scss',
})
export class ListingDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly listingService = inject(ListingService);
  private readonly commentService = inject(CommentService);
  private readonly toast = inject(ToastService);

  readonly listing = computed(() => {
    const id = this.listingId();
    return id ? this.listingService.getById(id) ?? null : null;
  });

  readonly comments = computed(() => {
    const id = this.listingId();
    return id ? this.commentService.commentsFor(id) : [];
  });

  readonly commentCount = computed(() => this.comments().length);

  readonly isOwner = computed(
    () => !!this.listing() && this.listing()!.ownerId === this.auth.currentUser()?.id,
  );

  readonly isFavorite = computed(() => {
    const user = this.auth.currentUser();
    const listing = this.listing();
    return !!user && !!listing && this.listingService.isFavorite(user.id, listing.id);
  });

  readonly activePhoto = signal<string | null>(null);
  readonly showInquiryForm = signal(false);
  readonly inquirySent = signal(false);

  readonly photos = computed(() => {
    const listing = this.listing();
    if (!listing) {
      return [];
    }
    return listing.photos.length > 0
      ? listing.photos
      : ['images/listings/apartment-1.svg'];
  });

  private readonly listingId = signal<string | null>(null);

  readonly inquiryForm = this.fb.nonNullable.group({
    phone: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s-]{7,14}$/)]],
    message: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(500)],
    ],
  });

  ngOnInit(): void {
    this.listingId.set(this.route.snapshot.paramMap.get('id'));
    const listing = this.listing();
    if (!listing) {
      this.toast.error('That post does not exist.');
      this.router.navigate(['/home']);
      return;
    }
    this.listingService.incrementViews(listing.id);
    this.inquiryForm.patchValue({ phone: this.auth.currentUser()?.phone ?? '' });
  }

  leaseLabel(): string {
    const lease = this.listing()?.leaseType;
    return lease ? (LEASE_LABELS[lease] ?? lease) : '';
  }

  priceLabel(): string {
    const mode = this.listing()?.priceMode;
    return mode ? (PRICE_LABELS[mode] ?? mode) : '';
  }

  mainPhoto(): string {
    return this.activePhoto() ?? this.photos()[0];
  }

  setActivePhoto(photo: string): void {
    this.activePhoto.set(photo);
  }

  toggleFavorite(): void {
    const user = this.auth.currentUser();
    const listing = this.listing();
    if (!user || !listing) {
      this.toast.info('Login to save favourites.');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/listings/${this.listingId}` },
      });
      return;
    }
    const added = this.listingService.toggleFavorite(user.id, listing.id);
    this.toast.success(added ? 'Added to your favourites.' : 'Removed from your favourites.');
  }

  toggleInquiryForm(): void {
    this.showInquiryForm.update((open) => !open);
  }

  sendInquiry(): void {
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      return;
    }
    const listing = this.listing();
    const user = this.auth.currentUser();
    if (!listing || !user) {
      return;
    }
    const value = this.inquiryForm.getRawValue();
    this.listingService.addInquiry({
      id: crypto.randomUUID(),
      listingId: listing.id,
      listingTitle: listing.title,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      phone: value.phone,
      message: value.message.trim(),
      createdAt: new Date().toISOString(),
    });
    this.inquiryForm.reset({ phone: user.phone ?? '', message: '' });
    this.inquirySent.set(true);
    this.toast.success('Inquiry sent! The landlord can now reach out to you.');
  }

  deletePost(): void {
    const listing = this.listing();
    if (!listing || !this.isOwner()) {
      return;
    }
    const confirmed = window.confirm('Delete this post permanently?');
    if (!confirmed) {
      return;
    }
    this.listingService.delete(listing.id);
    this.toast.info('Post deleted.');
    this.router.navigate(['/home']);
  }
}
