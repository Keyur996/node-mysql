import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
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

  isControlExist(control: string) {
    return !!this.basicForm.controls[control];
  }

  get children() {
    return this.basicForm.controls['children'] as FormArray;
  }

  addChild() {
    const childForm = this.fb.group({
      name: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
    });

    this.children.push(childForm);
  }

  deleteChild(index: number) {
    this.children.removeAt(index);
  }
}
