import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment.dev';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  homePage() {
    return this.http.get<any>(`${environment.baseUrl}`);
  }
}
