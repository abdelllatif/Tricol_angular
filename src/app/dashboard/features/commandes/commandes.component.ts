import { Component, OnInit } from '@angular/core';
import { CommandeService } from '../../../services/commande.service';
import { Commande } from '../../../models/commande';
import { PagedResponse } from '../../../models/paged-response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommandeModalComponent } from './commande-modal/commande-modal.component';
import { CommandeDetailsComponent } from './commande-details/commande-details.component';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule, CommandeModalComponent, CommandeDetailsComponent],
  templateUrl: './commandes.component.html'
})
export class CommandesComponent implements OnInit {
  commandes: Commande[] = [];
  totalPages = 1;
  totalElements = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  statutFilter = '';
  loading = false;
  sumTotal = 0;

  showModal = false;
  modalCommandeId: number | null = null;
  showDetailsModal = false;
  selectedCommandeId: number | null = null;

  private searchSubject = new Subject<string>();

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.fetchCommandes();

    // Reactive search
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(term => {
        this.searchTerm = term;
        this.currentPage = 1;
        this.fetchCommandes();
      });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.fetchCommandes();
  }


  fetchCommandes(): void {
    this.loading = true;
    this.commandeService.getPagedCommandes(this.currentPage, this.pageSize, this.searchTerm, this.statutFilter)
      .subscribe({
        next: res => {
          this.commandes = res.content;
          this.totalPages = res.totalPages;
          this.totalElements = res.totalElements;
          this.currentPage = res.number + 1;
          this.pageSize = res.size;
          this.sumTotal = this.commandes.reduce((sum, c) => sum + (c?.montantTotal ?? 0), 0);
          this.loading = false;
        },
        error: _ => { this.loading = false; }
      });
  }


  onFilterStatut(statut: string): void {
    this.statutFilter = statut;
    this.currentPage = 1;
    this.fetchCommandes();
  }


  // Pagination methods stay same...
  prevPage(): void { if (this.currentPage > 1) { this.currentPage--; this.fetchCommandes(); } }
  nextPage(): void { if (this.currentPage < this.totalPages) { this.currentPage++; this.fetchCommandes(); } }

  // Modal methods stay same...
  openCreateModal(): void { this.modalCommandeId = null; this.showModal = true; }
  openEditModal(id: number): void { this.modalCommandeId = id; this.showModal = true; }
  closeModal(refresh = false): void { this.showModal = false; if (refresh) this.fetchCommandes(); }
  openDetailsModal(id: number): void { this.selectedCommandeId = id; this.showDetailsModal = true; }
  closeDetailsModal(): void { this.showDetailsModal = false; this.selectedCommandeId = null; }

  deleteCommande(id: number): void {
    if (!confirm('Supprimer cette commande ?')) return;
    this.commandeService.deleteCommande(id).subscribe(() => this.fetchCommandes());
  }

  statusName(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'VALIDEE': return 'Validée';
      case 'LIVREE': return 'Livrée';
      case 'ANNULEE': return 'Annulée';
      default: return statut;
    }
  }

  statusClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'VALIDEE': return 'bg-blue-100 text-blue-800';
      case 'LIVREE': return 'bg-green-100 text-green-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      default: return '';
    }
  }
}
