import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserAutherizationGuard } from './guards/userAutherization.guard';

import { UserPagesComponent } from './common/user-pages/user-pages.component';
import { AuthComponent } from './auth/auth.component';
import { ProjectWorkspaceComponent } from './main-workspaces/project-workspace/project-workspace.component';

import { MainWorkspacesComponent } from './main-workspaces/main-workspaces.component';
import { UserWorkspaceComponent } from './main-workspaces/user-workspace/user-workspace.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const appRoutes: Routes = [
  // user pages
  {
    path: '',
    children: [
      {
        path: '',
        component: UserPagesComponent,
        // Common module
        loadChildren: () =>
          import('./common/user-page.module').then((m) => m.default),
      },
      // User Workspace Component
      {
        path: 'workspaces',
        canActivate: [UserAutherizationGuard],
        component: MainWorkspacesComponent,
        children: [
          {
            path: 'user-workspace',
            component: UserWorkspaceComponent,
            // user Workspace Module,
            loadChildren: () =>
              import(
                './main-workspaces/user-workspace/user-workspace.module'
              ).then((m) => m.default),
          },
          {
            path: 'project-workspace',
            component: ProjectWorkspaceComponent,
            // Project Workspace Module
            loadChildren: () =>
              import(
                './main-workspaces/project-workspace/project-workspace.module'
              ).then((m) => m.default),
          },
        ],
      },
      // User authentication
      {
        path: 'auth',
        component: AuthComponent,
        // Auth Module
        loadChildren: () => import('./auth/auth.module').then((m) => m.default),
      },
    ],
  },
  {
    path: 'not-found',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
