import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserWorkspaceComponent } from './user-workspace.component';

const routes: Routes = [
  { path: '', component: UserWorkspaceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserWorkspaceRouting {}
