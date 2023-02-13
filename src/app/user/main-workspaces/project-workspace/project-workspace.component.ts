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
  PageWorkspaceNameSubject = new Subject<string>();
  isProjectSettingsModal: boolean;
  isCreateProjectModal: boolean;
  userDetails: any;
  BoardCreatingForm: FormGroup;
  boardAlreadyExist: boolean;

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private _projectService: ProjectWorkspaceService
  ) {}

  ngOnInit(): void {
    // Board Creating Form
    this.BoardCreatingForm = new FormGroup({
      boardName: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(25)],
      }),
      projectType: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(25)],
      }),
    });

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

    // update the data by debounceTime
    this.PageWorkspaceNameSubject.pipe(debounceTime(1000)).subscribe(
      (value) => {
        this._projectService.UpdateProjectWorkspaceName(value).subscribe({
          next: (response) => {
            this._projectService.userDetails.workSpaces.projectWorkspace.name =
              value;
            this._projectService.boardsDetails = response.data.boardDetails;
            this._projectService.userDetails = response.data.userDetails;

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

  projectName(event: any) {
    this.PageWorkspaceNameSubject.next(event.target.value);
  }

  // close Board Settings modal
  closeBoardModal() {
    this.isProjectSettingsModal = false;
    this.isCreateProjectModal = false;
  }

  // Create Board
  createBoard(formData: any) {
    this._projectService.CreateProjectWorkspace(formData).subscribe({
      next: (response) => {
        this.boardAlreadyExist = false;

        if (response.status === 'Existed') {
          this.boardAlreadyExist = true;
        } else {
          // Board Creating Form
          this.BoardCreatingForm = new FormGroup({
            boardName: new FormControl(null, {
              validators: [Validators.required, Validators.maxLength(25)],
            }),
            projectType: new FormControl(null, {
              validators: [Validators.required, Validators.maxLength(25)],
            }),
          });

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

  ngOnDestroy(): void {
    this.ProjectSettingsDataTransfer.unsubscribe();
    this.CreateProjectDataTransfer.unsubscribe();
  }
}
