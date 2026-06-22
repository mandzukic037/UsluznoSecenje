import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface GalleryItem {
  id: number;
  image: string;
  title: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private apiUrl = environment.apiUrl + '/api/gallery';

  constructor(private http: HttpClient) {}

  getItems(): Observable<GalleryItem[]> {
    return this.http.get<GalleryItem[]>(this.apiUrl).pipe(
      map(items => items.map(item => ({
        ...item,
        image: environment.apiUrl + item.image
      })))
    );
  }
}