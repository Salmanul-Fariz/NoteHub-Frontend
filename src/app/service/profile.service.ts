import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../environments/environment.dev';

@Injectable()
export class ProfileService {
  LogoutDataTransfer = new EventEmitter<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  logout() {
    this.router.navigate(['/']);
    localStorage.clear();
  }
}
