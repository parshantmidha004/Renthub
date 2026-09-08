import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ListingCardComponent } from './listing-card';
import { Listing } from '../../../core/models/listing.model';
import { AuthService } from '../../../core/services/auth.service';
import { ListingService } from '../../../core/services/listing.service';

@Component({ selector: 'app-login-stub', template: '', standalone: true })
class LoginStub {}

describe('ListingCardComponent', () => {
  let fixture: ReturnType<typeof createFixture>;

  const mockListing: Listing = {
    id: 'listing-1',
    ownerId: 'owner-1',
    ownerName: 'Priya Sharma',
    ownerEmail: 'owner@renthub.com',
    ownerPhone: '+91 98765 43210',
    propertyType: 'Apartment',
    propertyName: 'Palm Springs',
    isShared: false,
    address: '12, 100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    squareFeet: 1150,
    bedrooms: 2,
    bathrooms: 2,
    leaseType: 'long-term',
    expectedRent: 32000,
    isNegotiable: true,
    priceMode: 'per-month',
    isFurnished: true,
    amenities: ['Gym/Fitness Center', 'Swimming Pool', 'Car Park', 'Elevator'],
    title: 'Sunny 2BHK with Skyline Views',
    description: 'A bright, airy 2BHK on the 7th floor with a wide balcony.',
    photos: ['images/listings/apartment-1.svg'],
    status: 'published',
    createdAt: new Date().toISOString(),
    views: 10,
  };

  function createFixture() {
    return TestBed.createComponent(ListingCardComponent);
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ListingCardComponent],
      providers: [provideRouter([{ path: 'login', component: LoginStub }])],
    }).compileComponents();
    fixture = createFixture();
  });

  it('renders the listing title, city and rent', async () => {
    fixture.componentRef.setInput('listing', mockListing);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.card-title')?.textContent).toContain('Sunny 2BHK with Skyline Views');
    expect(el.textContent).toContain('Bengaluru');
    expect(el.textContent).toContain('32,000');
  });

  it('shows "Mark as Favorite" and toggles for a logged-in user', async () => {
    const auth = TestBed.inject(AuthService);
    auth.login('demo@renthub.com', 'Demo@123');

    fixture.componentRef.setInput('listing', mockListing);
    await fixture.whenStable();

    const service = TestBed.inject(ListingService);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.fav-btn');

    button.click();
    expect(service.isFavorite('seed-tenant', mockListing.id)).toBe(true);

    button.click();
    expect(service.isFavorite('seed-tenant', mockListing.id)).toBe(false);
  });

  it('does not toggle favourites for guests', async () => {
    fixture.componentRef.setInput('listing', mockListing);
    await fixture.whenStable();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.fav-btn')!.click();
    const service = TestBed.inject(ListingService);
    expect(service.isFavorite('any-user', mockListing.id)).toBe(false);
  });

  it('limits the visible amenities to three with a "+n more" chip', async () => {
    fixture.componentRef.setInput('listing', mockListing);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    const chips = el.querySelectorAll('.amenity-chips .chip');
    expect(chips.length).toBe(4); // 3 amenities + "+1 more"
    expect(chips[chips.length - 1].textContent).toContain('+1 more');
  });
});
