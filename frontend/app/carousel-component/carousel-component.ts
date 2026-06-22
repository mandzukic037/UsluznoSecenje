import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  HostListener,
} from '@angular/core';

export interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
  tag?: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel-component.html',
  styleUrls: ['./carousel-component.css'],
})
export class CarouselComponent implements OnInit, OnDestroy {

  @Input() variant: 'left' | 'right' = 'left';

  @Input() autoplayInterval = 3000;

  private slidesLeft: CarouselSlide[] = [
    { image: 'sto1.png', title: 'Left 1', subtitle: 'opis' },
    { image: 'sto2.png', title: 'Left 2', subtitle: 'opis' },
    { image: 'sto3.png', title: 'Left 3', subtitle: 'opis' },
  ];

  private slidesRight: CarouselSlide[] = [
    { image: 'sto4.png', title: 'Right 1', subtitle: 'opis' },
    { image: 'sto5.png', title: 'Right 2', subtitle: 'opis' },
    { image: 'sto1.png', title: 'Right 3', subtitle: 'opis' },
  ];

  // aktivni niz
  slides: CarouselSlide[] = [];

  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';

  private autoplayTimer: any;
  private touchStartX = 0;

  ngOnInit(): void {
    this.slides = this.variant === 'left'
      ? this.slidesLeft
      : this.slidesRight;

    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }
  
  get previousIndex(): number {
    return (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  get nextIndex(): number {
    return (this.currentIndex + 1) % this.slides.length;
  }

  goTo(index: number): void {
    if (this.isAnimating || index === this.currentIndex) return;

    this.direction = index > this.currentIndex ? 'right' : 'left';
    this.animate(() => (this.currentIndex = index));
  }

  prev(): void {
    if (this.isAnimating) return;

    this.direction = 'left';
    this.animate(() => (this.currentIndex = this.previousIndex));
  }

  next(): void {
    if (this.isAnimating) return;

    this.direction = 'right';
    this.animate(() => (this.currentIndex = this.nextIndex));
  }

  // =====================
  // ANIMATION
  // =====================

  private animate(change: () => void): void {
    this.isAnimating = true;

    change();

    setTimeout(() => {
      this.isAnimating = false;
    }, 700);

    this.resetAutoplay();
  }

  // =====================
  // AUTOPLAY
  // =====================

  private startAutoplay(): void {
    this.autoplayTimer = setInterval(() => this.next(), this.autoplayInterval);
  }

  private stopAutoplay(): void {
    clearInterval(this.autoplayTimer);
  }

  private resetAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  // =====================
  // TOUCH
  // =====================

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent): void {
    const delta = this.touchStartX - e.changedTouches[0].clientX;

    if (Math.abs(delta) > 50) {
      delta > 0 ? this.next() : this.prev();
    }
  }

  // =====================
  // KEYBOARD
  // =====================

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft') this.prev();
    if (e.key === 'ArrowRight') this.next();
  }
}