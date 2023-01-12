import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type SignUpData = { userName: string; email: string; password: string };
type SignInData = { usernameOrEmail: string; password: string };

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  // Register a user
  signup(signUpData: SignUpData) {
    return this.http.post<any>(
      'http://localhost:8000/api/auth/signup',
      signUpData
    );
  }

  // Signin a user
  signin(signinData: SignInData) {
    return this.http.post<any>(
      'http://localhost:8000/api/auth/signin',
      signinData
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
