import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { CarouselComponent } from "../carousel-component/carousel-component";
import { FooterComponent } from '../footer-component/footer-component';



@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [RouterLink, RouterModule, NavbarComponent, CarouselComponent, FooterComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('bgVideo') video!: ElementRef<HTMLVideoElement>;
  private router = inject(Router);

  NavigatePage(page: string) {
    this.router.navigate([page]);
  }

   ngAfterViewInit() {
    const v = this.video.nativeElement;

    v.muted = true;
    v.currentTime = 0;

    const tryPlay = () => {
      v.play()
        .then(() => console.log('VIDEO PLAYING'))
        .catch(() => setTimeout(tryPlay, 200));
    };

    setTimeout(tryPlay, 100);
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}