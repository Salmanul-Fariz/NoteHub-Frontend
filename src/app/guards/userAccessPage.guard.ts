import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserWorkspaceService } from '../service/userWorkspace.service';

@Injectable()
export class userAccessPageGuard implements CanActivate {
  constructor(
    private router: Router,
    private _pageWorkspace: UserWorkspaceService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const pageId = route.params?.['id'];

    return this._pageWorkspace.isCanAccessPage(pageId).pipe(
      map((status) => {
        if (status.data) {
          return true;
        } else {
          this.router.navigate(['/workspaces/user-workspace']);
          return false;
        }
      })
    );
  }
}
