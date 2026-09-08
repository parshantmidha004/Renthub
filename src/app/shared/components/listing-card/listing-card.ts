import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Listing } from '../../../core/models/listing.model';
import { AuthService } from '../../../core/services/auth.service';
import { ListingService } from '../../../core/services/listing.service';
import { ToastService } from '../../../core/services/toast.service';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

/** Card shown in the home grid and profile favourites; supports quick actions. */
@Component({
  selector: 'app-listing-card',
  imports: [DecimalPipe, RouterLink, TimeAgoPipe, TruncatePipe],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.scss',
})
export class ListingCardComponent {
  private readonly auth = inject(AuthService);
  private readonly listingService = inject(ListingService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly listing = input.required<Listing>();

  readonly isFavorite = computed(() => {
    const user = this.auth.currentUser();
    return user ? this.listingService.isFavorite(user.id, this.listing().id) : false;
  });

  readonly previewAmenities = computed(() => this.listing().amenities.slice(0, 3));

  readonly extraAmenities = computed(() =>
    this.listing().amenities.length > 3 ? this.listing().amenities.length - 3 : 0,
  );

  readonly photo = computed(() => this.listing().photos[0] ?? 'images/listings/apartment-1.svg');

  toggleFavorite(): void {
    const user = this.auth.currentUser();
    if (!user) {
      this.toast.info('Login to mark listings as favourites.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    const added = this.listingService.toggleFavorite(user.id, this.listing().id);
    this.toast.success(
      added ? 'Added to your favourites.' : 'Removed from your favourites.',
    );
  }
}
