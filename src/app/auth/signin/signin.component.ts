import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  ngOnInit() {
    // Form Setup
    this.signinForm = new FormGroup({
      userNameOrEmail: new FormControl(null, {
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
  submit(formData: any) {}

  // Particle JS
  invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig);
  }
}
