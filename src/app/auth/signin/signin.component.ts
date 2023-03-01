import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  hide = true;
  isLoading = false;
  passwordErr = false;
  userOrMailErr = false;
  googleServise = false;
  googleEmailExist = false;
  signinForm: FormGroup;
  googleSubscription: Subscription;

  constructor(
    private socialService: SocialAuthService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Form Setup
    this.signinForm = new FormGroup({
      usernameOrEmail: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)],
      }),
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
                this.isLoading = false;
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

  // Submit Form
  submit(formData: any) {
    this.isLoading = true;

    this.authService.signin(formData).subscribe({
      next: (response) => {
        if (response.status === 'Password-Error') {
          this.passwordErr = true;
        } else if (response.status === 'Username-Or-Email') {
          this.userOrMailErr = true;
        } else {
          this.isLoading = false;

          // Signin Success
          localStorage.setItem('jwt', response.data.token);
          this.router.navigate(['/']);
        }

        // Remove the Validation Message From template
        setTimeout(() => {
          this.passwordErr = false;
          this.userOrMailErr = false;
        }, 1500);
      },
    });
  }
}
