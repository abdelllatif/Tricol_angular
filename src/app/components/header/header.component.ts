import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  ngAfterViewInit() {}
}
