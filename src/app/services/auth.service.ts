import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { IUser, IUserLogin } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<IUser>(<IUser>{});

  constructor(private http: HttpClient) { }

  isAuthorized() {
    return !!localStorage.getItem('token');
  }

  authorize(userLogin: IUserLogin) {
    this.logout();

    return this.http
      .post(`${environment.apiUrl}/api/token/token`, userLogin, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map(res => {
          const token = res && res['token'];
          if (token) {
            localStorage.setItem('token', token);
            return true;
          }

          return throwError('Unauthorized');
        }),
        switchMap(() => this.getUser())
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.user.next({} as IUser);
  }

  getToken(): string {
    return localStorage['token'];
  }

  getUser(): Observable<IUser> {
    return this.http.get<IUser>(`${environment.apiUrl}/api/account`)
      .pipe(tap(u => this.user.next(u)), catchError((err: HttpErrorResponse) => {

        return throwError(err.statusText);
      }));
  }

  roleMatch(roles: string[]): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/api/account`, {roles});
  }
}
