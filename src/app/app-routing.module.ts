import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerifyEmailGuard } from './guards/verifyEmail.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AdminAuthGuard } from './guards/adminAuth.guard';
import { AdminSigninGuard } from './guards/adminSignin.guard';
import { UserAutherizationGuard } from './guards/userAutherization.guard';

import { SignupComponent } from './user/auth/signup/signup.component';
import { HomeComponent } from './user/user-pages/home/home.component';
import { VerifyEmailComponent } from './user/auth/verify-email/verify-email.component';
import { SigninComponent } from './user/auth/signin/signin.component';
import { UserPagesComponent } from './user/user-pages/user-pages.component';
import { UserWorkspaceComponent } from './user/user-pages/user-workspace/user-workspace.component';
import { AuthComponent } from './user/auth/auth.component';

import { DashboardComponent } from './admin/admin-pages/dashboard/dashboard.component';
import { AdminPagesComponent } from './admin/admin-pages/admin-pages.component';
import { AuthAdminComponent } from './admin/auth/auth-admin.component';
import { AdminSigninComponent } from './admin/auth/admin-signin/admin-signin.component';

const appRoutes: Routes = [
  // user pages
  {
    path: '',
    children: [
      {
        path: '',
        component: UserPagesComponent,
        children: [
          { path: '', component: HomeComponent },
          {
            path: 'workspace/user-workspace',
            canActivate: [UserAutherizationGuard],
            component: UserWorkspaceComponent,
          },
        ],
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
        canActivate: [AdminAuthGuard],
        children: [
          {
            path: '',
            component: DashboardComponent,
          },
        ],
      },
      // Admin authentication
      {
        path: 'auth',
        component: AuthAdminComponent,
        canActivate: [AdminSigninGuard],
        children: [
          {
            path: 'signin',
            component: AdminSigninComponent,
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
