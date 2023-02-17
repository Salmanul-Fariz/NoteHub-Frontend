import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAutherizationGuard } from '../guards/userAutherization.guard';

import { HomeComponent } from './user-pages/home/home.component';
import { MyAccountComponent } from './user-pages/my-account/my-account.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'profile',
    component: MyAccountComponent,
    canActivate: [UserAutherizationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRouting {}
