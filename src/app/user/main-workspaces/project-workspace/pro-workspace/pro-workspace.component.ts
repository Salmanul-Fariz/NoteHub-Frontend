import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectWorkspaceService } from 'src/app/service/projectWorkspace.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-pro-workspace',
  templateUrl: './pro-workspace.component.html',
  styleUrls: ['./pro-workspace.component.css'],
})
export class ProWorkspaceComponent implements OnInit, OnDestroy {
  boardDetails: any;

  constructor(
    private route: ActivatedRoute,
    private _projectService: ProjectWorkspaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((data) => {
      this._projectService.GetBoardDetails(data?.['id']).subscribe({
        next: (response) => {
          this._projectService.board_Details = response.data.boardDetails;
          this._projectService.userDetails = response.data.userDetails;

          this.boardDetails = this._projectService.board_Details;
        },
        error: (error) => {
          if (error.status === 408 || 400) {
            localStorage.clear();
            this.router.navigate(['auth/signin']);
          }
        },
      });
    });
  }

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  progress = ['bat', 'cat', 'hat'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  ngOnDestroy(): void {}
}
