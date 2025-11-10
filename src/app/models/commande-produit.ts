import { Produit } from './produit';

export interface CommandeProduit {
  produit: Produit;
  quantite: number;
}
