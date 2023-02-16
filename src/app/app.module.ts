import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { VerifyEmailGuard } from './guards/verifyEmail.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { TokenIntercepterService } from './Intercepter/token-intercepter.service';

import { HeaderComponent } from './user-pages/header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './user-pages/home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { UserPagesComponent } from './user-pages/user-pages.component';
import { AuthComponent } from './auth/auth.component';

import { UserWorkspaceComponent } from './main-workspaces/user-workspace/user-workspace.component';
import { UserAutherizationGuard } from './guards/userAutherization.guard';
import { WorkspaceLeftNavComponent } from './main-workspaces/user-workspace/workspace-left-nav/workspace-left-nav.component';
import { WorkspaceComponent } from './main-workspaces/user-workspace/workspace/workspace.component';
import { ProjectWorkspaceComponent } from './main-workspaces/project-workspace/project-workspace.component';
import { ProWorkspaceComponent } from './main-workspaces/project-workspace/pro-workspace/pro-workspace.component';
import { LeftProWorkspaceNavComponent } from './main-workspaces/project-workspace/left-pro-workspace-nav/left-pro-workspace-nav.component';
import { MainWorkspacesComponent } from './main-workspaces/main-workspaces.component';
import { ProBoardsComponent } from './main-workspaces/project-workspace/pro-boards/pro-boards.component';
import { ProSettingsComponent } from './main-workspaces/project-workspace/pro-settings/pro-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SignupComponent,
    SigninComponent,
    VerifyEmailComponent,
    UserPagesComponent,
    AuthComponent,
    UserWorkspaceComponent,
    WorkspaceLeftNavComponent,
    WorkspaceComponent,
    ProjectWorkspaceComponent,
    ProWorkspaceComponent,
    LeftProWorkspaceNavComponent,
    MainWorkspacesComponent,
    ProBoardsComponent,
    ProSettingsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    PickerModule,
    EmojiModule,
    MatSelectModule,
    MatTableModule,
    DragDropModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '806091553721-2f7tgpbm558v0968l1p5csr0065o9s9b.apps.googleusercontent.com'
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenIntercepterService,
      multi: true,
    },
    VerifyEmailGuard,
    AuthenticationGuard,
    UserAutherizationGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
