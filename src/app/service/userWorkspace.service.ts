import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserWorkspaceService {
  isModal: boolean = false;
  pages: string[];

  modalObservable = new Observable((observer) => {
    setInterval(() => {
      observer.next(this.isModal);
    }, 0);
  });

  constructor(private http: HttpClient) {}

  // View User Workspace Page
  viewWorspacePage() {
    return this.http.get<any>(
      `${environment.baseUrl}/workspaces/user-workspace`
    );
  }

  // Update Workspace icon
  UpdateWorkspaceIcon(newIcon: string) {
    return this.http.patch<any>(
      `${environment.baseUrl}/workspaces/user-workspace/icon`,
      { data: newIcon }
    );
  }

  // Update Workspace name
  UpdateWorkspaceName(newName: string) {
    return this.http.patch<any>(
      `${environment.baseUrl}/workspaces/user-workspace/name`,
      newName
    );
  }

  // Create Workspace Page
  CreateWorkspacePage() {
    return this.http.post<any>(
      `${environment.baseUrl}/workspaces/user-workspace`,
      {}
    );
  }

  // Push createPage to array
  pushPage(data: any) {
    this.pages.push(data);
  }
}
