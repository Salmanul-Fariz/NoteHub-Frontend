import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerifyEmailGuard } from './guards/verifyEmail.guard';
import { SignupComponent } from './user/auth/signup/signup.component';
import { HomeComponent } from './user/home/home.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { VerifyEmailComponent } from './user/auth/verify-email/verify-email.component';
import { SigninComponent } from './user/auth/signin/signin.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'auth/signup',
    component: SignupComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'auth/signin',
    component: SigninComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'auth/verify',
    component: VerifyEmailComponent,
    canActivate: [VerifyEmailGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
