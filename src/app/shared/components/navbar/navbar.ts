import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.auth.currentUser;
  readonly menuOpen = signal(false);
  readonly userMenuOpen = signal(false);

  get initials(): string {
    const name = this.currentUser()?.name ?? '';
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((open) => !open);
  }

  closeMenus(): void {
    this.menuOpen.set(false);
    this.userMenuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.closeMenus();
    this.router.navigate(['/home']);
  }
}
