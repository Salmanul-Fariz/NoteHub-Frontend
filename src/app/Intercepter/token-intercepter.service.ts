import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({ providedIn: 'root' })
export class TokenIntercepterService implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.isAuthenticated();

    const newRequest = req.clone({
      setHeaders: { Authorization: 'Bearer ' + token },
    });

    return next.handle(newRequest);
  }
}
