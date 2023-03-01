import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared.module';

import { AppRoutingModule } from './app.routing';
import { VerifyEmailGuard } from './guards/verifyEmail.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { TokenIntercepterService } from './Intercepter/token-intercepter.service';
import { UserAutherizationGuard } from './guards/userAutherization.guard';

import { AppComponent } from './app.component';
import { HeaderComponent } from './common/user-pages/header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserPagesComponent } from './common/user-pages/user-pages.component';
import { ProjectWorkspaceComponent } from './main-workspaces/project-workspace/project-workspace.component';
import { LeftProWorkspaceNavComponent } from './main-workspaces/project-workspace/left-pro-workspace-nav/left-pro-workspace-nav.component';
import { MainWorkspacesComponent } from './main-workspaces/main-workspaces.component';
import { AuthComponent } from './auth/auth.component';
import { userAccessProjectGuard } from './guards/userAccessProject.guard';
import { UserWorkspaceComponent } from './main-workspaces/user-workspace/user-workspace.component';
import { WorkspaceLeftNavComponent } from './main-workspaces/user-workspace/workspace-left-nav/workspace-left-nav.component';
import { userAccessPageGuard } from './guards/userAccessPage.guard';
import { ErrorCatchingInterceptor } from './Intercepter/error-interceptor.service';
import { ErrorPageComponent } from './error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AuthComponent,
    WorkspaceLeftNavComponent,
    UserPagesComponent,
    MainWorkspacesComponent,
    ProjectWorkspaceComponent,
    UserWorkspaceComponent,
    LeftProWorkspaceNavComponent,
    ErrorPageComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenIntercepterService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorCatchingInterceptor,
      multi: true,
    },
    VerifyEmailGuard,
    AuthenticationGuard,
    UserAutherizationGuard,
    userAccessProjectGuard,
    userAccessPageGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
