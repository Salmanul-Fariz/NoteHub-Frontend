import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { VerifyEmailGuard } from './guards/verifyEmail.guard';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationGuard } from './guards/authentication.guard';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';

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
