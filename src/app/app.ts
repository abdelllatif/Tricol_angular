import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <!-- Navbar hidden only on '/' -->
    <nav *ngIf="router.url == '/'" class="navbar">
      <div class="logo">
        <img src="assets/images/TRICOL.png" alt="Tricol Logo" class="logo-img">
      </div>

      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" class="nav-link">Accueil</a>
        <a routerLink="/catalogue" routerLinkActive="active" class="nav-link">Catalogue</a>
        <a routerLink="/about" routerLinkActive="active" class="nav-link">À propos</a>
        <a routerLink="/login" routerLinkActive="active" class="nav-link">Connexion</a>
      </div>
    </nav>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,.08);
    }
    .logo-img {
      height: 56px;
      width: auto;
    }
    .nav-links {
      display: flex;
      gap: 2rem;
    }
    .nav-link {
      color: #222;
      font-weight: 500;
      text-decoration: none;
      transition: color .2s;
    }
    .nav-link:hover, .nav-link.active {
      color: #007bff;
    }
    @media (max-width: 768px) {
      .nav-links {
        gap: 1rem;
        font-size: .95rem;
      }
    }
  `]
})
export class App {
  constructor(public router: Router) {}
}
