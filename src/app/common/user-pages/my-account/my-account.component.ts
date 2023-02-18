import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter, Subscription } from 'rxjs';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
  providers: [ProfileService],
})
export class MyAccountComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  LogoutSubscription: Subscription;
  isLogout: boolean;

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private _profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.LogoutSubscription = this._profileService.LogoutDataTransfer.subscribe(
      (data) => {
        if (data) {
          this.isLogout = data;
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

  cancelLogout() {
    this.isLogout = false;
  }
  successLogout() {
    this._profileService.logout();
  }

  ngOnDestroy(): void {
    this.LogoutSubscription.unsubscribe();
  }
}
