import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';
import { UserPageRouting } from './user-page-routing.module';

import { HomeComponent } from './user-pages/home/home.component';

@NgModule({
  imports: [SharedModule, UserPageRouting],
  declarations: [HomeComponent],
  exports: [RouterModule],
})
export default class UserPageModule {}
