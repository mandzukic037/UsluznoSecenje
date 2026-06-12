import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../services/cart-service';
import { environment } from '../../environments/environment';

type Step = 'korpa' | 'dostava' | 'potvrda';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout-component.html',
  styleUrls: ['./checkout-component.css']
})
export class CheckoutComponent {

  private readonly API_URL = environment.apiUrl + '/api';

  currentStep = signal<Step>('korpa');
  orderDone = signal(false);
  orderLoading = signal(false);
  submitted = false;
  errorMessage = ''

  form: FormGroup;

  steps: { key: Step; label: string; icon: string }[] = [
    { key: 'korpa',   label: 'Korpa',   icon: '🛒' },
    { key: 'dostava', label: 'Dostava', icon: '📦' },
    { key: 'potvrda', label: 'Potvrda', icon: '✅' },
  ];

  constructor(
    public cart: CartService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      ime:      ['', Validators.required],
      prezime:  ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      telefon:  ['', Validators.required],
      firma:    [''],
      pib:      [''],
      adresa:   ['', Validators.required],
      grad:     ['', Validators.required],
      postBroj: ['', Validators.required],
      napomena: [''],
      dostava:  ['preuzimanje', Validators.required],
      placanje: ['racun', Validators.required],
    });
  }

  goTo(step: Step) { this.currentStep.set(step); }

  isDone(step: Step): boolean {
    const order: Step[] = ['korpa', 'dostava', 'potvrda'];
    return order.indexOf(step) < order.indexOf(this.currentStep());
  }

  nextStep() {
    if (this.currentStep() === 'korpa') {
      this.goTo('dostava');
      return;
    }

    if (this.currentStep() === 'dostava') {
      this.submitted = true;

      if (this.form.invalid) {
        this.form.markAllAsTouched();
        setTimeout(() => {
          document
            .querySelector('.error')
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        return;
      }

      this.goTo('potvrda');
    }
  }

  prevStep() {
    if (this.currentStep() === 'dostava') this.goTo('korpa');
    if (this.currentStep() === 'potvrda') this.goTo('dostava');
  }

  submitOrder() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.goTo('dostava');
      return;
    }

    this.orderLoading.set(true);

    const payload = {
      kupac: {
        ime:      this.form.value.ime,
        prezime:  this.form.value.prezime,
        email:    this.form.value.email,
        telefon:  this.form.value.telefon,
        firma:    this.form.value.firma || null,
        pib:      this.form.value.pib || null,
      },
      dostava: {
        adresa:   this.form.value.adresa,
        grad:     this.form.value.grad,
        postBroj: this.form.value.postBroj,
        nacin:    this.form.value.dostava,
      },
      placanje:   this.form.value.placanje,
      napomena:   this.form.value.napomena || null,
      stavke: this.cart.items().map(item => ({
        productId: item.product.id,
        naziv:     item.product.title,
        kolicina:  item.quantity,
        cena:      item.product.price,
      })),
      ukupnoBezPdv: this.cart.totalPrice(),
      pdv:          this.cart.totalPrice() * 0.2,
      ukupnoSaPdv:  this.cart.totalPrice() * 1.2,
    };

    this.http.post(`${this.API_URL}/porudzbine`, payload).subscribe({
      next: () => {
        this.orderLoading.set(false);
        this.orderDone.set(true);
        setTimeout(() => {
          this.cart.clear();
          this.router.navigate(['/']);
        }, 3500);
      },
      error: () => {
        this.orderLoading.set(false);
        this.errorMessage = "Došlo je do greške pokušajte ponovo kasnije."
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3500);
      }
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && (c.dirty || this.submitted));
  }

  get dostavaValue() {
    return this.form.get('dostava')?.value;
  }

  get placeValue() {
    return this.form.get('placanje')?.value;
  }
}