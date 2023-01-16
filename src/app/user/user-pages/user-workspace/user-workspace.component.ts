import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

import { UserWorkspaceService } from 'src/app/service/userWorkspace.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-user-workspace',
  templateUrl: './user-workspace.component.html',
  styleUrls: ['./user-workspace.component.css'],
})
export class UserWorkspaceComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isOpenOptionTab: boolean;

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private userWorspaceService: UserWorkspaceService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.userWorspaceService
      .viewWorspacePage(localStorage.getItem('jwt'))
      .subscribe(
        (response) => {},
        (error) => {
          if (error.status === 408) {
            localStorage.clear();
            this.router.navigate(['/auth/sigin']);
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

  // open Option Tab  while enter / at first
  openOptionTab(event: any) {
    const value = (<HTMLElement>event.target).innerHTML;
    if (value.length === 1) {
      if (value.charCodeAt(0) === 47) {
        this.isOpenOptionTab = true;
      }
    } else {
      this.isOpenOptionTab = false;
    }
  }

  // close Option Tab  while enter / at first
  closeOptionTab(event: any) {
    this.isOpenOptionTab = false;
  }
}
