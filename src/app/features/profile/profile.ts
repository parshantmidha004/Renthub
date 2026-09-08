import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Inquiry } from '../../core/models/inquiry.model';
import { ListingService } from '../../core/services/listing.service';
import { ToastService } from '../../core/services/toast.service';
import { ListingCardComponent } from '../../shared/components/listing-card/listing-card';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

/** My Account: my posts (with delete) and favourites. */
@Component({
  selector: 'app-profile',
  imports: [RouterLink, ListingCardComponent, TimeAgoPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly listingService = inject(ListingService);
  private readonly toast = inject(ToastService);

  readonly currentUser = this.auth.currentUser;

  readonly tab = signal<'posts' | 'favorites'>(
    this.route.snapshot.queryParamMap.get('tab') === 'favorites' ? 'favorites' : 'posts',
  );

  readonly myPosts = computed(() => {
    const user = this.currentUser();
    return user ? this.listingService.myPosts(user.id) : [];
  });

  readonly favorites = computed(() => {
    const user = this.currentUser();
    return user ? this.listingService.favoritesOf(user.id) : [];
  });

  readonly myInquiries = computed<Inquiry[]>(() => {
    const user = this.currentUser();
    return user ? this.listingService.inquiriesByUser(user.id) : [];
  });

  setTab(tab: 'posts' | 'favorites'): void {
    this.tab.set(tab);
    this.router.navigate([], { queryParams: { tab }, replaceUrl: true });
  }

  removePost(id: string): void {
    const confirmed = window.confirm('Delete this post permanently?');
    if (!confirmed) {
      return;
    }
    this.listingService.delete(id);
    this.toast.info('Post deleted.');
  }
}
