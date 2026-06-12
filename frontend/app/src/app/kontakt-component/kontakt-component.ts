import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar-component/navbar-component";
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-kontakt-component',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './kontakt-component.html',
  styleUrl: './kontakt-component.css',
})
export class KontaktComponent {
}
