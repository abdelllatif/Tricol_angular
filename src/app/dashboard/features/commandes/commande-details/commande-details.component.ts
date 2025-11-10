import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeService } from '../../../../services/commande.service';
import { Commande } from '../../../../models/commande';

@Component({
  selector: 'app-commande-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commande-details.component.html'
})
export class CommandeDetailsComponent implements OnChanges {
  @Input() commandeId!: number;
  @Output() close = new EventEmitter<void>();
  commande?: Commande;
  loading = false;
  error = '';

  constructor(private commandeService: CommandeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['commandeId'] && this.commandeId) {
      this.fetchDetails();
    }
  }

  fetchDetails(): void {
    this.loading = true;
    this.commandeService.getCommandeById(this.commandeId).subscribe({
      next: res => {
        this.commande = res;
        this.loading = false;
      },
      error: _ => {
        this.error = 'Erreur lors du chargement de la commande.';
        this.loading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit();
  }
}
