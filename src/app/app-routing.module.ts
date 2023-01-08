import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerifyEmailGuard } from './guards/verifyEmail-guard.service';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'auth/signup',
    component: SignupComponent,
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
