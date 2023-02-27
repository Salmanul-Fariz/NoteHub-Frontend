import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../environments/environment.dev';

@Injectable()
export class ProfileService {
  LogoutDataTransfer = new EventEmitter<boolean>();
  UserDetailsDataTransfer = new EventEmitter<any>();
  UserDetails: any;
  PagesDetails: any;
  ProjectDetails: any;

  constructor(private http: HttpClient, private router: Router) {}

  ProfileDataGetting() {
    return this.http.get<any>(`${environment.baseUrl}/profile`);
  }

  ProfileImagePatch(url: string) {
    return this.http.patch<any>(`${environment.baseUrl}/profile/image`, {
      url,
    });
  }

  ProfileFullNameUpdate(value: string) {
    return this.http.patch<any>(`${environment.baseUrl}/profile/name`, {
      value,
    });
  }

  ProfileUserNameUpdate(value: string) {
    return this.http.patch<any>(`${environment.baseUrl}/profile/username`, {
      value,
    });
  }

  // Pages details in Profile Pages
  ProfilePageDetailsGet() {
    return this.http.get<any>(`${environment.baseUrl}/profile/pages`);
  }

  // Project details in Profile Pages
  ProfileProjectDetailsGet() {
    return this.http.get<any>(`${environment.baseUrl}/profile/project`);
  }

  logout() {
    this.router.navigate(['/']);
    localStorage.clear();
  }
}
