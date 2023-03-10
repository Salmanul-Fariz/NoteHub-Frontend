import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { userAccessProjectGuard } from 'src/app/guards/userAccessProject.guard';

import { ProBoardsComponent } from './pro-boards/pro-boards.component';
import { ProContributorsComponent } from './pro-contributors/pro-contributors.component';
import { ProWorkspaceComponent } from './pro-workspace/pro-workspace.component';

const routes: Routes = [
  { path: '', component: ProBoardsComponent },
  {
    path: 'boards/:id',
    component: ProWorkspaceComponent,
    canActivate: [userAccessProjectGuard],
  },
  {
    path: 'boards/:id/contributors',
    component: ProContributorsComponent,
    canActivate: [userAccessProjectGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectWorkspaceRouting {}
