import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { UserAddEditComponent } from './users/user-add-edit/user-add-edit.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { ErrorModule } from './error/error.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsersComponent,
    UserAddEditComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ErrorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
