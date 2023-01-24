import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  homePage(token: null | string) {
    return this.http.get<any>(`${environment.baseUrl}?token=${token}`);
  }
}
