import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn = signal(false);

  login(credentials: { email: string; password: string }) {
    // TODO: appel API Spring Boot /api/auth/login
    this.isLoggedIn.set(true);
    return Promise.resolve(true);
  }

  logout() {
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  constructor(private router: Router) {}
}
