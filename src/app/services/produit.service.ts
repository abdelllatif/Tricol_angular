import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/produit';

interface PageResponse {
  content: Produit[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface MouvementStockDTO {
  quantite: number;
  typeMouvement: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT';
  coutUnitaire?: number;
  motif?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private readonly apiUrl = 'http://localhost:8080/produits';

  constructor(private http: HttpClient) {}

  getAllPaged(
    page: number,
    size: number = 20,
    sortBy = 'nom',
    sortDir: 'asc' | 'desc' = 'asc',
    search = ''
  ): Observable<PageResponse> {
    let params = new HttpParams()
      .set('page', (page - 1).toString())
      .set('size', size.toString())
      .set('sort', `${sortBy},${sortDir}`);

    if (search.trim()) params = params.set('search', search.trim());

    return this.http.get<PageResponse>(`${this.apiUrl}/page`, { params });
  }

  // 🔥🔥🔥 NOUVELLE MÉTHODE POUR PRIX D'ACHAT 🔥🔥🔥
  createWithPrixAchat(produit: Produit, prixAchat: number): Observable<Produit> {
    return this.http.post<Produit>(`${this.apiUrl}?prixAchat=${prixAchat}`, produit);
  }

  create(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

  update(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  ajusterStock(id: number, dto: MouvementStockDTO): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}/ajuster-stock`, dto);
  }
}
