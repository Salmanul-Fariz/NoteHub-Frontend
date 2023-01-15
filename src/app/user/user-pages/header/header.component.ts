import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  status: string = 'close';
  currentRoute: string;
  userLoggedIn: boolean;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    // currentRoute setting
    this.router.events.subscribe((event: any) => {
      if (event.routerEvent) {
        const route = event.routerEvent.url.split('/')[1];
        if (route === '') this.currentRoute = 'home';
        else if (route === 'support') this.currentRoute = 'support';
        else if (route === 'workspace') this.currentRoute = 'workspace';
        else if (route === 'feedback') this.currentRoute = 'feedback';
      }
    });

    this.userLoggedIn = this.userService.loggedIn;
  }

  menuBar() {
    this.status = this.status === 'close' ? 'open' : 'close';
  }
}
