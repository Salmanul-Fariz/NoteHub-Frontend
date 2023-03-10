import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { environment } from '../environments/environment.dev';

@Injectable({ providedIn: 'root' })
export class ProjectWorkspaceService {
  DetailsDataTransfer = new EventEmitter<{
    userDetails: any;
    boardDetails: any;
  }>();
  AccessAdminDataTransfer = new EventEmitter<boolean>();
  AccessContributorDataTransfer = new EventEmitter<string[]>();
  BoardDataTransfer = new EventEmitter<any>();
  ProjectSettingsDataTransfer = new EventEmitter<boolean>();
  CreateProjectDataTransfer = new EventEmitter<boolean>();
  CreateRoleDataTransfer = new EventEmitter<boolean>();
  CreateContributorsDataTransfer = new EventEmitter<string>();
  RemoveContributorsDataTransfer = new EventEmitter<{
    userId: string;
    projectId: string;
  }>();
  RemoveRolesDataTransfer = new EventEmitter<{
    roleName: string;
    projectId: string;
  }>();
  WorkspaceDataTransfer = new EventEmitter<{
    taskList: string;
    taskDetails: any;
    projectId: string;
  }>();
  CreateTaskDataTransfer = new EventEmitter<string>();
  RemoveTaskDataTransfer = new EventEmitter<{
    taskId: string;
    taskListName: string;
    projectId: string;
  }>();
  RemoveProjectDataTransfer = new EventEmitter<string>();
  userDetails: any;
  boardsDetails: any[];
  board_Details: any[];
  boardSelectedId: string;

  constructor(private _http: HttpClient) {}

  // is user can Access the projct workSpaces
  isCanAccessProject(projectId: string) {
    return this._http.get<any>(
      `${environment.baseUrl}/workspaces/project-workspace/access?projectId=${projectId}`
    )
  }

  // is Access to Admin
  isAccessProjectAdmin(projectId: string) {
    return this._http.get<any>(
      `${environment.baseUrl}/workspaces/project-workspace/access/admin?projectId=${projectId}`
    );
  }

  // is Access contributor to task
  isAccessProjectContributorsTask(projectId: string) {
    return this._http.get<any>(
      `${environment.baseUrl}/workspaces/project-workspace/access/contributors?projectId=${projectId}`
    );
  }

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

  // Create a new project contributors
  CreateProjectContributor(formData: any, projectId: string) {
    return this._http.post<any>(
      `${environment.baseUrl}/workspaces/project-workspace/contributors`,
      {
        roleName: formData.roleName,
        contributorName: formData.contributorName,
        projectId: projectId,
      }
    );
  }

  // Create a new project Task
  CreateProjectTask(formData: any, projectId: string) {
    return this._http.post<any>(
      `${environment.baseUrl}/workspaces/project-workspace/tasks`,
      {
        roleName: formData.roleName,
        taskName: formData.taskName,
        projectId: projectId,
      }
    );
  }

  // Update a new project Task list
  UpdateProjectTask(
    newTasks: string[],
    projectId: string,
    editedTaskId: string,
    editedListName: string | undefined
  ) {
    return this._http.patch<any>(
      `${environment.baseUrl}/workspaces/project-workspace/tasks`,
      {
        newTasks: newTasks,
        projectId: projectId,
        editedTaskId: editedTaskId,
        editedListName: editedListName,
      }
    );
  }

  // Remove project contributors
  RemoveProjectContributor(projectId: string, userId: string) {
    return this._http.delete<any>(
      `${environment.baseUrl}/workspaces/project-workspace/contributors?projectId=${projectId}&userId=${userId}`
    );
  }

  // Remove project Role
  RemoveProjectRole(projectId: string, roleName: string) {
    return this._http.delete<any>(
      `${environment.baseUrl}/workspaces/project-workspace/roles?projectId=${projectId}&roleName=${roleName}`
    );
  }

  // Remove project Task
  RemoveProjectTask(taskId: string, taskListName: string, projectId: string) {
    return this._http.delete<any>(
      `${environment.baseUrl}/workspaces/project-workspace/tasks?projectId=${projectId}&taskId=${taskId}&taskListName=${taskListName}`
    );
  }

  // Remove project Task
  RemoveProject(projectId: string) {
    return this._http.delete<any>(
      `${environment.baseUrl}/workspaces/project-workspace?projectId=${projectId}`
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
