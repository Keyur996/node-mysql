import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { UniqueEmailValidator } from 'src/app/shared/validators/unique-email.validator';
import { UsersService } from 'src/app/users/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  authStatusSub!: Subscription;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.initSignUpForm();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  initSignUpForm() {
    this.signUpForm = this.fb.group({
      name: new FormControl('', Validators.required),
      email: new FormControl(
        '',
        [Validators.required, Validators.email],
        [UniqueEmailValidator.uniqueEmailValidator(this.userService)]
      ),
      phone: new FormControl(null, Validators.required),
      password: new FormControl('', Validators.required),
      role: new FormControl('User', Validators.required),
    });
  }

  onSignUp(signUpForm: FormGroup) {
    if (signUpForm.invalid) {
      return;
    }

    this.authService.signUp(signUpForm.value);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
