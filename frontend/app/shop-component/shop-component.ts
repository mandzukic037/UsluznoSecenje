import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../product-card-component/product-card-component';
import { CartComponent } from '../cart-component/cart-component';
import { CartIconComponent } from '../cart-icon-component/cart-icon-component';
import { Product } from '../model/product';
import { ProductService } from '../services/product-service';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, CartComponent, CartIconComponent, NavbarComponent, FooterComponent],
  templateUrl: './shop-component.html',
  styleUrls: ['./shop-component.css']
})
export class ShopComponent implements OnInit {

  cartOpen = signal(false);
  selectedCategory = signal('Sve');
  loading = signal(false);
  errorMsg = signal('');

  categories = ['Sve', 'Lasersko sečenje', 'CNC savijanje', 'Graviranje', 'CAD Design'];

  private _products = signal<Product[]>([]);

  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    return cat === 'Sve'
      ? this._products()
      : this._products().filter(p => p.category === cat);
  });

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this._products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Greška pri učitavanju proizvoda.');
        this.loading.set(false);
      }
    });
  }

  setCategory(cat: string) { this.selectedCategory.set(cat); }
  toggleCart() { this.cartOpen.update(v => !v); }
  closeCart() { this.cartOpen.set(false); }
}