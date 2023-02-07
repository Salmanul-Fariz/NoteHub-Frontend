import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { debounceTime, map, switchMap } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable()
export class UserWorkspaceService {
  pagesDataTransfer = new EventEmitter<string[]>();
  isModalDataTransfer = new EventEmitter<boolean>();
  isImageUpploadDataTransfer = new EventEmitter<{
    bol: boolean;
    id: string;
    pageId: string;
  }>();
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

  // Update workspace page Cover image positionY
  UpdateWorkspaceCoverPosition(positionY: number, pageId: string) {
    return this.http.patch<any>(
      `${environment.baseUrl}/workspaces/user-workspace/cover-position`,
      { positionY: positionY, pageId: pageId }
    );
  }

  // Update workspace page section type
  UpdateWorkspaceSecType(
    pageType: string,
    pageSectionId: string,
    pageId: string
  ) {
    return this.http.patch<any>(
      `${environment.baseUrl}/workspaces/user-workspace/page/type`,
      { pageType: pageType, pageSectionId: pageSectionId, pageId: pageId }
    );
  }

  // Update workspace page section Content
  UpdateWorkspaceSecContent(
    pageContent: string,
    pageSectionId: string,
    pageId: string
  ) {
    return this.http
      .patch<any>(
        `${environment.baseUrl}/workspaces/user-workspace/page/content`,
        {
          pageContent: pageContent,
          pageSectionId: pageSectionId,
          pageId: pageId,
        }
      )
      .pipe(
        switchMap((data) => {
          return this.http.patch<any>(
            `${environment.baseUrl}/workspaces/user-workspace/page/content`,
            {
              pageContent: pageContent,
              pageSectionId: pageSectionId,
              pageId: pageId,
            }
          );
        })
      );
  }

  // Add new section
  AddNewSection(
    pageId: string,
    pageSectionId: string,
    pageType: string,
    pageContent: string,
    PageInsertType: string
  ) {
    return this.http.post<any>(
      `${environment.baseUrl}/workspaces/user-workspace/page/content?type=${PageInsertType}`,
      {
        pageId: pageId,
        pageSectionId: pageSectionId,
        pageType: pageType,
        pageContent: pageContent,
      }
    );
  }

  // Update workspace page section toggle options
  UpdateWorkspaceSecToggleOption(
    isToggle: boolean,
    pageSectionId: string,
    pageId: string
  ) {
    return this.http.patch<any>(
      `${environment.baseUrl}/workspaces/user-workspace/page/toggle`,
      { isToggle: isToggle, pageSectionId: pageSectionId, pageId: pageId }
    );
  }

  // Update workspace page Cover imageUrl
  UpdateWorkspaceSecImage(
    imageUrl: string | undefined,
    pageId: string,
    pageSectionId: string
  ) {
    return this.http.post<any>(
      `${environment.baseUrl}/workspaces/user-workspace/page/section-image`,
      { imageUrl: imageUrl, pageId: pageId, pageSectionId: pageSectionId }
    );
  }

  // Update workspace page Cover imageSize
  UpdateWorkspaceSecImageSize(
    imgSize: string | undefined,
    pageId: string,
    pageSectionId: string
  ) {
    return this.http.patch<any>(
      `${environment.baseUrl}/workspaces/user-workspace/page/section-image`,
      { imgSize: imgSize, pageId: pageId, pageSectionId: pageSectionId }
    );
  }

  // update page array
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
