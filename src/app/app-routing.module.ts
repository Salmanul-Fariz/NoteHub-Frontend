import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerifyEmailGuard } from './guards/verifyEmail.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { UserAutherizationGuard } from './guards/userAutherization.guard';

import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './user-pages/home/home.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { SigninComponent } from './auth/signin/signin.component';
import { UserPagesComponent } from './user-pages/user-pages.component';
import { UserWorkspaceComponent } from './main-workspaces/user-workspace/user-workspace.component';
import { AuthComponent } from './auth/auth.component';
import { ProjectWorkspaceComponent } from './main-workspaces/project-workspace/project-workspace.component';

import { MainWorkspacesComponent } from './main-workspaces/main-workspaces.component';
import { ProBoardsComponent } from './main-workspaces/project-workspace/pro-boards/pro-boards.component';
import { ProWorkspaceComponent } from './main-workspaces/project-workspace/pro-workspace/pro-workspace.component';
import { ProSettingsComponent } from './main-workspaces/project-workspace/pro-settings/pro-settings.component';

const appRoutes: Routes = [
  // user pages
  {
    path: '',
    children: [
      {
        path: '',
        component: UserPagesComponent,
        children: [{ path: '', component: HomeComponent }],
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
          },
          {
            path: 'project-workspace',
            component: ProjectWorkspaceComponent,
            children: [
              { path: '', component: ProBoardsComponent },
              {
                path: 'boards/:id',
                component: ProWorkspaceComponent,
              },
              { path: 'boards/:id/settings', component: ProSettingsComponent },
            ],
          },
        ],
      },
      // User authentication
      {
        path: 'auth',
        component: AuthComponent,
        children: [
          {
            path: 'signup',
            component: SignupComponent,
            canActivate: [AuthenticationGuard],
          },
          {
            path: 'signin',
            component: SigninComponent,
            canActivate: [AuthenticationGuard],
          },
          {
            path: 'verify',
            component: VerifyEmailComponent,
            canActivate: [VerifyEmailGuard],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
