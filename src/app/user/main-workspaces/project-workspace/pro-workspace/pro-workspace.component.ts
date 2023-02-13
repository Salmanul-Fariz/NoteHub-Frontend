import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectWorkspaceService } from 'src/app/service/projectWorkspace.service';

@Component({
  selector: 'app-pro-workspace',
  templateUrl: './pro-workspace.component.html',
  styleUrls: ['./pro-workspace.component.css'],
})
export class ProWorkspaceComponent implements OnInit, OnDestroy {
  boardDetails: any;

  constructor(
    private route: ActivatedRoute,
    private _projectService: ProjectWorkspaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((data) => {
      this._projectService.GetBoardDetails(data?.['id']).subscribe({
        next: (response) => {
          this._projectService.board_Details = response.data.boardDetails;
          this._projectService.userDetails = response.data.userDetails;

          this.boardDetails = this._projectService.board_Details;
          console.log(this.boardDetails);
        },
        error: (error) => {
          // if (error.status === 408 || 400) {
          //   localStorage.clear();
          //   this.router.navigate(['auth/signin']);
          // }
        },
      });
    });
  }

  ngOnDestroy(): void {}
}
