import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../models/commande';
import { Fournisseur } from '../models/fournisseur';
import { Produit } from '../models/produit';
import { PagedResponse } from '../models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8080/commandes';

  constructor(private http: HttpClient) {}

  getPagedCommandes(page: number, size: number, search: string = '', statut: string = ''): Observable<PagedResponse<Commande>> {
    let params = new HttpParams()
      .set('page', (page - 1).toString())
      .set('size', size.toString());
    if (search) params = params.set('search', search);
    if (statut) params = params.set('statut', statut);

    return this.http.get<PagedResponse<Commande>>(`${this.apiUrl}/page`, { params });
  }

  getFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`http://localhost:8080/fournisseurs`);
  }

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`http://localhost:8080/produits`);
  }

  createCommande(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, commande);
  }

  updateCommande(id: number, commande: Commande): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}`, commande);
  }
  getCommandeById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
