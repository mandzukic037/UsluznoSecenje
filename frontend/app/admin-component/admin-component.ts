import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RouterModule } from '@angular/router';

type AdminTab = 'dashboard' | 'porudzbine' | 'proizvodi' | 'upiti' | 'statistike';

interface UpitFajl {
  id: number;
  naziv: string;
  putanja: string;
}

interface UpitItem {
  id: number;
  ime: string;
  prezime: string;
  mail: string;
  telefon: string;
  usluga: string;
  opis: string;
  procitan: boolean;
  kreiranoU: string;
  fajlovi?: UpitFajl[];
}

  interface ProductStats {
    prometPoProizvodu: Record<string, number>;
    kolicinaPoProizvodu: Record<string, number>;
    topKupci: Record<string, number>;
  }

interface Stavka {
  id: number;
  naziv: string;
  kolicina: number;
  cena: number;
  productId: number;
}

interface Porudzbina {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  firma?: string;
  pib?: string;
  adresa: string;
  grad: string;
  postBroj: string;
  nacinDostave: string;
  placanje: string;
  napomena?: string;
  ukupnoBezPdv: number;
  pdv: number;
  ukupnoSaPdv: number;
  status: string;
  kreiranoU: string;
  stavke: Stavka[];
}

interface Product {
  id?: number;
  title: string;
  category: string;
  price: number;
  image: string;
  description: string;
  material: string;
  thickness: string;
}

interface Stats {
  ukupnoPorudzbina: number;
  nove: number;
  uObradi: number;
  poslate: number;
  otkazane: number;
  ukupanPromet: number;
  ukupnoProizvoda: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-component.html',
  styleUrls: ['./admin-component.css']
})
export class AdminComponent implements OnInit {
  apiUrl = environment.apiUrl;

  private readonly API = environment.apiUrl + '/api/admin';

  // AUTH
  loggedIn = signal(false);
  loginPass = '';
  loginError = '';
  private readonly ADMIN_PASS = 'admin123';

  // TABS
  activeTab = signal<AdminTab>('dashboard');
  sidebarCollapsed = signal(false);

  // DATA
  stats = signal<Stats | null>(null);
  porudzbine = signal<Porudzbina[]>([]);
  proizvodi = signal<Product[]>([]);
  dataLoaded = signal(false);

  // PORUDZBINA DETALJI
  selectedPorudzbina = signal<Porudzbina | null>(null);

  // FILTER
  filterStatus = signal('SVE');
  searchText = signal('');

  // PRODUCT FORM
  showProductForm = signal(false);
  editingProduct = signal<Product | null>(null);
  productForm: Product = this.emptyProduct();

  // CONFIRM DELETE
  confirmDelete = signal<{ type: 'porudzbina' | 'product'; id: number; label: string } | null>(null);

  // TOAST
  successMsg = signal('');
  errorMsg = signal('');

  readonly statusi = ['NOVA', 'U_OBRADI', 'POSLATA', 'OTKAZANA'];
  readonly kategorije = ['Lasersko sečenje', 'CNC savijanje', 'Graviranje', 'CAD Design'];

  isImage(path: string): boolean {
    if (!path) return false;

    return /\.(jpg|jpeg|png|gif|webp)$/i.test(path);
  }

  // izveden grafik prometa po danu (poslednjih 14 dana sa porudžbinama)
  prometSeries = computed(() => {
    const map = new Map<string, number>();
    for (const p of this.porudzbine()) {
      if (p.status === 'OTKAZANA') continue;
      const d = new Date(p.kreiranoU);
      const key = d.toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit' });
      map.set(key, (map.get(key) ?? 0) + p.ukupnoSaPdv);
    }
    const entries = Array.from(map.entries()).slice(-10);
    const max = Math.max(1, ...entries.map(e => e[1]));
    return entries.map(([label, value]) => ({ label, value, pct: Math.round((value / max) * 100) }));
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const saved = sessionStorage.getItem('adminLoggedIn');
    if (saved === 'true') {
      this.loggedIn.set(true);
      this.loadAll();
    }
  }

  // =====================
  // AUTH
  // =====================

  login() {
    if (this.loginPass === this.ADMIN_PASS) {
      this.loggedIn.set(true);
      sessionStorage.setItem('adminLoggedIn', 'true');
      this.loadAll();
    } else {
      this.loginError = 'Pogrešna lozinka';
      setTimeout(() => this.loginError = '', 2200);
    }
  }

  logout() {
    this.loggedIn.set(false);
    sessionStorage.removeItem('adminLoggedIn');
    this.loginPass = '';
    this.dataLoaded.set(false);
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  // =====================
  // LOAD
  // =====================

  loadAll() {
    this.loadStats();
    this.loadPorudzbine();
    this.loadProizvodi();
    this.loadUpiti();
    this.loadProductStats();
    setTimeout(() => this.dataLoaded.set(true), 250);
  }

  loadStats() {
    this.http.get<Stats>(`${this.API}/stats`).subscribe({ next: s => this.stats.set(s) });
  }

  loadPorudzbine() {
    this.http.get<Porudzbina[]>(`${this.API}/porudzbine`).subscribe({ next: p => this.porudzbine.set(p) });
  }

  loadProizvodi() {
    this.http.get<Product[]>(`${this.API}/products`).subscribe({ next: p => this.proizvodi.set(p) });
  }

  // =====================
  // TABS
  // =====================

  setTab(tab: AdminTab) {
    this.activeTab.set(tab);
    this.selectedPorudzbina.set(null);
    this.clearSelection();
  }

  // =====================
  // PORUDZBINE
  // =====================

  get filteredPorudzbine(): Porudzbina[] {
    let list = this.porudzbine();
    if (this.filterStatus() !== 'SVE') {
      list = list.filter(p => p.status === this.filterStatus());
    }
    const s = this.searchText().toLowerCase().trim();
    if (s) {
      list = list.filter(p =>
        p.ime.toLowerCase().includes(s) ||
        p.prezime.toLowerCase().includes(s) ||
        p.email.toLowerCase().includes(s) ||
        String(p.id).includes(s)
      );
    }
    return list;
  }

  countByStatus(status: string): number {
    return this.porudzbine().filter(p => p.status === status).length;
  }

  selectPorudzbina(p: Porudzbina) {
    this.selectedPorudzbina.set(p);
  }

  closeDetalji() {
    this.selectedPorudzbina.set(null);
  }

  updateStatus(p: Porudzbina, status: string) {
    if (p.status === status) return;
    this.http.put(`${this.API}/porudzbine/${p.id}/status`, { status }).subscribe({
      next: () => {
        p.status = status;
        this.porudzbine.update(list => [...list]);
        if (this.selectedPorudzbina()?.id === p.id) {
          this.selectedPorudzbina.set({ ...p, status });
        }
        this.loadStats();
        this.showSuccess('Status ažuriran');
      },
      error: () => this.showError('Greška pri ažuriranju statusa')
    });
  }

  askDeletePorudzbina(p: Porudzbina) {
    this.confirmDelete.set({ type: 'porudzbina', id: p.id, label: `porudžbinu #${p.id}` });
  }

  // =====================
  // PROIZVODI
  // =====================

  openNewProduct() {
    this.productForm = this.emptyProduct();
    this.editingProduct.set(null);
    this.imagePreview.set(null);
    this.showProductForm.set(true);
  }

  openEditProduct(p: Product) {
    this.productForm = { ...p };
    this.editingProduct.set(p);
    this.imagePreview.set(p.image ? this.apiUrl + p.image : null);
    this.showProductForm.set(true);
  }

  closeProductForm() {
    this.showProductForm.set(false);
    this.editingProduct.set(null);
  }

  saveProduct() {
    if (!this.productForm.title.trim()) {
      this.showError('Naziv proizvoda je obavezan');
      return;
    }
    const editing = this.editingProduct();
    if (editing?.id) {
      this.http.put<Product>(`${this.API}/products/${editing.id}`, this.productForm).subscribe({
        next: updated => {
          this.proizvodi.update(list => list.map(p => p.id === updated.id ? updated : p));
          this.closeProductForm();
          this.loadStats();
          this.showSuccess('Proizvod ažuriran');
        }
      });
    } else {
      this.http.post<Product>(`${this.API}/products`, this.productForm).subscribe({
        next: created => {
          this.proizvodi.update(list => [...list, created]);
          this.closeProductForm();
          this.loadStats();
          this.showSuccess('Proizvod dodat');
        }
      });
    }
  }

  askDeleteProduct(p: Product) {
    this.confirmDelete.set({ type: 'product', id: p.id!, label: `"${p.title}"` });
  }

  // =====================
  // CONFIRM DELETE (zajednicko)
  // =====================

  cancelDelete() {
    this.confirmDelete.set(null);
  }

  confirmDeleteAction() {
    const c = this.confirmDelete();
    if (!c) return;

    if (c.type === 'porudzbina') {
      this.http.delete(`${this.API}/porudzbine/${c.id}`).subscribe({
        next: () => {
          this.porudzbine.update(list => list.filter(p => p.id !== c.id));
          if (this.selectedPorudzbina()?.id === c.id) this.closeDetalji();
          this.loadStats();
          this.showSuccess('Porudžbina obrisana');
        }
      });
    } else {
      this.http.delete(`${this.API}/products/${c.id}`).subscribe({
        next: () => {
          this.proizvodi.update(list => list.filter(p => p.id !== c.id));
          this.loadStats();
          this.showSuccess('Proizvod obrisan');
        }
      });
    }
    this.confirmDelete.set(null);
  }

  // =====================
  // HELPERS
  // =====================

  emptyProduct(): Product {
    return { title: '', category: 'Lasersko sečenje', price: 0, image: '', description: '', material: '', thickness: '' };
  }

  statusLabel(s: string): string {
    const map: Record<string, string> = { NOVA: 'Nova', U_OBRADI: 'U obradi', POSLATA: 'Poslata', OTKAZANA: 'Otkazana' };
    return map[s] ?? s;
  }

  statusColor(s: string): string {
    const map: Record<string, string> = { NOVA: '#3b82f6', U_OBRADI: '#f59e0b', POSLATA: '#16a34a', OTKAZANA: '#ef4444' };
    return map[s] ?? '#6B7280';
  }

  formatDate(d: string): string {
    if (!d) return '';
    return new Date(d).toLocaleString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  initials(ime: string, prezime: string): string {
    return `${ime?.[0] ?? ''}${prezime?.[0] ?? ''}`.toUpperCase();
  }

  showSuccess(msg: string) {
    this.successMsg.set(msg);
    setTimeout(() => this.successMsg.set(''), 2800);
  }

  showError(msg: string) {
    this.errorMsg.set(msg);
    setTimeout(() => this.errorMsg.set(''), 2800);
  }

  trackById(_: number, item: any) { return item.id; }

  uploadingImage = signal(false);
  uploadProgress = signal(0);
  imagePreview = signal<string | null>(null);

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showError('Dozvoljene su samo slike');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.showError('Slika je previše velika (max 10MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    this.uploadingImage.set(true);
    this.uploadProgress.set(0);

    this.http.post<{ path: string }>(`${this.API}/upload/image`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress.set(Math.round((100 * event.loaded) / event.total));
        } else if (event.type === HttpEventType.Response && event.body) {
          this.productForm.image = event.body.path;
          this.uploadingImage.set(false);
          this.showSuccess('Slika otpremljena');
        }
      },
      error: () => {
        this.uploadingImage.set(false);
        this.imagePreview.set(null);
        this.showError('Greška pri otpremanju slike');
      }
    });
  }

  removeImage() {
    this.productForm.image = '';
    this.imagePreview.set(null);
  }

  // signali
  upiti = signal<UpitItem[]>([]);
  productStats = signal<ProductStats | null>(null);
  selectedUpit = signal<UpitItem | null>(null);

  // bulk select za porudzbine
  selectedIds = signal<Set<number>>(new Set());
  bulkStatus = 'U_OBRADI';

  // nepročitani upiti broj
  nepotvrdjenihUpita = computed(() => this.upiti().filter(u => !u.procitan).length);
  // top proizvodi/kupci kao sortirana lista za prikaz
  topProizvodi = computed(() => {
    const stats = this.productStats();
    if (!stats) return [];
    return Object.entries(stats.prometPoProizvodu)
      .map(([naziv, promet]) => ({ naziv, promet, kolicina: stats.kolicinaPoProizvodu[naziv] ?? 0 }))
      .sort((a, b) => b.promet - a.promet)
      .slice(0, 8);
  });

  topKupciList = computed(() => {
    const stats = this.productStats();
    if (!stats) return [];
    return Object.entries(stats.topKupci)
      .map(([ime, promet]) => ({ ime, promet }))
      .sort((a, b) => b.promet - a.promet)
      .slice(0, 8);
  });

  maxProizvodPromet = computed(() => Math.max(1, ...this.topProizvodi().map(p => p.promet)));
  maxKupacPromet = computed(() => Math.max(1, ...this.topKupciList().map(k => k.promet)));

  // ucitavanje
  loadUpiti() {
    this.http.get<UpitItem[]>(`${this.API}/upiti`).subscribe({ next: u => this.upiti.set(u) });
  }

  loadProductStats() {
    this.http.get<ProductStats>(`${this.API}/product-stats`).subscribe({ next: s => this.productStats.set(s) });
  }

  // otvaranje upita - markira kao procitan
  openUpit(u: UpitItem) {
    this.selectedUpit.set(u);
    if (!u.procitan) {
      this.http.put(`${this.API}/upiti/${u.id}/procitan`, {}).subscribe({
        next: () => {
          u.procitan = true;
          this.upiti.update(list => [...list]);
        }
      });
    }
  }

  closeUpit() {
    this.selectedUpit.set(null);
  }

  deleteUpit(id: number) {
    if (!confirm('Obriši ovaj upit?')) return;
    this.http.delete(`${this.API}/upiti/${id}`).subscribe({
      next: () => {
        this.upiti.update(list => list.filter(u => u.id !== id));
        if (this.selectedUpit()?.id === id) this.closeUpit();
        this.showSuccess('Upit obrisan');
      }
    });
  }

  replyMailto(u: UpitItem): string {
    return `mailto:${u.mail}?subject=${encodeURIComponent('Re: Upit - ' + u.usluga)}`;
  }

  // bulk select
  toggleSelect(id: number) {
    this.selectedIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  toggleSelectAll() {
    const visible = this.filteredPorudzbine.map(p => p.id);
    const allSelected = visible.every(id => this.selectedIds().has(id));
    this.selectedIds.set(allSelected ? new Set() : new Set(visible));
  }

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  clearSelection() {
    this.selectedIds.set(new Set());
  }

  applyBulkStatus() {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;
    this.http.put(`${this.API}/porudzbine/bulk-status`, { ids, status: this.bulkStatus }).subscribe({
      next: () => {
        this.porudzbine.update(list => list.map(p => ids.includes(p.id) ? { ...p, status: this.bulkStatus } : p));
        this.clearSelection();
        this.loadStats();
        this.showSuccess(`Status promenjen za ${ids.length} porudžbina`);
      }
    });
  }

  // export CSV
  exportCSV() {
    const rows = this.filteredPorudzbine;
    const header = ['ID', 'Ime', 'Prezime', 'Email', 'Telefon', 'Grad', 'Iznos', 'Status', 'Datum'];
    const lines = rows.map(p => [
      p.id, p.ime, p.prezime, p.email, p.telefon, p.grad, p.ukupnoSaPdv, this.statusLabel(p.status), this.formatDate(p.kreiranoU)
    ].join(';'));
    const csv = [header.join(';'), ...lines].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `porudzbine_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // duplikat proizvoda
  duplicateProduct(p: Product) {
    const copy: Product = { ...p, title: p.title + ' (kopija)' };
    delete copy.id;
    this.http.post<Product>(`${this.API}/products`, copy).subscribe({
      next: created => {
        this.proizvodi.update(list => [...list, created]);
        this.loadStats();
        this.showSuccess('Proizvod dupliran');
      }
    });
  }

  allFilteredSelected(): boolean {
    const visible = this.filteredPorudzbine;
    return visible.length > 0 && visible.every(p => this.selectedIds().has(p.id));
  }

}