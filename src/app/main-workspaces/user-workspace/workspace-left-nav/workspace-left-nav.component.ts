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
  pagesDetails: any[];

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
  sendPageDetails(pageId: string) {
    this.workspaceService.GetWorkspacePage(pageId).subscribe({
      next: (response) => {
        this.workspaceService.pageDataTransfer.emit(response.data);
      },
      error: (error) => {
        if (error.status === 408 || 400) {
          localStorage.clear();
          this.router.navigate(['auth/signin']);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.modalSubscribtion.unsubscribe();
    this.pagesDataTransfer.unsubscribe();
  }
}
