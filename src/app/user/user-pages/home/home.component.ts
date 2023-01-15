import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('jwt');

    this.userService.homePage(token).subscribe((response) => {
      if (response.status === 'Pending-Verify') {
        this.authService.loggedIn = false;
        localStorage.setItem('verify', 'true');
        this.router.navigate(['auth/verify']);
      }
      if (response.status === 'Success') {
        this.authService.loggedIn = true;
      }
    });
  }
}
