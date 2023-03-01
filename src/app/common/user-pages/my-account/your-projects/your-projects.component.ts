import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-your-projects',
  templateUrl: './your-projects.component.html',
  styleUrls: ['./your-projects.component.css'],
})
export class YourProjectsComponent {
  displayedColumns: string[] = ['boardName', 'projectType', 'Id'];
  ProjectDataSource = new MatTableDataSource<any>();

  constructor(private _profileService: ProfileService) {}

  ngOnInit(): void {
    this.ProjectDataSource.data = this._profileService.PagesDetails;

    this._profileService.ProfileProjectDetailsGet().subscribe({
      next: (response) => {
        this._profileService.ProjectDetails =
          response.data.workSpaces.projectWorkspace.boards;

        this.ProjectDataSource.data = this._profileService.ProjectDetails;
      },
    });
  }
}
