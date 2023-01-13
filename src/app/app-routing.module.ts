import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerifyEmailGuard } from './guards/verifyEmail.guard';
import { SignupComponent } from './user/auth/signup/signup.component';
import { HomeComponent } from './user/user-pages/home/home.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { VerifyEmailComponent } from './user/auth/verify-email/verify-email.component';
import { SigninComponent } from './user/auth/signin/signin.component';

import { DashboardComponent } from './admin/admin-pages/dashboard/dashboard.component';
import { UserPagesComponent } from './user/user-pages/user-pages.component';
import { AdminPagesComponent } from './admin/admin-pages/admin-pages.component';
import { AuthComponent } from './user/auth/auth.component';

const appRoutes: Routes = [
  // user pages
  {
    path: '',
    children: [
      {
        path: '',
        component: UserPagesComponent,
        children: [{ path: '', component: HomeComponent }],
      },
      // User authentication
      {
        path: 'auth',
        component: AuthComponent,
        children: [
          {
            path: 'signup',
            component: SignupComponent,
            canActivate: [AuthenticationGuard],
          },
          {
            path: 'signin',
            component: SigninComponent,
            canActivate: [AuthenticationGuard],
          },
          {
            path: 'verify',
            component: VerifyEmailComponent,
            canActivate: [VerifyEmailGuard],
          },
        ],
      },
    ],
  },
  // Admin Pages
  {
    path: 'admin',
    children: [
      {
        path: '',
        component: AdminPagesComponent,
        children: [
          {
            path: '',
            component: DashboardComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
