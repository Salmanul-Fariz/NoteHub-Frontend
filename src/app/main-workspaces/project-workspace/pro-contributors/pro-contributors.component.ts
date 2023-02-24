import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ProjectWorkspaceService } from 'src/app/service/projectWorkspace.service';

@Component({
  selector: 'app-pro-contributors',
  templateUrl: './pro-contributors.component.html',
  styleUrls: ['./pro-contributors.component.css'],
})
export class ProContributorsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'userName', 'role', 'remove'];
  ContributorsDataSource = new MatTableDataSource<any>();
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
          this.ContributorsDataSource.data = this.boardDetails?.contributors;
        },
        error: (error) => {},
      });

      this._projectService.BoardDataTransfer.subscribe((data) => {
        this.boardDetails = data;
        this.ContributorsDataSource.data = this.boardDetails?.contributors;
      });
    });
    console.log(this.ContributorsDataSource);
  }

  addNewRole() {
    this._projectService.CreateRoleDataTransfer.emit(true);
  }

  addNewContributors(id: string) {
    this._projectService.CreateContributorsDataTransfer.emit(id);
  }
}
