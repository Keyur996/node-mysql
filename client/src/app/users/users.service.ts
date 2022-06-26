import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../auth/models/signup-user.model';

const BACKEND_URL = 'http://localhost:3000/api';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users: User[] = [];
  private usersChanged: BehaviorSubject<{ users: User[]; count: number }> =
    new BehaviorSubject<{ users: User[]; count: number }>({
      users: [],
      count: 0,
    });

  constructor(private http: HttpClient) {}

  getUserById(id: string) {
    return this.http.get<{ message: string; success: boolean; user: User }>(
      `${BACKEND_URL}/user/${id}`
    );
  }

  updateUser(user: Partial<User>) {
    return this.http.patch<{ success: boolean; user: User }>(
      `${BACKEND_URL}/user/${user.id}`,
      user
    );
  }

  getupdatedUsers() {
    return this.usersChanged.asObservable();
  }

  getUsers(page: number, size: number) {
    let params = undefined;
    if (page && size) {
      params = new HttpParams().set('page', page).set('size', size);
    }

    this.http
      .get<{ success: boolean; count: number; users: User[] }>(
        `${BACKEND_URL}/user`,
        { params: params }
      )
      .subscribe({
        next: (response) => {
          this.users = response.users;
          this.usersChanged.next({
            users: response.users,
            count: response.count,
          });
        },
      });
  }
}
