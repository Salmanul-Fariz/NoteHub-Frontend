import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../service/authentication.service';
import { ParticlesConfig } from './../../../assets/particleJS/particles.config';

declare let particlesJS: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  authEmailFail = false;
  authEmailExist = false;
  isLoading = false;
  isUserLoading = false;
  isUsernameExist = false;
  signupForm: FormGroup;

  constructor(
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

    // Particle JS
    this.invokeParticles();
  }

  // Check user name exist
  checkUserExit(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    if (value.length >= 4) {
      this.isUserLoading = true;
      this.isUsernameExist = false;

      this.authService.checkUsernameExist(value).subscribe(
        (responce) => {
          this.isUserLoading = false;
        },
        (error) => {
          if (error.status === 400) {
            setTimeout(() => {
              this.isUserLoading = false;
              this.isUsernameExist = true;
            }, 300);
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
}
