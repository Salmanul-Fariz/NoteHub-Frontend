import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmptyWorkspaceComponent } from './empty-workspace/empty-workspace.component';
import { WorkspaceComponent } from './workspace/workspace.component';

const routes: Routes = [
  { path: '', component: EmptyWorkspaceComponent },
  { path: ':id', component: WorkspaceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserWorkspaceRouting {}
