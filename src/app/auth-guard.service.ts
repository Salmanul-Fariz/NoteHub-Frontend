import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from './auth/authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  canActivate(): any {
    if (!this.authService.isAuthenticated()) {
      console.log('can');
      return true;
    } else {
      console.log('cant');
      this.router.navigate(['/']);
      return false;
    }
  }
}
