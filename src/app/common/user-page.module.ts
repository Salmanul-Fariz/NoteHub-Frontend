import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';
import { UserPageRouting } from './user-page.routing';

import { HomeComponent } from './user-pages/home/home.component';
import { MyAccountComponent } from './user-pages/my-account/my-account.component';
import { LeftNavProfileComponent } from './user-pages/my-account/left-nav-profile/left-nav-profile.component';
import { YourProjectsComponent } from './user-pages/my-account/your-projects/your-projects.component';
import { YourProfileComponent } from './user-pages/my-account/your-profile/your-profile.component';
import { YourPagesComponent } from './user-pages/my-account/your-pages/your-pages.component';

@NgModule({
  imports: [SharedModule, UserPageRouting],
  declarations: [
    HomeComponent,
    MyAccountComponent,
    LeftNavProfileComponent,
    YourProjectsComponent,
    YourProfileComponent,
    YourPagesComponent,
  ],
  exports: [RouterModule],
})
export default class UserPageModule {}
