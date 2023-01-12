import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';

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

  // is JWT token is there
  isAuthenticated() {
    return localStorage.getItem('jwt');
  }

  // Mail Verification dine
  isVerify() {
    return localStorage.getItem('verify');
  }

  // Password Validator
  validatePassword(control: AbstractControl) {
    const password = control.value;

    if (!password) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#%&]/.test(password);

    const errors = {};
    if (!hasUpperCase) {
      return { upperCase: true };
    }
    if (!hasLowerCase) {
      return { lowerCase: true };
    }
    if (!hasNumber) {
      return { number: true };
    }
    if (!hasSpecial) {
      return { special: true };
    }
    return null;
  }

  // user Name Validation
  // Check user name have space or ..
  userNameValidator(control: AbstractControl) {
    const value = control.value;

    if (!value) {
      return null;
    }

    const output = [];

    for (let i = 0; i < value.length; i++) {
      console.log(value);

      const code = value.charCodeAt(i);
      if ((code > 47 && code < 58) || (code > 96 && code < 122)) {
        if (code !== 32) {
          output.push(code);
        }
      }
    }
    if (output.length === value.length) {
      console.log(value);

      return null;
    }

    return { usernameStructure: true };
  }
}
