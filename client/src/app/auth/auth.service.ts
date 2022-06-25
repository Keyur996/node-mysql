import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthData } from './models/auth-data.model';
import { SignupUser, User } from './models/signup-user.model';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token!: string | null;
  private tokenTimer: any;
  private user!: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

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

  signUp(user: SignupUser) {
    this.http
      .post<{
        success: boolean;
        token: string;
        expiresIn: number;
        user: User;
      }>(`${BACKEND_URL}/signup`, user)
      .subscribe({
        next: (response) => {
          this.afterAuth(response);
        },
        error: (err) => {
          this.authStatusListener.next(false);
        },
      });
  }

  afterAuth(data: {
    success: boolean;
    token: string;
    expiresIn: number;
    user: any;
  }) {
    const token = data.token;
    this.token = token;
    if (token) {
      const expiresInDuration = data.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.user = data.user;
      this.authStatusListener.next(true);
      const expirationDate = new Date(Date.now() + expiresInDuration * 1000);
      console.log(expirationDate);
      this.saveAuthData(token, expirationDate, this.user);
      this.router.navigate(['/']);
    }
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.user = authInformation.user;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logIn(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ success: boolean; token: string; expiresIn: number; user: any }>(
        `${BACKEND_URL}/login`,
        authData
      )
      .subscribe({
        next: (response) => {
          this.afterAuth(response);
        },
        error: (error) => {
          this.authStatusListener.next(false);
        },
      });
  }

  private setAuthTimer(duration: number) {
    console.log('Duration: ', duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, user: object) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('user');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const user = localStorage.getItem('user');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      user: user,
    };
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.user = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
    this.http.get<{ success: boolean }>(`${BACKEND_URL}/logout`).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
