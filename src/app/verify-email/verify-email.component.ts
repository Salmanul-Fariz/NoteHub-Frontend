import { Component, OnInit } from '@angular/core';

import { ParticlesConfig } from 'src/assets/particleJS/particles.config';

declare let particlesJS: any;
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  ngOnInit(): void {
    // Particle JS
    this.invokeParticles();
  }

  // Particle JS
  invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig);
  }
}
