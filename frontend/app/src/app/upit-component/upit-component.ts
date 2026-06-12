import { Component, HostListener, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-upit',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './upit-component.html',
  styleUrl: './upit-component.css',
})
export class UpitComponent implements OnDestroy {

  private readonly API_URL = environment.apiUrl + '/api';

  opis: string = '';

  firstname = '';
  lastname = '';
  mail = '';
  telephone = '';
  usluga = '';

  selectedFiles: File[] = [];

  totalSize = 0;

  filePreviews: {
    name: string;
    type: string;
    url: string;
  }[] = [];

  successMessage = '';
  failMessage = '';
  loading = false;

  maxFiles = 5;
  fileSizeMessage = '';

  constructor(private http: HttpClient) {}

  // =========================
  // FILE HANDLING
  // =========================

  handleFiles(files: FileList) {
    const MAX_SIZE = 25 * 1024 * 1024;

    let currentTotalSize = this.selectedFiles.reduce((acc, file) => acc + file.size, 0);

    if (this.selectedFiles.length >= this.maxFiles) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (this.selectedFiles.length >= this.maxFiles) break;

      if (currentTotalSize + file.size > MAX_SIZE) {
        this.fileSizeMessage = 'Ukupna veličina fajlova ne smije preći 25MB';
        setTimeout(() => {
          this.fileSizeMessage = '';
        }, 3000);
        break;
      }

      this.selectedFiles.push(file);
      currentTotalSize += file.size;

      const isImage = file.type.startsWith('image/');

      this.filePreviews.push({
        name: file.name,
        type: file.type,
        url: isImage ? URL.createObjectURL(file) : ''
      });
    }

    this.totalSize = currentTotalSize;
  }

  onFilesSelected(event: any) {
    const files: FileList | null = event.target.files;
    if (!files) return;
    this.handleFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (!files) return;
    this.handleFiles(files);
  }

  removeFile(index: number) {
    if (this.filePreviews[index].url) {
      URL.revokeObjectURL(this.filePreviews[index].url);
    }
    this.selectedFiles.splice(index, 1);
    this.filePreviews.splice(index, 1);
    this.totalSize = this.selectedFiles.reduce((acc, f) => acc + f.size, 0);
  }

  // =========================
  // VALIDATION
  // =========================

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validatePhone(phone: string): boolean {
    return /^[0-9+ ]{6,15}$/.test(phone);
  }

  // =========================
  // SUBMIT
  // =========================

  sendUpit() {
    if (this.loading) return;

    const isValid =
      this.firstname.trim().length >= 2 &&
      this.lastname.trim().length >= 2 &&
      this.validateEmail(this.mail) &&
      this.validatePhone(this.telephone);

    if (!isValid) {
      this.failMessage = 'Upit nije poslat, proverite podatke.';
      setTimeout(() => {
        this.failMessage = '';
      }, 3000);
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('ime', this.firstname);
    formData.append('prezime', this.lastname);
    formData.append('mail', this.mail);
    formData.append('telefon', this.telephone);
    formData.append('usluga', this.usluga);
    formData.append('opis', this.opis);

    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    this.http.post(`${this.API_URL}/upit`, formData).subscribe({
      next: () => {
        this.resetForm();
        this.loading = false;
        this.successMessage = 'Upit je uspešno poslat!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: () => {
        this.loading = false;
        this.failMessage = 'Došlo je do greške. Pokušajte ponovo.';
        setTimeout(() => {
          this.failMessage = '';
        }, 3000);
      }
    });
  }

  private resetForm() {
    this.firstname = '';
    this.lastname = '';
    this.mail = '';
    this.telephone = '';
    this.opis = '';
    this.usluga = '';
    this.totalSize = 0;
    this.selectedFiles = [];
    this.filePreviews = [];
  }

  // =========================
  // CLEANUP
  // =========================

  ngOnDestroy() {
    this.filePreviews.forEach(f => {
      if (f.url) URL.revokeObjectURL(f.url);
    });
  }
}