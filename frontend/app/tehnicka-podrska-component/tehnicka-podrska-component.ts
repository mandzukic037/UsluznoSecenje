import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { UpitComponent } from '../upit-component/upit-component';
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-tehnicka-podrska-component',
  imports: [NavbarComponent, UpitComponent, FooterComponent],
  templateUrl: './tehnicka-podrska-component.html',
  styleUrl: './tehnicka-podrska-component.css',
})
export class TehnickaPodrskaComponent {

}
