import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-your-pages',
  templateUrl: './your-pages.component.html',
  styleUrls: ['./your-pages.component.css'],
})
export class YourPagesComponent implements OnInit {
  displayedColumns: string[] = ['pageIcon', 'pageName', 'Id'];
  PagesDataSource = new MatTableDataSource<any>();

  constructor(private _profileService: ProfileService) {}

  ngOnInit(): void {
    this.PagesDataSource.data = this._profileService.PagesDetails;

    this._profileService.ProfilePageDetailsGet().subscribe({
      next: (response) => {
        this._profileService.PagesDetails =
          response.data.workSpaces.userWorkspace.pages;

        this.PagesDataSource.data = this._profileService.PagesDetails;
      },
    });
  }
}
