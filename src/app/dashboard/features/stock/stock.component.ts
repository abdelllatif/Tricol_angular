import { Component, OnInit } from '@angular/core';
import { MouvementService } from '../../../services/MouvementService';
import { MouvementStockDTO } from '../../../models/mouvement-stock';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mouvements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class MouvementsComponent implements OnInit {
  mouvements: MouvementStockDTO[] = [];
  filteredMouvements: MouvementStockDTO[] = [];

  // 🔹 Pagination
  page = 0;
  pageSize = 5;
  pageSizes = [5, 10, 15, 20];
  totalPages = 1;
  totalElements = 0;

  // 🔹 Filtres
  produitFilter = '';
  search = '';
  dateOfFilter = '';

  // 🔹 Modal détails
  detailModalOpen = false;
  selectedMouvement: MouvementStockDTO | null = null;

  constructor(private mouvementService: MouvementService) {}

  ngOnInit(): void {
    this.loadMouvements();
  }

  loadMouvements(): void {
    console.log('📤 Loading mouvements with filters:');
    console.log('🔸 page:', this.page, 'size:', this.pageSize, 'search:', this.search, 'produitFilter:', this.produitFilter, 'dateOfFilter:', this.dateOfFilter);

    this.mouvementService.getPaged(this.page, this.pageSize, this.search, this.produitFilter, this.dateOfFilter)
      .subscribe({
        next: (res) => {
          console.log('📥 Backend response:', res);
          this.mouvements = res.mouvements.map(m => ({
            ...m,
            dateMouvement: m.dateMouvement ? new Date(m.dateMouvement) : undefined
          }));
          this.filteredMouvements = [...this.mouvements];
          this.totalPages = res.totalPages || 1;
          this.totalElements = res.totalItems || 0;
        },
        error: (err) => console.error('❌ Erreur chargement mouvements:', err)
      });
  }

  applyFilters(): void {
    this.page = 0;
    this.loadMouvements();
  }

  goToPage(p: number): void {
    if (p >= 0 && p < this.totalPages && p !== this.page) {
      this.page = p;
      this.loadMouvements();
    }
  }

  onPageSizeChange(): void {
    this.page = 0;
    this.loadMouvements();
  }

  showMouvementDetails(m: MouvementStockDTO): void {
    this.selectedMouvement = m;
    this.detailModalOpen = true;
  }

  closeDetailsModal(): void {
    this.detailModalOpen = false;
    this.selectedMouvement = null;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  exportExcel(): void {
    this.mouvementService.exportExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mouvements-stock.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('❌ Erreur export Excel:', err)
    });
  }
}
