import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { RoleGuard } from './shared/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: async () =>
      (await import('./users/users.module')).UsersModule,
  },
  {
    path: 'auth',
    loadChildren: async () => (await import('./auth/auth.module')).AuthModule,
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [RoleGuard],
    data: {
      role: ['Admin', 'Manager'],
    },
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthGuard, RoleGuard],
})
export class AppRoutingModule {}
