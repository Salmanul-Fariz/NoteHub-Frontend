import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    // currentRoute setting
    this.router.events.subscribe((event: any) => {
      if (event.routerEvent) {
        this.userLoggedIn = this.authService.isAuthenticated() ? true : false;

        const route = event.routerEvent.url.split('/')[1];
        if (route === '') this.currentRoute = 'home';
        else if (route === 'support') this.currentRoute = 'support';
        else if (route === 'workspaces') this.currentRoute = 'workspaces';
        else if (route === 'feedback') this.currentRoute = 'feedback';
      }
    });
  }

  ngOnChanges(changes: any) {}

  menuBar() {
    this.status = this.status === 'close' ? 'open' : 'close';
  }
}
