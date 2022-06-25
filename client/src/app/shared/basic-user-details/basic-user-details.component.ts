import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-basic-user-details',
  templateUrl: './basic-user-details.component.html',
  styleUrls: ['./basic-user-details.component.scss'],
})
export class BasicUserDetailsComponent implements OnInit {
  @Input('form') basicForm!: FormGroup;
  roles: Array<string> = ['User', 'Admin', 'Manager'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
