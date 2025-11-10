import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MouvementStockDTO } from '../models/mouvement-stock';

@Injectable({
  providedIn: 'root'
})
export class MouvementService {
  private apiUrl = 'http://localhost:8080/mouvements';

  constructor(private http: HttpClient) {}

  // 🔹 Tous les mouvements (non paginés)
  getAll(): Observable<MouvementStockDTO[]> {
    return this.http.get<MouvementStockDTO[]>(this.apiUrl);
  }

  // 🔹 Pagination + recherche
  getPaged(
    page: number,
    size: number,
    search: string = '',
    produitId: string = ''
  ): Observable<{
    mouvements: MouvementStockDTO[],
    currentPage: number,
    totalItems: number,
    totalPages: number
  }> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('search', search);

    let url = this.apiUrl + '/page';
    if (produitId) {
      url = `${this.apiUrl}/produit/${produitId}/page`;
      params = params.delete('search'); // pas de recherche globale pour produit
    }

    return this.http.get<{
      mouvements: MouvementStockDTO[],
      currentPage: number,
      totalItems: number,
      totalPages: number
    }>(url, { params });
  }

  // 🔹 Export Excel
  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
  }
}
