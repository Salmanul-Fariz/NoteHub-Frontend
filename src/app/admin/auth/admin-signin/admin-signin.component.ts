import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

import { ParticlesConfig } from './../../../../assets/particleJS/particles.config';

declare let particlesJS: any;

@Component({
  selector: 'app-admin-signin',
  templateUrl: './admin-signin.component.html',
  styleUrls: ['./admin-signin.component.css'],
})
export class AdminSigninComponent implements OnInit {
  signinForm: FormGroup;
  isLoading = false;
  usernameErr = false;
  passwordErr = false;

  constructor(
    private authService: AuthenticationService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    // Particle JS
    this.invokeParticles();

    // Form Setup
    this.signinForm = new FormGroup({
      userName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)],
      }),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  submit(formData: any) {
    this.isLoading = true;

    this.adminService.signInPost(formData).subscribe(
      (response) => {
        setTimeout(() => {
          this.isLoading = false;

          // Signin Success
          localStorage.setItem('admin-jwt', response.data.token);
          this.router.navigate(['/admin']);
        }, 1500);
      },
      (err) => {
        console.log(err);
        setTimeout(() => {
          this.isLoading = false;
          if (err.error.status === 'Password-Error') {
            this.passwordErr = true;
          } else if (err.error.status === 'Username-Error') {
            this.usernameErr = true;
          }
        }, 1500);
      }
    );

    // Remove the Validation Message From template
    setTimeout(() => {
      this.passwordErr = false;
      this.usernameErr = false;
    }, 3500);
  }

  // Particle JS
  invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig);
  }
}
