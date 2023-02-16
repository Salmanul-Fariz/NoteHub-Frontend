import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  pagesDataTransfer: Subscription;
  isModal: boolean | unknown;
  pagesDetails: string[];
  pagesEmpty: boolean;

  constructor(
    private workspaceService: UserWorkspaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modalSubscribtion =
      this.workspaceService.isModalDataTransfer.subscribe((data) => {
        this.isModal = data;
      });

    // Page Details
    this.pagesDataTransfer = this.workspaceService.pagesDataTransfer.subscribe(
      (data) => {
        document.body.style.cursor = 'auto';

        this.pagesDetails = data;

        if (data.length !== 0) {
          this.pagesEmpty = true;
        }
      }
    );
  }

  openModal() {
    this.workspaceService.isModalDataTransfer.emit(true);
  }

  createPage() {
    document.body.style.cursor = 'wait';
    this.workspaceService.CreateWorkspacePage().subscribe({
      next: (response) => {
        this.workspaceService.pushPage(response.data);
        this.workspaceService.pagesDataTransfer.emit(
          this.workspaceService.pages
        );
      },
      error: (error) => {
        if (error.status === 408 || 400) {
          localStorage.clear();
          this.router.navigate(['auth/signin']);
        }
      },
    });
  }

  // Show Pages Details
  sendPageDetails(index: number) {
    this.workspaceService.pageDataTransfer.emit(this.pagesDetails[index]);
  }

  ngOnDestroy(): void {
    this.modalSubscribtion.unsubscribe();
    this.pagesDataTransfer.unsubscribe();
  }
}