import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-pages',
  templateUrl: './user-pages.component.html',
  styleUrls: ['./user-pages.component.css'],
  providers: [AuthenticationService, UserService],
})
export class UserPagesComponent {}
