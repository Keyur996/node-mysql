import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Child, User } from 'src/app/auth/models/signup-user.model';
import { UsersService } from '../users.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.scss'],
})
export class UserAddEditComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  private user!: User;
  private isLoggedInUser: boolean = false;
  private isAdmin: boolean = false;
  private updateUserSub!: Subscription;
  private uesrSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initUserForm();
    this.route.paramMap.subscribe({
      next: (params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          this.uesrSub = this.userService.getUserById(id).subscribe({
            next: (response) => {
              this.user = response.user;
              this.isLoggedInUser =
                response.user.id === this.authService.getUser()?.id;
              this.isAdmin = this.authService.getUser()?.role === 'Admin';
              if (this.isAdmin) {
                this.userForm.addControl(
                  'role',
                  new FormControl('', Validators.required)
                );
              }
              this.setFormValues(response.user, this.isLoggedInUser);
            },
          });
        }
      },
    });
  }

  initUserForm() {
    this.userForm = this.fb.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(null, Validators.required),
      children: this.fb.array([]),
    });
  }

  onSubmit(userForm: FormGroup) {
    if (userForm.invalid) {
      return;
    }

    const user: Partial<User> = { ...userForm.value, id: this.user.id };

    this.updateUserSub = this.userService.updateUser(user).subscribe({
      next: (response) => {
        this.user = response.user;
        if (this.isLoggedInUser) {
          this.authService.updateUser(this.user);
        }
      },
      complete: () => {
        this.router.navigate(['/user-details']);
      },
    });
  }

  setFormValues(user: User, isLoggedInUser: boolean = false) {
    const clonedUser: any = new User(user);

    delete clonedUser['password'];
    // Restrict user to edit own role;
    this.userForm.patchValue({
      ...clonedUser,
    });

    if (this.userForm?.controls?.['children'] && clonedUser?.children) {
      _.forEach(clonedUser?.children || [], (_child: Child) => {
        (this.userForm.get('children') as FormArray).push(
          this.fb.group({
            name: _child.name,
            age: _child.age,
          })
        );
      });
    }
  }

  ngOnDestroy(): void {
    this.uesrSub.unsubscribe();
    this.updateUserSub.unsubscribe();
  }
}
