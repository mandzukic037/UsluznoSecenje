import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart-service';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-component.html',
  styleUrls: ['./cart-component.css']
})
export class CartComponent {
  @Output() close = new EventEmitter<void>();
  apiUrl = environment.apiUrl;

  constructor(public cart: CartService) {}

  increment(id: number, qty: number) { this.cart.updateQuantity(id, qty + 1); }
  decrement(id: number, qty: number) { this.cart.updateQuantity(id, qty - 1); }
}