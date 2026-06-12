import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart-service';
import { Product } from '../model/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card-component.html',
  styleUrls: ['./product-card-component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  added = false;

  constructor(private cart: CartService) {}

  addToCart() {
    this.cart.add(this.product);
    this.added = true;
    setTimeout(() => this.added = false, 1800);
  }
}