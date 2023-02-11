import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectWorkspaceService } from 'src/app/service/projectWorkspace.service';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  type: string;
  lead: string;
  userId: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    userId: 'user12',
    name: 'Hydrogen',
    type: 'e-learning',
    lead: 'salmanulfariz997@gmail.com',
  },
  {
    userId: 'user12',
    name: 'Helium',
    type: 'e-learning',
    lead: 'salmanulfariz997@gmail.com',
  },
  {
    userId: 'user12',
    name: 'Lithium',
    type: 'e-learning',
    lead: 'salmanulfariz997@gmail.com',
  },
  {
    userId: 'user12',
    name: 'Beryllium',
    type: 'e-learning',
    lead: 'salmanulfariz997@gmail.com',
  },
  {
    userId: 'user12',
    name: 'Boron',
    type: 'e-learning',
    lead: 'salmanulfariz997@gmail.com',
  },
  {
    userId: 'user12',
    name: 'Carbon',
    type: 'e-learning',
    lead: 'salmanulfariz997@gmail.com',
  },
  {
    userId: 'user12',
    name: 'Nitrogen',
    type: 'e-learning',
    lead: 'salmanulfariz997@gmail.com',
  },
  {
    userId: 'user12',
    name: 'Oxygen',
    type: 'e-learning',
    lead: 'salmanulfariz997@gmail.com',
  },
  {
    userId: 'user12',
    name: 'Fluorine',
    type: 'e-learning',
    lead: 'salmanulfariz997@gmail.com',
  },
  {
    userId: 'user12',
    name: 'Neon',
    type: 'e-learning',
    lead: 'salmanulfariz997@gmail.com',
  },
];

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
