import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { UpitComponent } from '../upit-component/upit-component';
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-cnc-savijanje-component',
  imports: [NavbarComponent, UpitComponent, FooterComponent],
  templateUrl: './cnc-savijanje-component.html',
  styleUrl: './cnc-savijanje-component.css',
})
export class CncSavijanjeComponent {

}
