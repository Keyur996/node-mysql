import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserAddEditComponent } from './users/user-add-edit/user-add-edit.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', redirectTo: '/user', pathMatch: 'full' },
  { path: 'user', component: UsersComponent },
  { path: 'user/:id', component: UserAddEditComponent },
  {
    path: 'auth',
    loadChildren: async () => (await import('./auth/auth.module')).AuthModule,
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
