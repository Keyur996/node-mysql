import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isisAuthenticated: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isisAuthenticated = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe({
      next: (isAuthenticated: boolean) => {
        this.isisAuthenticated = isAuthenticated;
      },
    });
  }

  onLogOut(): void {
    this.authService.logout();
  }
}
