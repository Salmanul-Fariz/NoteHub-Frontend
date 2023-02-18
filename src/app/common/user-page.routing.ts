import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAutherizationGuard } from '../guards/userAutherization.guard';

import { HomeComponent } from './user-pages/home/home.component';
import { MyAccountComponent } from './user-pages/my-account/my-account.component';
import { YourPagesComponent } from './user-pages/my-account/your-pages/your-pages.component';
import { YourProfileComponent } from './user-pages/my-account/your-profile/your-profile.component';
import { YourProjectsComponent } from './user-pages/my-account/your-projects/your-projects.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'profile',
    component: MyAccountComponent,
    canActivate: [UserAutherizationGuard],
    children: [
      { path: '', component: YourProfileComponent },
      { path: 'pages', component: YourPagesComponent },
      { path: 'projects', component: YourProjectsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRouting {}
