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
    this.route.params.subscribe((data) => {
      this._projectService.GetBoardDetails(data?.['id']).subscribe({
        next: (response) => {
          this._projectService.board_Details = response.data.boardDetails;
          this._projectService.userDetails = response.data.userDetails;

          this.boardDetails = this._projectService.board_Details;
        },
        error: (error) => {},
      });
    });

    this._projectService.BoardDataTransfer.subscribe((data) => {
      this.boardDetails = data;
    });
  }

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  progress = ['bat', 'cat', 'hat'];

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);

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

    let editedTaskId;
    let editedListName;

    if (event.container.id === 'cdk-drop-list-0') {
      editedTaskId = this.boardDetails.tasks.todo[event.currentIndex]._id;
      editedListName = 'todo';
    } else if (event.container.id === 'cdk-drop-list-1') {
      editedTaskId = this.boardDetails.tasks.progress[event.currentIndex]._id;
      editedListName = 'progress';
    } else if (event.container.id === 'cdk-drop-list-2') {
      editedTaskId = this.boardDetails.tasks.completed[event.currentIndex]._id;
      editedListName = 'completed';
    }
    console.log(editedTaskId);

    console.log(this.boardDetails.tasks);
    this._projectService
      .UpdateProjectTask(
        this.boardDetails.tasks,
        this.boardDetails._id,
        editedTaskId,
        editedListName
      )
      .subscribe({
        next: (response) => {
          this._projectService.board_Details = response.data;
          this._projectService.BoardDataTransfer.emit(
            this._projectService.board_Details
          );
        },
        error: (error) => {},
      });
  }

  addNewTask(id: string) {
    this._projectService.CreateTaskDataTransfer.emit(id);
  }

  ngOnDestroy(): void {}
}
