import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectWorkspaceService } from 'src/app/service/projectWorkspace.service';

@Component({
  selector: 'app-pro-contributors',
  templateUrl: './pro-contributors.component.html',
  styleUrls: ['./pro-contributors.component.css'],
})
export class ProContributorsComponent implements OnInit {
  boardDetails: any;

  constructor(
    private _projectService: ProjectWorkspaceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this._projectService.GetBoardDetails(data?.['id']).subscribe({
        next: (response) => {
          this._projectService.board_Details = response.data.boardDetails;
          this._projectService.userDetails = response.data.userDetails;

          this.boardDetails = this._projectService.board_Details;
        },
        error: (error) => {},
      });

      this._projectService.BoardDataTransfer.subscribe((data) => {
        this.boardDetails = data;
      });
    });
  }

  addNewRole() {
    this._projectService.CreateRoleDataTransfer.emit(true);
  }
}
