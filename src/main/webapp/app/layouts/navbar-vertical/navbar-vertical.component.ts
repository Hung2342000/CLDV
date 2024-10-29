import { Component } from '@angular/core';

@Component({
  selector: 'jhi-navbar-vertical',
  templateUrl: './navbar-vertical.component.html',
  styleUrls: ['./navbar-vertical.component.scss'],
})
export class NavbarVerticalComponent {
  isNavbarCollapsed = true;
  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }
}
