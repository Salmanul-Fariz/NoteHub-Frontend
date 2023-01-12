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
      this.isLoading = true;
      this.isUsernameExist = false;

      this.authService.checkUsernameExist(value).subscribe((responce) => {
        setTimeout(() => {
          this.isLoading = false;
          if (responce.data) {
            this.isUsernameExist = true;
          }
        }, 300);
      });
    }
  }

  // Form Submittion
  submit(formData: any) {
    this.isLoading = true;
    this.authService.signup(formData).subscribe((response) => {
      this.isLoading = false;
      // Check Validation
      if (response.status === 'Email-Error') {
        this.authEmailFail = true;
      } else if (response.status === 'Email-exist-Error') {
        this.authEmailExist = true;
      } else {
        // Register Success
        localStorage.setItem('jwt', response.data.token);

        this.router.navigate(['/']);
      }

      // Remove the Validation Message From template
      setTimeout(() => {
        this.authEmailFail = false;
        this.authEmailExist = false;
      }, 2500);
    });
  }

  // Particle JS
  invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig);
  }
}
