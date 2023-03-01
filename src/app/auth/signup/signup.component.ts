import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { AuthenticationService } from '../../service/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  hide = true;
  authEmailFail = false;
  authEmailExist = false;
  isLoading = false;
  isUserLoading = false;
  isUsernameExist = false;
  googleEmailExist = false;
  googleServise = false;
  googleSubscription: Subscription;
  signupForm: FormGroup;

  constructor(
    private socialService: SocialAuthService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Form Setup
    this.signupForm = new FormGroup({
      userName: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        this.authService.userNameValidator,
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        this.authService.validatePassword,
      ]),
    });

    // Sigin With google responce
    this.googleSubscription = this.socialService.authState.subscribe(
      (user: SocialUser) => {
        if (this.googleServise) {
          this.isLoading = true;
          this.authService.signinWithGoogle(user).subscribe({
            next: (response) => {
              if (response.status === 'Email-Error') {
                this.googleEmailExist = true;

                // Remove the Validation Message From template
                setTimeout(() => {
                  this.googleEmailExist = false;
                }, 1500);
              } else {
                // Register Success
                localStorage.setItem('jwt', response.data.token);

                this.router.navigate(['/']);
              }
              this.isLoading = false;
            },
          });
        }
      }
    );

    this.googleServise = true;
  }

  // Sigin With google
  signIn() {
    this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // Check user name exist
  checkUserExit(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    if (value.length >= 4) {
      this.isUserLoading = true;

      this.authService.checkUsernameExist(value).subscribe({
        next: (responce) => {
          if (responce.status === 'Fail') {
            setTimeout(() => {
              this.isUserLoading = false;
              this.isUsernameExist = true;
            }, 500);
          } else {
            setTimeout(() => {
              this.isUserLoading = false;
              this.isUsernameExist = false;
            }, 500);
          }
          this.isLoading = false;
        },
      });
    }
  }

  // Form Submittion
  submit(formData: any) {
    this.isLoading = true;

    this.authService.signup(formData).subscribe({
      next: (response) => {
        if (response.status === 'Email-Error') {
          this.authEmailFail = true;
        } else if (response.status === 'Email-exist-Error') {
          this.authEmailExist = true;
        } else {
          this.isLoading = false;
          // Register Success
          localStorage.setItem('jwt', response.data.token);

          this.router.navigate(['/']);
        }

        // Remove the Validation Message From template
        setTimeout(() => {
          this.authEmailFail = false;
          this.authEmailExist = false;
        }, 1500);
      },
    });
  }

  ngOnDestroy(): void {
    this.googleSubscription.unsubscribe();
  }
}
