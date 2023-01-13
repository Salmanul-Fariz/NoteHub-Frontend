import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../service/authentication.service';
import { ParticlesConfig } from './../../../../assets/particleJS/particles.config';

declare let particlesJS: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  isLoading = false;
  passwordErr = false;
  userOrMailErr = false;

  constructor(
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

    // Particle JS
    this.invokeParticles();
  }

  // Submit Form
  submit(formData: any) {
    this.isLoading = true;

    this.authService.signin(formData).subscribe(
      (response) => {
        setTimeout(() => {
          this.isLoading = false;

          // Signin Success
          localStorage.setItem('jwt', response.data.token);
          this.router.navigate(['/']);
        }, 1500);
      },
      (error) => {
        setTimeout(() => {
          this.isLoading = false;
          if (error.error.status === 'Password-Error') {
            this.passwordErr = true;
          } else if (error.error.status === 'Username-Or-Email') {
            this.userOrMailErr = true;
          }
        }, 1500);
      }
    );
    // Remove the Validation Message From template
    setTimeout(() => {
      this.passwordErr = false;
      this.userOrMailErr = false;
    }, 3500);
  }

  // Particle JS
  invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig);
  }
}
