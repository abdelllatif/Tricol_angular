import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../../services/produit.service';
import { CategorieService } from '../../../services/categorie.service';
import { Produit } from '../../../models/produit';
import { Categorie } from '../../../models/categorie';
import { ProduitModalComponent } from './produit-modal/produit-modal.component';
import { AjustementModalComponent } from './ajustement-modal/ajustement-modal.component';
import { MouvementStockDTO } from '../../../models/mouvement-stock';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, FormsModule, ProduitModalComponent, AjustementModalComponent],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];
  totalElements = 0;
  totalPages = 1;
  totalStock = 0;
  page = 1;
  pageSize = 5; // default
  pageSizes = [5, 10, 15, 20];  searchTerm = '';
  sortKey: keyof Produit | 'categorie.nom' = 'nom';
  sortOrder: 'asc' | 'desc' = 'asc';
  loading = false;
  errorMessage = '';

  showModal = false;
  showAjustementModal = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  selectedProduit: Produit = { nom: '', prixUnitaire: 0, stockActuel: 0 };

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.loading = true;
    this.produitService.getAllPaged(this.page, this.pageSize, this.sortKey as string, this.sortOrder, this.searchTerm)
      .subscribe({
        next: (res) => {
          this.produits = res.content;
          this.totalPages = res.totalPages;
          this.totalElements = res.totalElements;
          this.totalStock = this.produits.reduce((sum, p) => sum + p.stockActuel, 0);
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Erreur de chargement';
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.page = 1;
    this.loadProduits();
  }

  sort(key: keyof Produit | 'categorie.nom'): void {
    this.sortKey = key;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.loadProduits();
  }

  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages && p !== this.page) {
      this.page = p;
      this.loadProduits();
    }
  }

  openModal(produit: Produit | null, mode: 'create' | 'edit' | 'view'): void {
    this.selectedProduit = produit ? { ...produit } : {
      nom: '', prixUnitaire: 0, stockActuel: 0, description: '', categorie: undefined
    };
    this.modalMode = mode;
    this.showModal = true;
  }

  openAjustementModal(produit: Produit): void {
    this.selectedProduit = { ...produit };
    this.showAjustementModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.showAjustementModal = false;
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  // 🔥 MÉTHODE CORRIGÉE – REÇOIT produit + prixAchat 🔥
  saveProduit(event: { produit: Produit; prixAchat?: number }): void {
    const { produit, prixAchat } = event;

    const observable = this.modalMode === 'create'
      ? this.produitService.createWithPrixAchat(produit, prixAchat || 0)
      : this.produitService.update(produit.id!, produit);

    observable.subscribe({
      next: () => {
        this.loadProduits();
        this.closeModal();
      },
      error: () => alert('Erreur sauvegarde')
    });
  }

  ajusterStock(ajustement: any): void {
    const dto: MouvementStockDTO = {
      quantite: ajustement.quantite,
      produitId: ajustement.produitId,
      typeMouvement: ajustement.typeMouvement,
      motif: ajustement.motif || 'Ajustement manuel',
      coutUnitaire: ajustement.coutUnitaire
    };

    this.produitService.ajusterStock(ajustement.produitId, dto).subscribe({
      next: () => {
        this.loadProduits();
        this.closeModal();
        alert('Stock ajusté !');
      },
      error: (err) => alert('Erreur : ' + (err.error?.message || 'Serveur indisponible'))
    });
  }
  onPageSizeChange(): void {
    this.page = 1; // reset to first page
    this.loadProduits();
  }
  deleteProduit(produit: Produit): void {
    if (confirm(`Supprimer "${produit.nom}" ?`)) {
      this.produitService.delete(produit.id!).subscribe({
        next: () => this.loadProduits(),
        error: () => alert('Erreur suppression')
      });
    }
  }
}
