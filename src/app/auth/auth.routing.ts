import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationGuard } from '../guards/authentication.guard';
import { VerifyEmailGuard } from '../guards/verifyEmail.guard';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouting {}
