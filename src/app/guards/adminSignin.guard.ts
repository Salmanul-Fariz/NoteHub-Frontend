import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from '../service/admin.service';

@Injectable()
export class AdminSigninGuard implements CanActivate {
  constructor(private adminService: AdminService, private router: Router) {}

  canActivate(): any {
    if (!this.adminService.isValidToken()) {
      return true;
    } else {
      this.router.navigate(['/admin']);
      return false;
    }
  }
}
