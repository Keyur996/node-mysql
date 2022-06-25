import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicUserDetailsComponent } from './basic-user-details/basic-user-details.component';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ErrorModule } from '../error/error.module';

@NgModule({
  declarations: [BasicUserDetailsComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [
    BasicUserDetailsComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    ErrorModule,
  ],
})
export class SharedModule {}
