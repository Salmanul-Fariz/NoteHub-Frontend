import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../auth/authentication.service';

@Injectable()
export class VerifyEmailGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  canActivate(): any {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['auth/signup']);
      return false;
    } else {
      return true;
    }
  }
}
