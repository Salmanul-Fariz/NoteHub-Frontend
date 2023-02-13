import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectWorkspaceService } from 'src/app/service/projectWorkspace.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pro-boards',
  templateUrl: './pro-boards.component.html',
  styleUrls: ['./pro-boards.component.css'],
})
export class ProBoardsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'type', 'userId', 'lead'];
  boardDataSubscription: Subscription;
  BoardDataSource = new MatTableDataSource<any>();

  constructor(private _projectService: ProjectWorkspaceService) {}

  ngOnInit(): void {
    this.boardDataSubscription =
      this._projectService.DetailsDataTransfer.subscribe((data) => {
        this.BoardDataSource.data = data.boardDetails;
      });
  }

  // implements Search Functionality
  filterBoardTable(event: any) {
    const value: string = event.target.value;

    if (value.length > 0) {
      const data = this._projectService.SearchBoard(value);

      this._projectService.DetailsDataTransfer.emit({
        userDetails: this._projectService.userDetails,
        boardDetails: data,
      });
    } else {
      this._projectService.DetailsDataTransfer.emit({
        userDetails: this._projectService.userDetails,
        boardDetails: this._projectService.boardsDetails,
      });
    }
  }

  boardsItems(data: any) {
    console.log(data);
  }

  createProject() {
    this._projectService.CreateProjectDataTransfer.emit(true);
  }

  ngOnDestroy(): void {
    this.boardDataSubscription.unsubscribe();
  }
}
