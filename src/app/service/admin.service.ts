import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment.dev';

@Injectable()
export class AdminService {
  constructor(private http: HttpClient) {}

  // View dashboard
  dashboardPage() {
    return this.http.get<any>(`${environment.baseUrl}/admin}`);
  }

  // Sign in Post
  signInPost(data: any) {
    return this.http.post<any>(
      `${environment.baseUrl}/admin/auth/signin`,
      data
    );
  }

  // Check admin route is Validation
  isValidToken() {
    return localStorage.getItem('admin-jwt');
  }
}
