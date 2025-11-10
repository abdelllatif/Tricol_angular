import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Fournisseur } from '../../../../models/fournisseur';

@Component({
  selector: 'app-fournisseur-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournisseur-modal.component.html'
})
export class FournisseurModalComponent {
  @Input() fournisseur!: Fournisseur;
  @Input() mode!: 'add' | 'edit' | 'view';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Fournisseur>();

  onSave() {
    this.save.emit(this.fournisseur);
  }
}
