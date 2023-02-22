import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { ProjectWorkspaceRouting } from './project-workspace.routing';

import { ProBoardsComponent } from './pro-boards/pro-boards.component';
import { ProSettingsComponent } from './pro-settings/pro-settings.component';
import { ProWorkspaceComponent } from './pro-workspace/pro-workspace.component';
import { ProContributorsComponent } from './pro-contributors/pro-contributors.component';
import { ProDetailsComponent } from './pro-details/pro-details.component';

@NgModule({
  imports: [SharedModule, ProjectWorkspaceRouting],
  declarations: [
    ProBoardsComponent,
    ProSettingsComponent,
    ProWorkspaceComponent,
    ProContributorsComponent,
    ProDetailsComponent,
  ],
  exports: [RouterModule],
})
export default class ProjectWorkspaceModule {}
