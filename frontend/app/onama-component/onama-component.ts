import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar-component/navbar-component';

@Component({
  selector: 'app-onama-component',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './onama-component.html',
  styleUrl: './onama-component.css',
})
export class OnamaComponent {

}
