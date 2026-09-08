import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Listing } from '../../../core/models/listing.model';
import { ListingService } from '../../../core/services/listing.service';
import { ToastService } from '../../../core/services/toast.service';

const LEASE_LABELS: Record<Listing['leaseType'], string> = {
  'long-term': 'Long term (6+ months)',
  'short-term': 'Short term',
  both: 'Long & short term',
};

const PRICE_LABELS: Record<Listing['priceMode'], string> = {
  'per-month': 'Per month',
  'utilities-included': 'Utilities included in rent',
};

/**
 * Bonus screen: "Preview and Submit" — shows a summary of the staged post
 * before it goes live, exactly like the wireframe.
 */
@Component({
  selector: 'app-preview-submit',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './preview-submit.html',
  styleUrl: './preview-submit.scss',
})
export class PreviewSubmit {
  private readonly listingService = inject(ListingService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly draft = this.listingService.pendingDraft;
  readonly submitting = signal(false);

  readonly leaseLabel = computed(() => {
    const draft = this.draft();
    return draft ? LEASE_LABELS[draft.leaseType] : '';
  });

  readonly priceLabel = computed(() => {
    const draft = this.draft();
    return draft ? PRICE_LABELS[draft.priceMode] : '';
  });

  readonly photoPreviews = computed(() => {
    const photos = this.draft()?.photos ?? [];
    return photos.length > 0 ? photos : ['images/listings/apartment-1.svg'];
  });

  confirm(): void {
    const draft = this.draft();
    if (!draft) {
      this.router.navigate(['/listings/new']);
      return;
    }
    this.submitting.set(true);
    this.listingService.save(draft);
    this.listingService.clearDraft();
    this.toast.success('Your post is now live!');
    this.router.navigate(['/listings', draft.id]);
  }

  backToEdit(): void {
    const draft = this.draft();
    if (!draft) {
      this.router.navigate(['/listings/new']);
      return;
    }
    const saved = this.listingService.getById(draft.id);
    if (saved) {
      this.router.navigate(['/listings', draft.id, 'edit']);
    } else {
      this.router.navigate(['/listings/new'], { queryParams: { fromDraft: 1 } });
    }
  }
}
