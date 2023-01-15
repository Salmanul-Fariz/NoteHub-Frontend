import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

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
import { UserWorkspaceComponent } from './user/user-pages/user-workspace/user-workspace.component';

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
    UserWorkspaceComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '806091553721-2f7tgpbm558v0968l1p5csr0065o9s9b.apps.googleusercontent.com'
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    VerifyEmailGuard,
    AuthenticationGuard,
    AdminAuthGuard,
    AdminSigninGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
