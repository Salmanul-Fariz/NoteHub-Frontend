import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, delay, filter, Subject, Subscription } from 'rxjs';
import { ProjectWorkspaceService } from 'src/app/service/projectWorkspace.service';

@Component({
  selector: 'app-project-workspace',
  templateUrl: './project-workspace.component.html',
  styleUrls: ['./project-workspace.component.css'],
  providers: [ProjectWorkspaceService],
})
export class ProjectWorkspaceComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  ProjectSettingsDataTransfer: Subscription;
  CreateProjectDataTransfer: Subscription;
  CreateRoleDataTransfer: Subscription;
  CreateContributorsDataTransfer: Subscription;
  RemoveContributorsDataTransfer: Subscription;
  PageWorkspaceNameSubject = new Subject<string>();
  isProjectSettingsModal: boolean;
  isCreateProjectModal: boolean;
  isCreateRoleModal: boolean;
  isCreateContributorsModal: boolean;
  isRemoveContributorsModal: { userId: string; projectId: string };
  userDetails: any;
  BoardCreatingForm: FormGroup;
  RoleCreatingForm: FormGroup;
  ContributorsCreatingForm: FormGroup;
  boardAlreadyExist: boolean;
  roleAlreadyExist: boolean;
  ContributorNotExist: boolean;
  ContributorAlreadyExist: boolean;
  ContributorAdmin: boolean;
  boardDetails: any;

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private _projectService: ProjectWorkspaceService
  ) {}

  ngOnInit(): void {
    this.setForms();

    this._projectService.viewProjectWorspacePage().subscribe({
      next: (response) => {
        this.userDetails = response.data.userDetails;
        this._projectService.userDetails = response.data.userDetails;
        this._projectService.boardsDetails = response.data.boardDetails;

        this._projectService.DetailsDataTransfer.emit({
          userDetails: this._projectService.userDetails,
          boardDetails: this._projectService.boardsDetails,
        });
      },
      error: (error) => {
        if (error.status === 408 || 400) {
          localStorage.clear();
          this.router.navigate(['auth/signin']);
        }
      },
    });

    // Open modal of Settings Subscription
    this.ProjectSettingsDataTransfer =
      this._projectService.ProjectSettingsDataTransfer.subscribe((data) => {
        this.isProjectSettingsModal = true;
      });

    // Create Project modal open
    this.CreateProjectDataTransfer =
      this._projectService.CreateProjectDataTransfer.subscribe((data) => {
        this.isCreateProjectModal = true;
      });

    // Create new project role
    this.CreateRoleDataTransfer =
      this._projectService.CreateRoleDataTransfer.subscribe((data) => {
        this.isCreateRoleModal = true;
      });

    // Remove the contributor
    this.RemoveContributorsDataTransfer =
      this._projectService.RemoveContributorsDataTransfer.subscribe((data) => {
        this.isRemoveContributorsModal = data;
      });

    // Create a new contributors
    this.CreateContributorsDataTransfer =
      this._projectService.CreateContributorsDataTransfer.subscribe((data) => {
        this.isCreateContributorsModal = true;

        this._projectService.GetBoardDetails(data).subscribe({
          next: (response) => {
            this._projectService.board_Details = response.data.boardDetails;
            this._projectService.userDetails = response.data.userDetails;

            this.boardDetails = this._projectService.board_Details;
          },
          error: (error) => {},
        });
      });

    // update the data by debounceTime
    this.PageWorkspaceNameSubject.pipe(debounceTime(1000)).subscribe(
      (value) => {
        this._projectService.UpdateProjectWorkspaceName(value).subscribe({
          next: (response) => {
            this._projectService.userDetails.workSpaces.projectWorkspace.name =
              value;

            this._projectService.DetailsDataTransfer.emit({
              userDetails: this._projectService.userDetails,
              boardDetails: this._projectService.boardsDetails,
            });
          },
          error: (error) => {
            if (error.status === 408 || 400) {
              localStorage.clear();
              this.router.navigate(['auth/signin']);
            }
          },
        });
      }
    );
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

  setForms() {
    // Board Creating Form
    this.BoardCreatingForm = new FormGroup({
      boardName: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(25)],
      }),
      projectType: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(25)],
      }),
    });

    // Role Creating Form
    this.RoleCreatingForm = new FormGroup({
      roleName: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(25)],
      }),
      color: new FormControl(null, {
        validators: [Validators.required],
      }),
    });

    // contributors Creating Form
    this.ContributorsCreatingForm = new FormGroup({
      contributorName: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(25)],
      }),
      roleName: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  projectName(event: any) {
    this.PageWorkspaceNameSubject.next(event.target.value);
  }

  // close Board Settings modal
  closeBoardModal() {
    this.isProjectSettingsModal = false;
    this.isCreateProjectModal = false;
    this.isCreateRoleModal = false;
    this.isCreateContributorsModal = false;
    this.isRemoveContributorsModal = { userId: '', projectId: '' };

    this.boardAlreadyExist = false;
    this.roleAlreadyExist = false;
    this.ContributorNotExist = false;
    this.ContributorAlreadyExist = false;
    this.ContributorAdmin = false;
    this.setForms();
  }

  // Create Board
  createBoard(formData: any) {
    this._projectService.CreateProjectWorkspace(formData).subscribe({
      next: (response) => {
        this.boardAlreadyExist = false;

        if (response.status === 'Existed') {
          this.boardAlreadyExist = true;
        } else {
          this._projectService.boardsDetails = response.data.boardDetails;
          this._projectService.userDetails = response.data.userDetails;

          this._projectService.DetailsDataTransfer.emit({
            userDetails: this._projectService.userDetails,
            boardDetails: this._projectService.boardsDetails,
          });

          this.closeBoardModal();
        }
      },
      error: (error) => {
        if (error.status === 408 || 400) {
          localStorage.clear();
          this.router.navigate(['auth/signin']);
        }
      },
    });
  }

  createRole(formData: any) {
    const url = this.router.url.split('/');
    this._projectService
      .CreateProjectRole(formData, url[url.length - 2])
      .subscribe({
        next: (response) => {
          this.roleAlreadyExist = false;

          if (response.status === 'Existed') {
            this.roleAlreadyExist = true;
          } else {
            this._projectService.board_Details = response.data;

            this._projectService.BoardDataTransfer.emit(
              this._projectService.board_Details
            );

            this.closeBoardModal();
          }
        },
        error: (error) => {
          if (error.status === 408 || 400) {
            localStorage.clear();
            this.router.navigate(['auth/signin']);
          }
        },
      });
  }

  createContributor(formData: any) {
    const url = this.router.url.split('/');
    this._projectService
      .CreateProjectContributor(formData, url[url.length - 2])
      .subscribe({
        next: (response) => {
          this.ContributorNotExist = false;
          this.ContributorAlreadyExist = false;
          this.ContributorAdmin = false;

          if (response.status === 'Existed') {
            this.ContributorAlreadyExist = true;
          } else if (response.status === 'no-user-exist') {
            this.ContributorNotExist = true;
          } else if (response.status === 'Admin') {
            this.ContributorAdmin = true;
          } else {
            this._projectService.board_Details = response.data;

            this._projectService.BoardDataTransfer.emit(
              this._projectService.board_Details
            );

            this.closeBoardModal();
          }
        },
        error: (error) => {
          if (error.status === 408 || 400) {
            localStorage.clear();
            this.router.navigate(['auth/signin']);
          }
        },
      });
  }

  successDeleteContributor() {
    this._projectService
      .RemoveProjectContributor(
        this.isRemoveContributorsModal.projectId,
        this.isRemoveContributorsModal.userId
      )
      .subscribe({
        next: (response) => {
          this._projectService.board_Details = response.data;
          this._projectService.BoardDataTransfer.emit(
            this._projectService.board_Details
          );

          this.closeBoardModal();
        },
        error: (error) => {},
      });
  }

  ngOnDestroy(): void {
    this.ProjectSettingsDataTransfer.unsubscribe();
    this.CreateProjectDataTransfer.unsubscribe();
    this.CreateRoleDataTransfer.unsubscribe();
    this.CreateContributorsDataTransfer.unsubscribe();
  }
}
