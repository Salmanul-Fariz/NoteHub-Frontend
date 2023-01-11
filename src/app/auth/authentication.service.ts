import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type SignUpData = { userName: string; email: string; password: string };

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  loggedIn = true;

  constructor(private http: HttpClient) {}

  // Register a user
  signup(signUpData: SignUpData) {
    return this.http.post<any>(
      'http://localhost:8000/api/auth/signup',
      signUpData
    );
  }

  // check Username Exist
  checkUsernameExist(userName: string) {
    return this.http.post<any>(
      `http://localhost:8000/api/auth/signup?userNameExist=${userName}`,
      userName
    );
  }

  // Mail verify
  verifyEmailVerification(token: string | null) {
    return this.http.post<any>(`http://localhost:8000/api/auth/checkVerify`, {
      jwt: token,
    });
  }

  isAuthenticated() {
    return localStorage.getItem('jwt');
  }

  isVerify() {
    return localStorage.getItem('verify');
  }
}
