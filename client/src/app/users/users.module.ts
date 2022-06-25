import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LoggedUserDetailComponent } from './logged-user-detail/logged-user-detail.component';
import { UserAddEditComponent } from './user-add-edit/user-add-edit.component';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [
    LoggedUserDetailComponent,
    UsersComponent,
    UserAddEditComponent,
  ],
  imports: [CommonModule, UsersRoutingModule, SharedModule],
})
export class UsersModule {}
