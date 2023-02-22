import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-your-pages',
  templateUrl: './your-pages.component.html',
  styleUrls: ['./your-pages.component.css'],
})
export class YourPagesComponent implements OnInit {
  displayedColumns: string[] = ['pageIcon', 'pageName', 'Id'];
  PagesDataSource = new MatTableDataSource<any>();

  constructor(
    private _profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.PagesDataSource.data = this._profileService.PagesDetails;

    this._profileService.ProfilePageDetailsGet().subscribe({
      next: (response) => {
        this._profileService.PagesDetails =
          response.data.workSpaces.userWorkspace.pages;

        console.log(this._profileService.PagesDetails);

        this.PagesDataSource.data = this._profileService.PagesDetails;
      },
      error: (error) => {
        // if (error.status === 408 || 400) {
        //   localStorage.clear();
        //   this.router.navigate(['auth/signin']);
        // }
      },
    });
  }
}
