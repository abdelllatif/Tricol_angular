import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produit } from '../../../../models/produit';
import { MouvementStockDTO } from '../../../../models/mouvement-stock';

@Component({
  selector: 'app-ajustement-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajustement-modal.component.html'
})
export class AjustementModalComponent implements OnChanges {
  @Input() produit!: Produit;
  @Output() close = new EventEmitter<void>();
  @Output() ajuster = new EventEmitter<any>();

  ajustementData: MouvementStockDTO = {
    produitId:this.produit.id!,
    quantite: 1,
    typeMouvement: 'ENTREE'
  };

  ngOnChanges() {
    this.ajustementData = {
      produitId:this.produit.id!,
      quantite: 1,
      typeMouvement: 'ENTREE'
    };
  }

  onSubmit(): void {
    this.ajuster.emit({
      ...this.ajustementData
    });
  }
}
