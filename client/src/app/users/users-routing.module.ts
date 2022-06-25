import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { LoggedUserDetailComponent } from './logged-user-detail/logged-user-detail.component';
import { UserAddEditComponent } from './user-add-edit/user-add-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/user-details', pathMatch: 'full' },
  { path: 'user-details', component: LoggedUserDetailComponent },
  { path: 'user/:id', component: UserAddEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
