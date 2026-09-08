import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

describe('AuthService', () => {
  let service: AuthService;

  const freshStorage = () => {
    localStorage.clear();
    // Re-create the service so it re-seeds from a clean slate.
    service = TestBed.inject(AuthService);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    freshStorage();
  });

  it('seeds demo users on first run', () => {
    const users = JSON.parse(localStorage.getItem(service.usersKey) ?? '[]') as {
      email: string;
    }[];
    expect(users.length).toBeGreaterThan(0);
    expect(users.some((u) => u.email === 'demo@renthub.com')).toBe(true);
  });

  it('registers a new user and starts a session', () => {
    const result = service.register({ name: 'Jane Doe', email: 'jane@test.com', password: 'Secret1' });
    expect(result.ok).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUser()?.email).toBe('jane@test.com');
  });

  it('rejects duplicate email registration', () => {
    service.register({ name: 'Jane', email: 'jane@test.com', password: 'Secret1' });
    // Log out to prove the failure is not mistaken for a session
    service.logout();
    const result = service.register({ name: 'Another Jane', email: 'JANE@test.com', password: 'Secret1' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('already exists');
    }
    expect(service.isLoggedIn()).toBe(false);
  });

  it('logs in with valid credentials', () => {
    const result = service.login('demo@renthub.com', 'Demo@123');
    expect(result.ok).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUser()?.name).toBe('Demo User');
  });

  it('rejects invalid credentials', () => {
    const result = service.login('demo@renthub.com', 'WrongPass');
    expect(result.ok).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('clears the session on logout', () => {
    service.login('demo@renthub.com', 'Demo@123');
    expect(service.isLoggedIn()).toBe(true);
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('restores the session from storage on construction', () => {
    service.login('demo@renthub.com', 'Demo@123');
    const storage = TestBed.inject(StorageService);
    const sessionId = storage.read<string | null>(service.sessionKey, null);
    expect(sessionId).not.toBeNull();

    // A fresh service instance should pick up the persisted session.
    TestBed.resetTestingModule();
    const second = TestBed.inject(AuthService);
    expect(second.currentUser()?.email).toBe('demo@renthub.com');
  });
});
