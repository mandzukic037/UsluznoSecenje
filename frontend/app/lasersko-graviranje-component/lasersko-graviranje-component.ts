import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { UpitComponent } from '../upit-component/upit-component';
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-lasersko-graviranje-component',
  imports: [NavbarComponent, UpitComponent, FooterComponent],
  templateUrl: './lasersko-graviranje-component.html',
  styleUrl: './lasersko-graviranje-component.css',
})
export class LaserskoGraviranjeComponent {

}
