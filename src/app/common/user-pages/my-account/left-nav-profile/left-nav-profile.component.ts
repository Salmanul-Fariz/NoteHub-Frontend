import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-left-nav-profile',
  templateUrl: './left-nav-profile.component.html',
  styleUrls: ['./left-nav-profile.component.css'],
})
export class LeftNavProfileComponent implements OnInit {
  currentRoute: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url.split('/');
    this.changeLeftColor(url);

    // currentRoute setting
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const route = event.url.split('/');
        this.changeLeftColor(route);
      }
    });
  }

  changeLeftColor(route: string[]) {
    this.currentRoute = '';
    if (route[1] === 'profile') {
      if (route.length === 2) {
        this.currentRoute = 'profile';
      } else {
        if (route[2] === 'pages') {
          this.currentRoute = route[2];
        } else if (route[2] === 'projects') {
          this.currentRoute = route[2];
        }
      }
    }
  }
}
