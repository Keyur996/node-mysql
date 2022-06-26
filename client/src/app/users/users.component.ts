import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/models/signup-user.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  private usersSub!: Subscription;
  isLoading: boolean = false;
  users: User[] = [];
  count = 0;
  size = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getUsers(this.currentPage, this.size);

    this.usersSub = this.userService.getupdatedUsers().subscribe({
      next: (res) => {
        this.users = res.users;
        this.count = res.count;
        this.isLoading = false;
      },
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.size = pageData.pageSize;
    this.userService.getUsers(this.currentPage, this.size);
  }

  onDelete(userId: number) {
    this.isLoading = true;
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        if (response.success) {
          const currentUser = this.authService.getUser()?.id == userId;
          if (currentUser) {
            return this.authService.logout();
          }
          this.userService.getUsers(this.currentPage, this.size);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }
}
