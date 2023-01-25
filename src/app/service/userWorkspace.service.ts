import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserWorkspaceService {
  constructor(private http: HttpClient) {}

  // View User Workspace Page
  viewWorspacePage() {
    return this.http.get<any>(
      `${environment.baseUrl}/workspaces/user-workspace`
    );
  }
}
