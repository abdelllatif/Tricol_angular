import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // Login simulation
  login(data: { email: string; password: string }): Observable<User> {
    if (data.email === 'test@test.com' && data.password === '123456') {
      const user: User = { id: 1, name: 'Test User', email: data.email };
      return of(user).pipe(delay(1000)); // simulate server delay
    }
    return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
  }
}
