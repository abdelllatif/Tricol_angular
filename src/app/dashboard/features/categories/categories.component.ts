import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategorieService } from '../../../services/categorie.service';
import { Categorie } from '../../../models/categorie';
import {Fournisseur} from '../../../models/fournisseur';
type SortKey = keyof Omit<Categorie, 'id'>;

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  categories: Categorie[] = [];
  searchTerm = '';
  page = 1;
  pageSize = 5; // default
  pageSizes = [5, 10, 15, 20]; // selectable options
  totalPages = 1;
  totalElements = 0;
  sortKey: SortKey = 'nom';
  sortOrder: 'asc' | 'desc' = 'asc';
  loading = false;
  error = '';

  showModal = false;
  mode: 'add' | 'edit' = 'add';

  // 🔥🔥🔥 INITIALISE À 0 🔥🔥🔥
  selected: Categorie = {
    nom: '',
    nombreProduits: 0   // ← Important pour le modal (évite undefined)
  };

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';

    this.categorieService
      .getPaged(this.page, this.pageSize, this.sortKey, this.sortOrder, this.searchTerm)
      .subscribe({
        next: (res) => {
          this.categories = res.content;
          this.totalElements = res.totalElements;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Impossible de charger les catégories';
          this.loading = false;
        }
    });
  }

  sort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }
    this.loadCategories();
  }
  openModal(c: Categorie | null, mode: 'add' | 'edit'): void {
    this.selected = c ? { ...c } : {
      nom: '',
      nombreProduits: 0
    };
    this.mode = mode;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  save(): void {
    this.loading = true;
    const req = this.mode === 'add'
      ? this.categorieService.create(this.selected)
      : this.categorieService.update(this.selected.id!, this.selected);

    req.subscribe({
      next: () => {
        this.loadCategories();
        this.closeModal();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Erreur sauvegarde');
      }
    });
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  delete(c: Categorie): void {
    if (confirm(`Supprimer la catégorie "${c.nom}" ? (Attention : les produits seront sans catégorie)`)) {
      this.categorieService.delete(c.id!).subscribe({
        next: () => this.loadCategories(),
        error: () => alert('Erreur suppression')
      });
    }
  }
  onSearch(): void {
    this.page = 1;
    this.loadCategories();
  }
  onPageSizeChange(): void {
    this.page = 1;
    this.loadCategories();
  }
  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages && p !== this.page) {
      this.page = p;
      this.loadCategories();
    }
  }
}
