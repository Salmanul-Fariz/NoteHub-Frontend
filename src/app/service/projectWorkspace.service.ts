import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { environment } from '../environments/environment.dev';

@Injectable()
export class ProjectWorkspaceService {
  DetailsDataTransfer = new EventEmitter<{
    userDetails: any;
    boardDetails: any;
  }>();
  BoardDataTransfer = new EventEmitter<any>();
  ProjectSettingsDataTransfer = new EventEmitter<boolean>();
  CreateProjectDataTransfer = new EventEmitter<boolean>();
  CreateRoleDataTransfer = new EventEmitter<boolean>();
  userDetails: any;
  boardsDetails: any[];
  board_Details: any[];
  boardSelectedId: string;

  constructor(private _http: HttpClient) {}

  // View Project Management
  viewProjectWorspacePage() {
    return this._http.get<any>(
      `${environment.baseUrl}/workspaces/project-workspace`
    );
  }

  // Update the name of project Workspace
  UpdateProjectWorkspaceName(newName: string) {
    return this._http.patch<any>(
      `${environment.baseUrl}/workspaces/project-workspace/name`,
      { data: newName }
    );
  }

  // Create a new project workspace
  CreateProjectWorkspace(formData: any) {
    return this._http.post<any>(
      `${environment.baseUrl}/workspaces/project-workspace`,
      formData
    );
  }

  // Create a new project role
  CreateProjectRole(formData: any, projectId: string) {
    return this._http.post<any>(
      `${environment.baseUrl}/workspaces/project-workspace/roles`,
      {
        roleName: formData.roleName,
        color: formData.color,
        projectId: projectId,
      }
    );
  }

  // Get the board details
  GetBoardDetails(data: string) {
    this.boardSelectedId = data;
    return this._http.get<any>(
      `${environment.baseUrl}/workspaces/project-workspace/boards/${data}`
    );
  }

  // Search the boards
  SearchBoard(data: string) {
    const resultArray = [];

    for (const el of this.boardsDetails) {
      const index = el.boardName.search(data);

      if (index !== -1) {
        resultArray.push(el);
      }
    }

    return resultArray;
  }
}
