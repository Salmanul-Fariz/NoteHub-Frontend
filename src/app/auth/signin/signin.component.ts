import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { ParticlesConfig } from './../../../assets/particleJS/particles.config';

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
      ]),
    });

    // Particle JS
    this.invokeParticles();
  }

  // Submit Form
  submit(formData: any) {
    this.isLoading = true;

    this.authService.signin(formData).subscribe((response) => {
      this.isLoading = false;
      if (response.status === 'Password-Error') {
        this.passwordErr = true;
      } else if (response.status === 'Username-Or-Email') {
        this.userOrMailErr = true;
      } else {
        // Signin Success
        localStorage.setItem('jwt', response.data.token);

        this.router.navigate(['/']);
      }
      console.log(response);
    });
    // Remove the Validation Message From template
    setTimeout(() => {
      this.passwordErr = false;
      this.userOrMailErr = false;
    }, 2500);
  }

  // Particle JS
  invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig);
  }
}
