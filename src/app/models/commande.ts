import { Fournisseur } from './fournisseur';
import { CommandeProduit } from './commande-produit';

export type StatutCommande = 'EN_ATTENTE' | 'VALIDEE' | 'LIVREE' | 'ANNULEE';

export interface Commande {
  id?: number;
  fournisseur: Fournisseur;
  produits: CommandeProduit[];
  montantTotal: number;
  statut: StatutCommande;
  dateCommande: string;
}
