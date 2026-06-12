import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { UpitComponent } from '../upit-component/upit-component';
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-secenje-usluga-component',
  imports: [NavbarComponent, UpitComponent, FooterComponent],
  templateUrl: './secenje-usluga-component.html',
  styleUrl: './secenje-usluga-component.css',
})
export class SecenjeUslugaComponent {

}
