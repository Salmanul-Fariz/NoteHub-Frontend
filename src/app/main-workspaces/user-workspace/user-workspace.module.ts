import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared.module';
import { UserWorkspaceRouting } from './user-workspace.routing';

import { WorkspaceComponent } from './workspace/workspace.component';
import { EmptyWorkspaceComponent } from './empty-workspace/empty-workspace.component';

@NgModule({
  imports: [SharedModule, UserWorkspaceRouting],
  declarations: [WorkspaceComponent, EmptyWorkspaceComponent],
  exports: [RouterModule],
})
export default class UserWorkspaceModule {}
