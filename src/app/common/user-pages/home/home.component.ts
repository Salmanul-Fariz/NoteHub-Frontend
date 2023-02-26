import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isAuth: boolean;
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.homePage().subscribe({
      next: (response) => {
        if (response.status === 'Pending-Verify') {
          localStorage.setItem('verify', 'true');
          this.router.navigate(['auth/verify']);
        }
      },
    });

    this.isAuth = localStorage.getItem('jwt') !== ('' || null) ? true : false;
    console.log(this.isAuth);
  }
}
