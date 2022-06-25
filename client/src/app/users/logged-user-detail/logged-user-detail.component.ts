import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/models/signup-user.model';

@Component({
  selector: 'loggedin-user-detail',
  templateUrl: './logged-user-detail.component.html',
  styleUrls: ['./logged-user-detail.component.scss'],
})
export class LoggedUserDetailComponent implements OnInit {
  loggedInuser!: User;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedInuser = new User(
      JSON.parse(this.authService.getUser()) as User
    );
  }
}
