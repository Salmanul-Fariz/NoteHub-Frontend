import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserWorkspaceService {
  constructor(private http: HttpClient) {}

  // View User Workspace Page
  viewWorspacePage(token: string | null) {
    return this.http.get<any>(
      `http://localhost:8000/api/workspace/user-workspace?token=${token}`
    );
  }
}
