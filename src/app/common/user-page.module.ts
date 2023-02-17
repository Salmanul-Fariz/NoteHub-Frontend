import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';
import { UserPageRouting } from './user-page.routing';

import { HomeComponent } from './user-pages/home/home.component';
import { MyAccountComponent } from './user-pages/my-account/my-account.component';

@NgModule({
  imports: [SharedModule, UserPageRouting],
  declarations: [HomeComponent, MyAccountComponent],
  exports: [RouterModule],
})
export default class UserPageModule {}
