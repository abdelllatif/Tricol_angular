import { CommandeService } from '../../../../services/commande.service';
import { Commande } from '../../../../models/commande';
import { Fournisseur } from '../../../../models/fournisseur';
import { Produit } from '../../../../models/produit';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commande-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-modal.component.html'
})
export class CommandeModalComponent implements OnChanges {
  @Input() commandeId: number | null = null; // null = new
  @Output() close = new EventEmitter<boolean>();

  commande: Commande = {
    fournisseur: {} as Fournisseur,
    produits: [],
    montantTotal: 0,
    statut: 'EN_ATTENTE',
    dateCommande: ''
  };
  fournisseurs: Fournisseur[] = [];
  produits: Produit[] = [];
  loading = false;
  saving = false;
  error = '';
  mode: 'create' | 'edit' = 'create';

  constructor(private commandeService: CommandeService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['commandeId']) {
      this.reset();
      if (this.commandeId) {
        this.mode = 'edit';
        this.fetchCommande(this.commandeId);
      } else {
        this.mode = 'create';
      }
      this.fetchFournisseurs();
      this.fetchProduits();
    }
  }

  reset() {
    this.error = '';
    this.loading = false;
    this.saving = false;
    this.commande = {
      fournisseur: {} as Fournisseur,
      produits: [],
      montantTotal: 0,
      statut: 'EN_ATTENTE',
      dateCommande: ''
    };
  }

  fetchCommande(id: number) {
    this.loading = true;
    this.commandeService.getCommandeById(id).subscribe({
      next: c => {
        this.commande = { ...c };
        this.loading = false;
      },
      error: _ => {
        this.error = "Erreur lors du chargement de la commande.";
        this.loading = false;
      }
    });
  }

  fetchFournisseurs() {
    this.commandeService.getFournisseurs().subscribe(res => this.fournisseurs = res);
  }
  fetchProduits() {
    this.commandeService.getProduits().subscribe(res => this.produits = res);
  }

  addProduit() {
    this.commande.produits.push({ produit: {} as Produit, quantite: 1 });
  }

  removeProduit(idx: number) {
    this.commande.produits.splice(idx, 1);
    this.updateMontantTotal();
  }

  updateProduit(idx: number) {
    // When produit or quantite changes recalc total
    this.updateMontantTotal();
  }

  updateMontantTotal() {
    this.commande.montantTotal = this.commande.produits.reduce((sum, cp) =>
        sum + ((cp.produit?.prixUnitaire ?? 0) * (cp.quantite ?? 1))
      , 0);
  }

  save() {
    this.saving = true;
    this.error = '';
    // Correct format! Send fournisseur as id or object...
    const dto = {
      ...this.commande,
      fournisseurId: this.commande.fournisseur?.id,
      produits: this.commande.produits.map(cp => ({
        produitId: cp.produit?.id,
        quantite: cp.quantite
      })),
      statut: this.commande.statut
    };
    if (this.mode === 'create') {
      this.commandeService.createCommande(dto as any).subscribe({
        next: _ => { this.close.emit(true); this.saving = false; },
        error: err => { this.saving = false; this.error = err.error?.message || 'Erreur lors de la création.'; }
      });
    } else if (this.mode === 'edit' && this.commandeId) {
      this.commandeService.updateCommande(this.commandeId, dto as any).subscribe({
        next: _ => { this.close.emit(true); this.saving = false; },
        error: err => { this.saving = false; this.error = err.error?.message || 'Erreur lors de la modification.'; }
      });
    }
  }

  closeModal() {
    this.close.emit(false);
  }

  produitSelectList() {
    return this.produits.filter(p =>
      !this.commande.produits.map(cp => cp.produit?.id).includes(p.id)
    );
  }
}
