import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { ProjectWorkspaceService } from '../service/projectWorkspace.service';

@Injectable()
export class userAccessProjectGuard implements CanActivate {
  constructor(
    private router: Router,
    private _projectWorkspace: ProjectWorkspaceService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const projectId = route.params?.['id'];

    return this._projectWorkspace.isCanAccessProject(projectId).pipe(
      map((status) => {
        if (status.data) {
          return true;
        } else {
          this.router.navigate(['/workspaces/project-workspace']);
          return false;
        }
      })
    );
  }
}
