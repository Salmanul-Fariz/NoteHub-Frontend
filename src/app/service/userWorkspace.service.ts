import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserWorkspaceService {
  pagesDataTransfer = new EventEmitter<string[]>();
  isModalDataTransfer = new EventEmitter<boolean>();
  titleIconEditDataTransfer = new EventEmitter<{ bol: boolean; id: string }>();
  pageDataTransfer = new EventEmitter<{}>();
  pages: any[];

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

  // Update workspace page icon
  UpdateWorkspacePageIcon(iconName: string, pageId: string) {
    return this.http.patch<any>(
      `${environment.baseUrl}/workspaces/user-workspace/page-icon`,
      { iconName: iconName, pageId: pageId }
    );
  }

  // Update workspace page name
  UpdateWorkspacePageName(pageName: string, pageId: string) {
    return this.http.patch<any>(
      `${environment.baseUrl}/workspaces/user-workspace/page-name`,
      { pageName: pageName, pageId: pageId }
    );
  }

  // Update workspace page Cover imageUrl
  UpdateWorkspaceCoverImage(imageUrl: string | undefined, pageId: string) {
    return this.http.patch<any>(
      `${environment.baseUrl}/workspaces/user-workspace/cover-image`,
      { imageUrl: imageUrl, pageId: pageId }
    );
  }

  // update page icon and update page array
  updatePageArray(id: string, data: any) {
    const index = this.pages.findIndex((val) => {
      return val._id === id;
    });

    this.pages.splice(index, 1, data);
  }

  // Push createPage to array
  pushPage(data: any) {
    this.pages.push(data);
  }

  // ShowPages
  ShowPages() {
    return this.pages;
  }
}
