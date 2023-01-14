import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { AuthenticationService } from '../../../service/authentication.service';
import { ParticlesConfig } from './../../../../assets/particleJS/particles.config';
import { Observable, Subscription } from 'rxjs';

declare let particlesJS: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
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
    // Particle JS
    this.invokeParticles();

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
          this.authService.signinWithGoogle(user).subscribe(
            (response) => {
              setTimeout(() => {
                this.isLoading = false;
                // Register Success
                localStorage.setItem('jwt', response.data.token);

                this.router.navigate(['/']);
              }, 1500);
            },
            (error) => {
              setTimeout(() => {
                this.isLoading = false;
                if (error.status === 400) {
                  this.googleEmailExist = true;
                }
              }, 1500);
              // Remove the Validation Message From template
              setTimeout(() => {
                this.googleEmailExist = false;
              }, 2500);
            }
          );
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

      this.authService.checkUsernameExist(value).subscribe(
        (responce) => {
          setTimeout(() => {
            this.isUserLoading = false;
            this.isUsernameExist = false;
          }, 500);
        },
        (error) => {
          if (error.status === 400) {
            setTimeout(() => {
              this.isUserLoading = false;
              this.isUsernameExist = true;
            }, 500);
          }
        }
      );
    }
  }

  // Form Submittion
  submit(formData: any) {
    this.isLoading = true;

    this.authService.signup(formData).subscribe(
      (response) => {
        console.log(response);

        setTimeout(() => {
          this.isLoading = false;
          // Register Success
          localStorage.setItem('jwt', response.data.token);

          this.router.navigate(['/']);
        }, 1500);
      },
      (error) => {
        setTimeout(() => {
          this.isLoading = false;
          // Check Validation
          if (error.error.status === 'Email-Error') {
            this.authEmailFail = true;
          } else if (error.error.status === 'Email-exist-Error') {
            this.authEmailExist = true;
          }
        }, 1500);
      }
    );
    // Remove the Validation Message From template
    setTimeout(() => {
      this.authEmailFail = false;
      this.authEmailExist = false;
    }, 2500);
  }

  // Particle JS
  invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig);
  }

  ngOnDestroy(): void {
    this.googleSubscription.unsubscribe();
  }
}
