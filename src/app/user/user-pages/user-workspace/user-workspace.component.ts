import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

import { UserWorkspaceService } from 'src/app/service/userWorkspace.service';

@Component({
  selector: 'app-user-workspace',
  templateUrl: './user-workspace.component.html',
  styleUrls: ['./user-workspace.component.css'],
})
export class UserWorkspaceComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private userWorspaceService: UserWorkspaceService
  ) {}

  ngOnInit(): void {
    this.userWorspaceService
      .viewWorspacePage(localStorage.getItem('jwt'))
      .subscribe(
        (response) => {},
        (error) => {
          if (error.status === 408) {
            localStorage.clear();
            this.router.navigate(['auth/signin']);
          }
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
}
