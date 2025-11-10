import { Categorie } from './categorie';

export interface StockCUMP {
  coutUnitaireCUMP: number;
}

export interface Produit {
  id?: number;
  nom: string;
  description?: string;
  categorie?: Categorie;
  prixUnitaire: number;
  stockActuel: number;
  stockCUMP?: StockCUMP;
}
