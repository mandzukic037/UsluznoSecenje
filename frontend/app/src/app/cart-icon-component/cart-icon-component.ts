import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart-service';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-icon-component.html',
  styleUrls: ['./cart-icon-component.css']
})
export class CartIconComponent {
  constructor(public cart: CartService) {}
}