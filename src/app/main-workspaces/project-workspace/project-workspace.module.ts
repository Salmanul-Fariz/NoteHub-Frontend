import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { ProjectWorkspaceRouting } from './project-workspace.routing';

import { ProBoardsComponent } from './pro-boards/pro-boards.component';
import { ProWorkspaceComponent } from './pro-workspace/pro-workspace.component';
import { ProContributorsComponent } from './pro-contributors/pro-contributors.component';
import { LastEditDatePipe } from 'src/app/pipe/last-edit-date.pipe';

@NgModule({
  imports: [SharedModule, ProjectWorkspaceRouting],
  declarations: [
    ProBoardsComponent,
    ProWorkspaceComponent,
    ProContributorsComponent,
    LastEditDatePipe,
  ],
  exports: [RouterModule],
})
export default class ProjectWorkspaceModule {}
