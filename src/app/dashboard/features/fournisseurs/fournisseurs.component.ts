import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FournisseurModalComponent } from './fournisseur-modal/fournisseur-modal.component';
import { FournisseurService } from '../../../services/fournisseur.service';
import { Fournisseur } from '../../../models/fournisseur';

type SortKey = keyof Omit<Fournisseur, 'id'>;

@Component({
  selector: 'app-fournisseurs',
  standalone: true,
  imports: [CommonModule, FormsModule, FournisseurModalComponent],
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.css']
})
export class FournisseursComponent implements OnInit {
  showModal = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedFournisseur: Fournisseur = {
    societe: '', adresse: '', contact: '', email: '', telephone: '', ville: '', ice: ''
  };

  searchTerm = '';
  page = 1;
  pageSize = 5; // default
  pageSizes = [5, 10, 15, 20]; // selectable options
  totalPages = 1;
  totalElements = 0;
  sortKey: SortKey = 'societe';
  sortOrder: 'asc' | 'desc' = 'asc';

  fournisseurs: Fournisseur[] = [];
  loading = false;
  errorMessage = '';

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  // Load fournisseurs from backend
  loadFournisseurs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.fournisseurService.getAllPaged(
      this.page,
      this.pageSize,
      this.sortKey,
      this.sortOrder,
      this.searchTerm
    ).subscribe({
      next: (res) => {
        this.fournisseurs = res.content || [];
        this.totalPages = res.totalPages || 1;
        this.totalElements = res.totalElements || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur API:', err);
        this.errorMessage = 'Impossible de charger les fournisseurs. Vérifie que le backend est lancé sur http://localhost:8080';
        this.loading = false;
      }
    });
  }

  // Search handler
  onSearch(): void {
    this.page = 1;
    this.loadFournisseurs();
  }

  // Change page
  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages && p !== this.page) {
      this.page = p;
      this.loadFournisseurs();
    }
  }

  // Change page size
  onPageSizeChange(): void {
    this.page = 1; // reset to first page
    this.loadFournisseurs();
  }

  // Sort handler
  sort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }
    this.loadFournisseurs();
  }

  // Getter for page numbers
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Open modal (add / edit / view)
  openModal(f: Fournisseur | null, mode: 'add' | 'edit' | 'view' = 'add'): void {
    this.selectedFournisseur = f ? { ...f } : {
      societe: '', adresse: '', contact: '', email: '', telephone: '', ville: '', ice: ''
    };
    this.modalMode = mode;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  // Save fournisseur (add or edit)
  saveFournisseur(data: Fournisseur): void {
    this.loading = true;
    const req = this.modalMode === 'add'
      ? this.fournisseurService.create(data)
      : this.fournisseurService.update(data.id!, data);

    req.subscribe({
      next: () => {
        this.loadFournisseurs();
        this.closeModal();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Erreur sauvegarde');
      }
    });
  }
  truncate(text: string, maxLength: number = 28): string {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }
  // Delete fournisseur
  deleteFournisseur(f: Fournisseur): void {
    if (confirm(`Supprimer ${f.societe} ?`)) {
      this.loading = true;
      this.fournisseurService.delete(f.id!).subscribe({
        next: () => {
          this.loadFournisseurs();
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }
}
