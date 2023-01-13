import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { VerifyEmailGuard } from './guards/verifyEmail.guard';
import { AuthenticationGuard } from './guards/authentication.guard';

import { HeaderComponent } from './user/user-pages/header/header.component';
import { FooterComponent } from './user/footer/footer.component';
import { HomeComponent } from './user/user-pages/home/home.component';
import { SignupComponent } from './user/auth/signup/signup.component';
import { SigninComponent } from './user/auth/signin/signin.component';
import { VerifyEmailComponent } from './user/auth/verify-email/verify-email.component';
import { UserPagesComponent } from './user/user-pages/user-pages.component';
import { AuthComponent } from './user/auth/auth.component';

import { AdminPagesComponent } from './admin/admin-pages/admin-pages.component';
import { DashboardComponent } from './admin/admin-pages/dashboard/dashboard.component';
import { AuthAdminComponent } from './admin/auth/auth-admin.component';
import { AdminSigninComponent } from './admin/auth/admin-signin/admin-signin.component';
import { AdminAuthGuard } from './guards/adminAuth.guard';
import { AdminSigninGuard } from './guards/adminSignin.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SignupComponent,
    SigninComponent,
    VerifyEmailComponent,
    DashboardComponent,
    AuthAdminComponent,
    UserPagesComponent,
    AdminPagesComponent,
    AuthComponent,
    AdminSigninComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatMenuModule,
  ],
  providers: [
    VerifyEmailGuard,
    AuthenticationGuard,
    AdminAuthGuard,
    AdminSigninGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
