import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/models/signup-user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isManager: boolean = false;
  private sub!: Subscription;
  private user!: User;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.isAuthenticated = this.authService.getIsAuth();
    this.isAdmin = this.user ? this.user.role === 'Admin' : false;
    this.isManager = this.user ? this.user.role === 'Manager' : false;
    this.sub = this.authService.getAuthStatusListener().subscribe({
      next: (isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.isAdmin = (this.authService.getUser() as User).role === 'Admin';
          this.isManager =
            (this.authService.getUser() as User).role === 'Manager';
        }
        this.isAuthenticated = isAuthenticated;
      },
    });
  }

  onLogOut(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
