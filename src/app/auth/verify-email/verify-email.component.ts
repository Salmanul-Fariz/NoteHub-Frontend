import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthenticationService } from '../../service/authentication.service';

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
    // Auto Checking
    const sendIntervalRequest = new Observable((observer) => {
      const intervel = setInterval(() => {
        this.authService
          .verifyEmailVerification(localStorage.getItem('jwt'))
          .subscribe({
            next: (response) => {
              if (response.data === 'Verify') {
                localStorage.removeItem('verify');
                this.router.navigate(['/']);
                stopIntervel();
              }
              if (response.data === 'Delete') {
                localStorage.clear();
                this.router.navigate(['/auth/signup']);
                stopIntervel();
              }
              if (response.data === 'token-expired') {
                localStorage.clear();
                this.router.navigate(['/auth/signup']);
                stopIntervel();
              }
            },
          });
      }, 4000);

      function stopIntervel() {
        clearInterval(intervel);
      }
    });

    this.sendIntervalRequest = sendIntervalRequest.subscribe();
  }

  ngOnDestroy(): void {
    this.sendIntervalRequest.unsubscribe();
  }
}
