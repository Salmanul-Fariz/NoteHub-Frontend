import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type SignUpData = { userName: string; email: string; password: string };

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  loggedIn = true;

  constructor(private http: HttpClient) {}

  signup(signUpData: SignUpData) {
    return this.http.post<any>(
      'http://localhost:8000/api/auth/signup',
      signUpData
    );
  }
  logi() {
    this.loggedIn = false;
  }

  checkUsernameExist(userName: string) {
    return this.http.post<any>(
      `http://localhost:8000/api/auth/signup?userNameExist=${userName}`,
      userName
    );
  }

  isAuthenticated() {
    return localStorage.getItem('jwt');
  }
}
