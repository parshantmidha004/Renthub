import { Listing } from '../models/listing.model';

const LANDLORD = {
  id: 'seed-landlord',
  name: 'Priya Sharma',
  email: 'landlord@renthub.com',
  phone: '+91 98765 43210',
};

function listing(data: Partial<Listing>): Listing {
  return {
    id: crypto.randomUUID(),
    ownerId: LANDLORD.id,
    ownerName: LANDLORD.name,
    ownerEmail: LANDLORD.email,
    ownerPhone: LANDLORD.phone,
    propertyType: 'Apartment',
    propertyName: '',
    isShared: false,
    address: '',
    city: 'Bengaluru',
    squareFeet: 1000,
    bedrooms: 2,
    bathrooms: 2,
    leaseType: 'long-term',
    expectedRent: 25000,
    isNegotiable: false,
    priceMode: 'per-month',
    isFurnished: false,
    amenities: [],
    title: '',
    description: '',
    photos: [],
    status: 'published',
    createdAt: new Date().toISOString(),
    views: 0,
    ...data,
  };
}

/** Demo listings created on first run so the app never looks empty. */
export const SEED_LISTINGS: Listing[] = [
  listing({
    title: 'Sunny 2BHK with Skyline Views in Indiranagar',
    propertyName: 'Palm Springs',
    address: '12, 100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    squareFeet: 1150,
    bedrooms: 2,
    bathrooms: 2,
    expectedRent: 32000,
    isNegotiable: true,
    isFurnished: true,
    amenities: ['Gym/Fitness Center', 'Swimming Pool', 'Car Park', 'Elevator', 'Power Backup'],
    description:
      'A bright, airy 2BHK on the 7th floor with a wide balcony overlooking the city skyline. ' +
      'The society has a rooftop pool, a fully equipped gym and 24x7 security. Walking distance ' +
      'from Indiranagar metro and the buzzing 100 Feet Road cafe strip. Ideal for working ' +
      'professionals or a small family looking for a premium, move-in ready home.',
    photos: ['images/listings/apartment-1.svg', 'images/listings/apartment-2.svg'],
    createdAt: '2026-08-28T10:00:00.000Z',
    views: 128,
  }),
  listing({
    title: 'Sea-Facing 1BHK Studio, Walk to Bandra Promenade',
    propertyName: 'Ocean Heights',
    address: 'Carter Road, Bandra West',
    city: 'Mumbai',
    squareFeet: 620,
    bedrooms: 1,
    bathrooms: 1,
    expectedRent: 45000,
    priceMode: 'utilities-included',
    isFurnished: true,
    leaseType: 'both',
    amenities: ['Elevator', 'Plant Security System', 'Power Backup', 'Water Heater', 'Laundry Service'],
    description:
      'Wake up to the Arabian Sea in this charming studio just off Carter Road. Rent includes ' +
      'maintenance, electricity and Wi-Fi. Fully furnished with a work-from-home nook, the ' +
      'building offers a gym and round-the-clock security. Perfect for a single professional ' +
      'who wants the best of Mumbai at the doorstep.',
    photos: ['images/listings/apartment-3.svg', 'images/listings/apartment-4.svg'],
    createdAt: '2026-08-25T10:00:00.000Z',
    views: 96,
  }),
  listing({
    title: 'Spacious 3BHK Family Home with Private Lawn, Sector 45',
    propertyName: 'Green Meadows Residency',
    address: 'Sector 45, Golf Course Road',
    city: 'Gurugram',
    squareFeet: 1850,
    bedrooms: 3,
    bathrooms: 3,
    expectedRent: 55000,
    isNegotiable: true,
    isFurnished: false,
    amenities: ['Private Lawn', 'Club House', 'Swimming Pool', 'Visitors Parking', 'Plant Security System'],
    description:
      'A beautifully planned 3BHK with a private lawn, perfect for families with kids or pets. ' +
      'The gated community includes a club house, pool and dedicated childrens play area. Close ' +
      'to top schools and Cyber City. Landlord is open to long-term tenants and light negotiation.',
    photos: ['images/listings/apartment-5.svg', 'images/listings/apartment-6.svg'],
    createdAt: '2026-08-22T10:00:00.000Z',
    views: 74,
  }),
  listing({
    title: 'Affordable Shared 2BHK for Students near Kothrud',
    propertyName: 'Shivneri Apartments',
    address: 'Paud Road, Kothrud',
    city: 'Pune',
    squareFeet: 900,
    bedrooms: 2,
    bathrooms: 2,
    expectedRent: 9500,
    isShared: true,
    isFurnished: true,
    leaseType: 'long-term',
    amenities: ['Water Heater', 'Power Backup', 'Garbage Disposal', 'Car Park'],
    description:
      'Rent a room in a friendly shared 2BHK, utilities split between flatmates. Fully furnished ' +
      'with study desks in every room. Located on Paud Road with easy access to colleges, cafes ' +
      'and the metro. Vegetarian kitchen preferred. Great option for students and interns.',
    photos: ['images/listings/apartment-7.svg', 'images/listings/apartment-8.svg'],
    createdAt: '2026-08-20T10:00:00.000Z',
    views: 51,
  }),
  listing({
    title: 'HiTech City 2BHK with Club House Access, Madhapur',
    propertyName: 'Cyber Green Towers',
    address: 'Ayyappa Society, Madhapur',
    city: 'Hyderabad',
    squareFeet: 1250,
    bedrooms: 2,
    bathrooms: 2,
    expectedRent: 28000,
    isFurnished: true,
    isNegotiable: true,
    amenities: ['Gym/Fitness Center', 'Club House', 'Elevator', 'Car Park', 'Laundry Service'],
    description:
      'Modern 2BHK minutes away from HiTech City and Cyber Towers. Semi-furnished with wardrobes, ' +
      'modular kitchen and ACs in both bedrooms. The tower has a well-maintained gym, club house ' +
      'and covered parking. Short-term corporate leases also welcome.',
    photos: ['images/listings/apartment-9.svg', 'images/listings/apartment-1.svg'],
    createdAt: '2026-08-18T10:00:00.000Z',
    views: 63,
  }),
  listing({
    title: 'Quiet 2BHK in CP, Walking Distance to Metro',
    propertyName: 'Connaught Place Residency',
    address: 'Kasturba Marg, Connaught Place',
    city: 'New Delhi',
    squareFeet: 1050,
    bedrooms: 2,
    bathrooms: 2,
    expectedRent: 38000,
    priceMode: 'per-month',
    amenities: ['Power Backup', 'Elevator', 'Visitors Parking', 'Water Heater', 'Plant Security System'],
    description:
      'Classic Lutyens-era charm with modern interiors, right in the heart of Delhi. Two minute ' +
      'walk to Rajiv Chowk metro. Full power backup, dedicated parking and 24x7 security. ' +
      'Suitable for families or two working professionals sharing.',
    photos: ['images/listings/apartment-2.svg', 'images/listings/apartment-5.svg'],
    createdAt: '2026-08-15T10:00:00.000Z',
    views: 88,
  }),
  listing({
    title: 'Beachside Short-Stay 1BHK in Thiruvanmiyur',
    propertyName: 'Marina Winds',
    address: 'ECR, Thiruvanmiyur',
    city: 'Chennai',
    squareFeet: 700,
    bedrooms: 1,
    bathrooms: 1,
    expectedRent: 18000,
    leaseType: 'short-term',
    isFurnished: true,
    amenities: ['Swimming Pool', 'Laundry Service', 'Power Backup', 'Elevator'],
    description:
      'Fully serviced 1BHK available for short stays of one to six months. Housekeeping, Wi-Fi ' +
      'and utilities are included. A five minute stroll to the beach with cafes and supermarkets ' +
      'nearby. Ideal for project consultants and travelling couples.',
    photos: ['images/listings/apartment-4.svg', 'images/listings/apartment-9.svg'],
    createdAt: '2026-08-12T10:00:00.000Z',
    views: 40,
  }),
  listing({
    title: 'Pet-Friendly 3BHK Garden Unit in Whitefield',
    propertyName: 'Prestige Lakeside',
    address: 'Varthur Road, Whitefield',
    city: 'Bengaluru',
    squareFeet: 2100,
    bedrooms: 3,
    bathrooms: 3,
    expectedRent: 62000,
    isNegotiable: true,
    amenities: ['Private Lawn', 'Swimming Pool', 'Gym/Fitness Center', 'Club House', 'Car Park'],
    description:
      'A premium garden-facing unit in a lakeside township. Huge deck, modular kitchen and ' +
      'staff room. The township offers multiple pools, a gym and jogging tracks. Pets welcome. ' +
      'Available immediately for long-term lease.',
    photos: ['images/listings/apartment-6.svg', 'images/listings/apartment-3.svg'],
    createdAt: '2026-08-08T10:00:00.000Z',
    views: 112,
  }),
  listing({
    title: 'Budget 1BHK for Young Professionals in Sector 62',
    propertyName: 'Amrapali Sapphire',
    address: 'Sector 62, Near Metro Station',
    city: 'Noida',
    squareFeet: 580,
    bedrooms: 1,
    bathrooms: 1,
    expectedRent: 12000,
    isFurnished: false,
    amenities: ['Power Backup', 'Car Park', 'Water Heater'],
    description:
      'Simple, well-maintained 1BHK a short walk from Noida Sector 62 metro. Unfurnished so you ' +
      'can set it up your way. The society has reliable power backup and covered parking. A ' +
      'great starter home for young professionals working in Noida IT parks.',
    photos: ['images/listings/apartment-8.svg', 'images/listings/apartment-7.svg'],
    createdAt: '2026-08-05T10:00:00.000Z',
    views: 29,
  }),
];

