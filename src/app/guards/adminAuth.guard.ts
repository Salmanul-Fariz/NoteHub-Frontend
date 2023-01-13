import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from '../service/admin.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private adminService: AdminService, private router: Router) {}

  canActivate(): any {
    if (!this.adminService.isValidToken()) {
      this.router.navigate(['/admin/auth/signin']);
      return false;
    } else {
      return true;
    }
  }
}
