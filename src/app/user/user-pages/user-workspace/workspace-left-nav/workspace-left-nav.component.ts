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
  isModal: boolean | unknown;

  constructor(
    private workspaceService: UserWorkspaceService,
    private router: Router
  ) {}

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

  createPage() {
    this.workspaceService.CreateWorkspacePage().subscribe({
      next: (response) => {
        console.log(response);
        this.workspaceService.pushPage(response.data);
        console.log(this.workspaceService.pages);
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
  }
}
