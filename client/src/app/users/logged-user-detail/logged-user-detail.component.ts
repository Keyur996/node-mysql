import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/models/signup-user.model';

@Component({
  selector: 'loggedin-user-detail',
  templateUrl: './logged-user-detail.component.html',
  styleUrls: ['./logged-user-detail.component.scss'],
})
export class LoggedUserDetailComponent implements OnInit {
  loggedInuser!: User | null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loggedInuser = this.authService.getUser()
      ? new User(this.authService.getUser())
      : null;
  }

  onEdit(user: User) {
    this.router.navigate([`/user/${user.id}`]);
  }
}
