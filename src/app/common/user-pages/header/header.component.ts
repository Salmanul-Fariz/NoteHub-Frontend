import { Component, OnChanges, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnChanges {
  status: string = 'close';
  currentRoute: string;
  userLoggedIn: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userLoggedIn = this.authService.isAuthenticated() ? true : false;

    const url = this.router.url.split('/')[1];
    this.changeRouterColor(url);

    // currentRoute setting
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.userLoggedIn = this.authService.isAuthenticated() ? true : false;
        const route = event.url.split('/')[1];
        this.changeRouterColor(route);
      }
    });
  }

  changeRouterColor(route: string) {
    this.currentRoute = '';

    if (route === '') this.currentRoute = 'home';
    else if (route === 'support') this.currentRoute = 'support';
    else if (route === 'workspaces') this.currentRoute = 'workspaces';
  }

  ngOnChanges(changes: any) {}

  menuBar() {
    this.status = this.status === 'close' ? 'open' : 'close';
  }
}
