import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { LoggedUserDetailComponent } from './logged-user-detail/logged-user-detail.component';
import { UserAddEditComponent } from './user-add-edit/user-add-edit.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
  { path: '', redirectTo: '/user-details', pathMatch: 'full' },
  { path: 'user-details', component: LoggedUserDetailComponent },
  {
    path: 'users-list',
    component: UsersComponent,
    canActivate: [RoleGuard],
    data: {
      role: ['Admin'],
    },
  },
  { path: 'user/:id', component: UserAddEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [RoleGuard],
})
export class UsersRoutingModule {}
