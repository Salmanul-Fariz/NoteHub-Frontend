import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProBoardsComponent } from './pro-boards/pro-boards.component';
import { ProSettingsComponent } from './pro-settings/pro-settings.component';
import { ProWorkspaceComponent } from './pro-workspace/pro-workspace.component';

const routes: Routes = [
  { path: '', component: ProBoardsComponent },
  {
    path: 'boards/:id',
    component: ProWorkspaceComponent,
  },
  { path: 'boards/:id/settings', component: ProSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectWorkspaceRouting {}
