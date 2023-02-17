import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared.module';
import { AuthRouting } from './auth.routing';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

import {
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [SharedModule, AuthRouting, SocialLoginModule],
  declarations: [SignupComponent, SigninComponent, VerifyEmailComponent],
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
  ],
  exports: [RouterModule],
})
export default class AuthModule {}
