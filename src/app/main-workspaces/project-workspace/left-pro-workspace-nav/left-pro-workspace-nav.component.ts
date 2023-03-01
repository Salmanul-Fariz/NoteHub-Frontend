import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectWorkspaceService } from 'src/app/service/projectWorkspace.service';

@Component({
  selector: 'app-left-pro-workspace-nav',
  templateUrl: './left-pro-workspace-nav.component.html',
  styleUrls: ['./left-pro-workspace-nav.component.css'],
})
export class LeftProWorkspaceNavComponent implements OnInit, OnDestroy {
  detailSubscribtion: Subscription;
  BoardIDSubscribtion: Subscription;
  projectRouteColor: string;
  userDetails: any;
  boardDetails: any;
  projectId: string;

  constructor(
    private _projectService: ProjectWorkspaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.detailSubscribtion =
      this._projectService.DetailsDataTransfer.subscribe((data) => {
        this.userDetails = this._projectService.userDetails;
        this.boardDetails = this._projectService.boardsDetails;
      });

    const url = this.router.url.split('/');
    this.routerColor(url);
    if (url.length >= 5) {
      this.projectId = url[4];
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url.split('/');
        this.routerColor(url);
        if (url.length >= 5) {
          this.projectId = url[4];
        }
      }
    });
  }

  routerColor(url: string[]) {
    this.projectRouteColor = '';

    if (url[url.length - 1] === 'contributors')
      this.projectRouteColor = 'contributors';
    else if (url[url.length - 2] === 'boards')
      this.projectRouteColor = 'boards';
  }

  // Board Settings
  boardSettings() {
    this._projectService.ProjectSettingsDataTransfer.emit(true);
  }

  ngOnDestroy(): void {
    this.detailSubscribtion.unsubscribe();
  }
}
