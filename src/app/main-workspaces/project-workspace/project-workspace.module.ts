import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { ProjectWorkspaceRouting } from './project-workspace.routing';

import { ProBoardsComponent } from './pro-boards/pro-boards.component';
import { ProSettingsComponent } from './pro-settings/pro-settings.component';
import { ProWorkspaceComponent } from './pro-workspace/pro-workspace.component';

@NgModule({
  imports: [SharedModule, ProjectWorkspaceRouting],
  declarations: [
    ProBoardsComponent,
    ProSettingsComponent,
    ProWorkspaceComponent,
  ],
  exports: [RouterModule],
})
export default class ProjectWorkspaceModule {}
