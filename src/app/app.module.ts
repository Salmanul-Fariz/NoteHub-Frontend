import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { HeaderComponent } from './user/header/header.component';
import { FooterComponent } from './user/footer/footer.component';
import { HomeComponent } from './user/home/home.component';
import { SignupComponent } from './user/auth/signup/signup.component';
import { SigninComponent } from './user/auth/signin/signin.component';
import { VerifyEmailComponent } from './user/auth/verify-email/verify-email.component';
import { VerifyEmailGuard } from './guards/verifyEmail.guard';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationGuard } from './guards/authentication.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SignupComponent,
    SigninComponent,
    VerifyEmailComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
  ],
  providers: [VerifyEmailGuard, AuthenticationGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
