import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css'
})
export class NavbarComponent {
  menuOpen = false;
  mobileUslugeOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleMobileUsluge() {
    this.mobileUslugeOpen = !this.mobileUslugeOpen;
  }

  @HostListener('window:scroll')
  onScroll() {
    const progress = Math.min(window.scrollY / (window.innerHeight * 0.6), 1);
    const nav = document.querySelector('.navSection') as HTMLElement;
    if (nav) {
      nav.style.backgroundColor = `rgba(26, 31, 41, ${progress})`;
    }
  }
}