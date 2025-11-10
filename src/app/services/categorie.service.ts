import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorie } from '../models/categorie';

interface PageResponse {
  content: Categorie[];
  totalPages: number;
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private api = 'http://localhost:8080/categories';

  constructor(private http: HttpClient) {}

  getPaged(
    page: number,
    size = 20,
    sort = 'nom',
    dir: 'asc' | 'desc' = 'asc',
    search: string = ''
  ): Observable<PageResponse> {
    let params = new HttpParams()
      .set('page', (page - 1).toString())
      .set('size', size.toString())
      .set('sort', `${sort},${dir}`);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PageResponse>(`${this.api}/page`, { params });
  }

  create(c: Categorie): Observable<Categorie> { return this.http.post<Categorie>(this.api, c); }
  update(id: number, c: Categorie): Observable<Categorie> { return this.http.put<Categorie>(`${this.api}/${id}`, c); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}
