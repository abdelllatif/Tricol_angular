import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fournisseur } from '../models/fournisseur';

interface PageResponse {
  content: Fournisseur[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private readonly apiUrl = 'http://localhost:8080/fournisseurs'; // ⚠️ Change si ton port est différent

  constructor(private http: HttpClient) {}

  getAllPaged(
    page: number,
    size: number,
    sortBy = 'societe',
    sortDir: 'asc' | 'desc' = 'asc',
    search = ''
  ): Observable<PageResponse> {
    let params = new HttpParams()
      .set('page', (page - 1).toString())
      .set('size', size.toString())
      .set('sort', `${sortBy},${sortDir}`);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PageResponse>(`${this.apiUrl}/page`, { params });
  }

  create(f: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.apiUrl, f);
  }

  update(id: number, f: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.apiUrl}/${id}`, f);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
