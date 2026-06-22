import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { UpitComponent } from '../upit-component/upit-component';
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-cad-usluga-component',
  imports: [NavbarComponent, UpitComponent, FooterComponent],
  templateUrl: './cad-usluga-component.html',
  styleUrl: './cad-usluga-component.css',
})
export class CadUslugaComponent {

}
