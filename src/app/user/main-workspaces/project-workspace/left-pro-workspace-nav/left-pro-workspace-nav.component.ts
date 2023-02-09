import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectWorkspaceService } from 'src/app/service/projectWorkspace.service';

@Component({
  selector: 'app-left-pro-workspace-nav',
  templateUrl: './left-pro-workspace-nav.component.html',
  styleUrls: ['./left-pro-workspace-nav.component.css'],
})
export class LeftProWorkspaceNavComponent implements OnInit, OnDestroy {
  detailSubscribtion: Subscription;
  userDetails: any;
  boardDetails: any;

  constructor(private _projectService: ProjectWorkspaceService) {}

  ngOnInit(): void {
    this.detailSubscribtion =
      this._projectService.DetailsDataTransfer.subscribe((data) => {
        this._projectService.userDetails = data.userDetails;
        this._projectService.boardsDetails = data.boardDetails;

        this.userDetails = this._projectService.userDetails;
        this.boardDetails = this._projectService.boardsDetails;
      });
  }

  // Board Settings
  boardSettings() {
    this._projectService.ProjectSettingsDataTransfer.emit(true);
  }

  ngOnDestroy(): void {
    this.detailSubscribtion.unsubscribe();
  }
}
