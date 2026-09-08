import { Injectable, computed, inject, signal } from '@angular/core';
import { RegisterPayload, User, AuthResult } from '../models/user.model';
import { StorageService } from './storage.service';
import { SEED_USERS } from '../data/seed-users';

const USERS_KEY = 'renthub.users';
const SESSION_KEY = 'renthub.session';

/**
 * Handles user registration, login/logout and the current session.
 * Data is persisted in localStorage - this is a demo application without a backend.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);

  /** Exposed for unit tests only. */
  readonly usersKey = USERS_KEY;
  readonly sessionKey = SESSION_KEY;

  private readonly users = signal<User[]>(this.loadOrSeedUsers());
  readonly currentUser = signal<User | null>(this.restoreSession());

  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  register(payload: RegisterPayload): AuthResult {
    const email = payload.email.trim().toLowerCase();
    if (this.users().some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    const user: User = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      email,
      password: payload.password,
      phone: payload.phone,
      createdAt: new Date().toISOString(),
    };
    this.users.update((list) => [...list, user]);
    this.storage.write(USERS_KEY, this.users());
    this.startSession(user);
    return { ok: true, user };
  }

  login(email: string, password: string): AuthResult {
    const user = this.users().find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!user) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    this.startSession(user);
    return { ok: true, user };
  }

  logout(): void {
    this.storage.remove(SESSION_KEY);
    this.currentUser.set(null);
  }

  getUserById(id: string): User | undefined {
    return this.users().find((u) => u.id === id);
  }

  private startSession(user: User): void {
    this.storage.write(SESSION_KEY, user.id);
    this.currentUser.set(user);
  }

  private restoreSession(): User | null {
    const sessionId = this.storage.read<string | null>(SESSION_KEY, null);
    if (!sessionId) {
      return null;
    }
    return this.users().find((u) => u.id === sessionId) ?? null;
  }

  private loadOrSeedUsers(): User[] {
    const existing = this.storage.read<User[] | null>(USERS_KEY, null);
    if (existing === null) {
      this.storage.write(USERS_KEY, SEED_USERS);
      return [...SEED_USERS];
    }
    return existing;
  }
}
