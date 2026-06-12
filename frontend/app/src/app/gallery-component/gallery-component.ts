import { Component } from '@angular/core';
import { FooterComponent } from '../footer-component/footer-component';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-component',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './gallery-component.html',
  styleUrl: './gallery-component.css',
})
export class GalleryComponent {
  selectedCategory = 'Sve';

  sizes = ['small', 'medium', 'wide', 'tall'];

  galleryItems = [
  {
    image: '/sto1.png',
    title: 'Industrijska konstrukcija',
    category: 'Lasersko sečenje',
  },
  {
    image: '/sto2.png',
    title: 'Metalni detalji',
    category: 'Graviranje',
  },
  {
    image: '/sto3.png',
    title: 'Precizna obrada',
    category: 'CNC savijanje',
  },
  {
    image: '/sto4.png',
    title: 'Proizvodni element',
    category: 'Lasersko sečenje',
  },
  {
    image: '/sto5.png',
    title: 'Industrijski projekat',
    category: 'CAD Design',
  },
  {
    image: '/rostilj1.jpeg',
    title: 'Metalna konstrukcija',
    category: 'CNC savijanje',
  }
];

  get filteredItems() {
    if (this.selectedCategory === 'Sve') {
      return this.galleryItems;
    }

    return this.galleryItems.filter(
      item => item.category === this.selectedCategory
    );
  }

}
