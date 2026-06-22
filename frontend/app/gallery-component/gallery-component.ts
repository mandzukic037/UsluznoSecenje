import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer-component/footer-component';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { GalleryService, GalleryItem } from '../services/gallery-service';

@Component({
  selector: 'app-gallery-component',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './gallery-component.html',
  styleUrl: './gallery-component.css',
})
export class GalleryComponent implements OnInit {

  selectedCategory = signal('Sve');
  loading = signal(false);
  errorMsg = signal('');

  categories = ['Sve', 'Lasersko sečenje', 'CNC savijanje', 'Graviranje', 'CAD Design'];
  sizes = ['small', 'medium', 'wide', 'tall'];

  private _items = signal<GalleryItem[]>([]);

  filteredItems = computed(() => {
    const cat = this.selectedCategory();
    return cat === 'Sve'
      ? this._items()
      : this._items().filter(item => item.category === cat);
  });

  constructor(private galleryService: GalleryService) {}

  ngOnInit() {
    this.loading.set(true);
    this.galleryService.getItems().subscribe({
      next: (items) => {
        this._items.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Greška pri učitavanju galerije.');
        this.loading.set(false);
      }
    });
  }

  setCategory(cat: string) { this.selectedCategory.set(cat); }
}