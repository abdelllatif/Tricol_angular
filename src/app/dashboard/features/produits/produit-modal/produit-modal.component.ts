import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produit } from '../../../../models/produit';
import { Categorie } from '../../../../models/categorie';
import { CategorieService } from '../../../../services/categorie.service';

@Component({
  selector: 'app-produit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produit-modal.component.html'
})
export class ProduitModalComponent implements OnInit, OnChanges {
  @Input() produit!: Produit;
  @Input() mode!: 'create' | 'edit' | 'view';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ produit: Produit; prixAchat?: number }>();

  selectedProduit: Produit = { ...this.produit };
  prixAchat: number = 0;

  searchCategorie: string = '';
  categories: Categorie[] = [];
  filteredCategories: Categorie[] = [];
  showDropdown = false;

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnChanges(): void {
    if (this.produit) {
      this.selectedProduit = { ...this.produit };
      // 🔹 Afficher la catégorie actuelle si on édite
      if (this.selectedProduit.categorie) {
        this.searchCategorie = this.selectedProduit.categorie.nom;
      }
    }
  }

  loadCategories(): void {
    this.categorieService.getPaged(1, 200).subscribe(res => {
      this.categories = res.content;
      this.filteredCategories = [...this.categories];

      // 🔹 Mettre à jour la catégorie affichée après le chargement
      if (this.selectedProduit?.categorie) {
        const cat = this.categories.find(c => c.id === this.selectedProduit.categorie?.id);
        if (cat) {
          this.selectedProduit.categorie = cat;
          this.searchCategorie = cat.nom;
        }
      }
    });
  }

  filterCategories(): void {
    const term = this.searchCategorie.toLowerCase().trim();

    // إذا ماكاينش بحث → نجيب جميع الكاتيجوريات
    if (!term) {
      this.categorieService.getPaged(1, 200).subscribe(res => {
        this.categories = res.content;
        this.filteredCategories = [...this.categories];
        this.showDropdown = true;
      });
      return;
    }

    // إلى كاين نص البحث → نطلب من الـbackend نتائج البحث
    this.categorieService.getPaged(1, 200, 'nom', 'asc', term).subscribe(res => {
      this.filteredCategories = res.content;
      this.showDropdown = true;
    });
  }

  selectCategorie(cat: Categorie): void {
    this.selectedProduit.categorie = cat;
    this.searchCategorie = cat.nom;
    this.showDropdown = false;
  }

  onSave(): void {
    if (!this.selectedProduit.categorie) {
      alert('Catégorie requise');
      return;
    }

    this.save.emit({
      produit: this.selectedProduit,
      prixAchat: this.mode === 'create' ? this.prixAchat : undefined
    });
  }
}
