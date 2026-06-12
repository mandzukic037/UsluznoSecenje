import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../model/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'cart';

  private _items = signal<CartItem[]>([]);

  items = this._items.asReadonly();

  totalCount = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  totalPrice = computed(() =>
    this._items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  constructor() {
    const savedCart = localStorage.getItem(this.STORAGE_KEY);

    if (savedCart) {
      try {
        this._items.set(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  private saveCart(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this._items())
    );
  }

  add(product: Product): void {
    this._items.update(items => {
      const existing = items.find(i => i.product.id === product.id);

      if (existing) {
        return items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...items, { product, quantity: 1 }];
    });

    this.saveCart();
  }

  remove(productId: number): void {
    this._items.update(items =>
      items.filter(i => i.product.id !== productId)
    );

    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }

    this._items.update(items =>
      items.map(i =>
        i.product.id === productId
          ? { ...i, quantity }
          : i
      )
    );

    this.saveCart();
  }

  clear(): void {
    this._items.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}