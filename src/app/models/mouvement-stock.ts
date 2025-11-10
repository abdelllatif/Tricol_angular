import { Produit } from './produit';

// 🔥🔥🔥 ENUM SYNCHRO BACKEND 🔥🔥🔥
export type TypeMouvement = 'ENTREE' | 'SORTIE' | 'AJUSTEMENT';

export interface MouvementStockDTO {
  quantite: number;
  produitId : number;
  typeMouvement: TypeMouvement;     // ← Nom EXACT du backend
  motif?: string;                    // Pour AJUSTEMENT manuel
  coutUnitaire?: number;             // Optionnel (pris du fournisseur ou CUMP)
  commandeId?: number;               // Si lié à une commande fournisseur
  dateMouvement?: string;
}
