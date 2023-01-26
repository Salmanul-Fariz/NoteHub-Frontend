import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserWorkspaceService } from 'src/app/service/userWorkspace.service';

@Component({
  selector: 'app-workspace-left-nav',
  templateUrl: './workspace-left-nav.component.html',
  styleUrls: ['./workspace-left-nav.component.css'],
})
export class WorkspaceLeftNavComponent implements OnInit, OnDestroy {
  @Input() workspace: { name: string; icon: string };

  modalSubscribtion: Subscription;
  isModal: boolean | unknown;

  constructor(private workspaceService: UserWorkspaceService) {}

  ngOnInit(): void {
    this.modalSubscribtion = this.workspaceService.modalObservable.subscribe(
      (res) => {
        this.isModal = res;
      }
    );
  }

  openModal() {
    this.workspaceService.isModal = true;
  }

  ngOnDestroy(): void {
    this.modalSubscribtion.unsubscribe();
  }
}
