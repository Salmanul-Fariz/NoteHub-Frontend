import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared.module';
import { UserWorkspaceRouting } from './user-workspace-routing.module';

import { UserWorkspaceComponent } from './user-workspace.component';
import { WorkspaceLeftNavComponent } from './workspace-left-nav/workspace-left-nav.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [SharedModule, CommonModule, UserWorkspaceRouting],
  declarations: [
    UserWorkspaceComponent,
    WorkspaceLeftNavComponent,
    WorkspaceComponent,
  ],
  exports: [RouterModule],
})
export default class UserWorkspaceModule {}
