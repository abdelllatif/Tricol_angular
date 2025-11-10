// src/app/dashboard/features/stock/mouvements.component.ts
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
  page = 0; // backend 0-indexed
  pageSize = 5;
  pageSizes = [5, 10, 15, 20];
  totalPages = 1;
  totalElements = 0;
  produitFilter = '';
  search = '';

  detailModalOpen = false;
  selectedMouvement: MouvementStockDTO | null = null;

  constructor(private mouvementService: MouvementService) {}

  ngOnInit(): void {
    this.loadMouvements();
  }

  loadMouvements(): void {
    this.mouvementService.getPaged(this.page, this.pageSize, this.search, this.produitFilter).subscribe({
      next: (res) => {
        this.mouvements = res.mouvements;
        this.filteredMouvements = [...this.mouvements];
        this.totalPages = res.totalPages;
        this.totalElements = res.totalItems;
      },
      error: (err) => console.error('Erreur chargement mouvements:', err)
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
      error: (err) => console.error('Erreur export Excel:', err)
    });
  }
}
