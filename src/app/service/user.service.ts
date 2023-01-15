import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedIn = false;
  constructor(private http: HttpClient) {}

  homePage(token: null | string) {
    return this.http.get<any>(`http://localhost:8000/api?token=${token}`);
  }
}
