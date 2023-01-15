import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class UserAutherizationGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): any {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/signin']);
      return false;
    } else {
      return true;
    }
  }
}
