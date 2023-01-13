import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.adminService.dashboardPage().subscribe(
      (response) => {},
      (error) => {
        if (error.status === 408) {
          this.router.navigate(['/admin/auth/signin']);
        }
      }
    );
  }
}
