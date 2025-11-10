import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = localStorage.getItem('sidebar') === 'collapsed';

  constructor(private router: Router) {}

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebar', this.isCollapsed ? 'collapsed' : 'open');
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
