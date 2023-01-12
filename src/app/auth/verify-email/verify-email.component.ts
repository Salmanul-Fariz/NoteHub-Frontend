import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { ParticlesConfig } from 'src/assets/particleJS/particles.config';
import { AuthenticationService } from '../../service/authentication.service';

declare let particlesJS: any;
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  sendIntervalRequest: Subscription;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Particle JS
    this.invokeParticles();

    // timer

    // Auto Checking
    const sendIntervalRequest = new Observable((observer) => {
      const intervel = setInterval(() => {
        this.authService
          .verifyEmailVerification(localStorage.getItem('jwt'))
          .subscribe((responce) => {
            if (responce.data === 'Verify') {
              localStorage.removeItem('verify');
              this.router.navigate(['/']);
              stopIntervel();
            }
            if (responce.data === 'Delete') {
              localStorage.clear();
              this.router.navigate(['/auth/signup']);
              stopIntervel();
            }
            if (responce.data === 'token-expired') {
              localStorage.clear();
              this.router.navigate(['/auth/signup']);
              stopIntervel();
            }
          });
      }, 6000);

      function stopIntervel() {
        clearInterval(intervel);
      }
    });

    sendIntervalRequest.subscribe();
  }

  // Particle JS
  invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig);
  }

  ngOnDestroy(): void {
    // this.sendIntervalRequest.unsubscribe();
  }
}
