import { User } from '../models/user.model';

/** Demo accounts documented in the README. */
export const SEED_USERS: User[] = [
  {
    id: 'seed-landlord',
    name: 'Priya Sharma',
    email: 'landlord@renthub.com',
    password: 'Demo@123',
    phone: '+91 98765 43210',
    createdAt: '2025-11-01T09:00:00.000Z',
  },
  {
    id: 'seed-tenant',
    name: 'Demo User',
    email: 'demo@renthub.com',
    password: 'Demo@123',
    phone: '+91 81234 56789',
    createdAt: '2025-11-02T09:00:00.000Z',
  },
];
