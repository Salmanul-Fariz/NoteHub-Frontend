import { Component } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-auth-admin',
  templateUrl: './auth-admin.component.html',
  styleUrls: ['./auth-admin.component.css'],
  providers: [AdminService],
})
export class AuthAdminComponent {}
