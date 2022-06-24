import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth-data.model';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token!: string | null;
  private tokenTimer: any;
  private user!: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUser() {
    return this.user;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  logIn(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ success: boolean, token: string; expiresIn: number; user: any }>(
        BACKEND_URL + "/login",
        authData
      )
      .subscribe({
        next: response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.user = response.user;
            this.authStatusListener.next(true);
            const expirationDate = new Date(
              Date.now() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.user);
            this.router.navigate(["/"]);
          }
        }, 
        error: error => {
          this.authStatusListener.next(false);
        }
      }

      );
  }

  private setAuthTimer(duration: number) {
    console.log('Duration: ', duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, user: object) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("user", JSON.stringify(user));
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.user = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
    this.http.get<{ success: boolean}>(`${BACKEND_URL}/logout`).subscribe({
      next: ({ success }) => {
        console.log(success);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}