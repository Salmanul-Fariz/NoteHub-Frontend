import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  Form,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  usernameStructure = false;
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
      userName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)],
      }),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    // Particle JS
    this.invokeParticles();
  }

  // Check user name exist
  checkUserExit(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.usernameStructure = false;
    if (value.length >= 4) {
      // Check user name have space or ..
      const output = [];

      for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);
        if ((code > 47 && code < 58) || (code > 96 && code < 122)) {
          if (code !== 32) {
            output.push(code);
          }
        }
      }
      if (output.length === value.length) {
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
      } else {
        this.usernameStructure = true;
      }
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
