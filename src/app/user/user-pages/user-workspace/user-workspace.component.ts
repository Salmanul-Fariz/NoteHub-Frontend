import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

import { UserWorkspaceService } from 'src/app/service/userWorkspace.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-workspace',
  templateUrl: './user-workspace.component.html',
  styleUrls: ['./user-workspace.component.css'],
})
export class UserWorkspaceComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  modalSubscribtion: Subscription;
  workspace: { name: string; icon: string } = { name: '', icon: '' };
  isModal: boolean | unknown;
  isEmojiBar: boolean;

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private workspaceService: UserWorkspaceService
  ) {}

  ngOnInit(): void {
    this.workspaceService.viewWorspacePage().subscribe({
      next: (response) => {
        const obj = {
          name: response.data.workSpaces.userWorkspace.name,
          icon: response.data.workSpaces.userWorkspace.icon,
        };
        this.workspace = obj;
      },
      error: (error) => {
        if (error.status === 408 || 400) {
          localStorage.clear();
          this.router.navigate(['auth/signin']);
        }
      },
    });

    this.modalSubscribtion = this.workspaceService.modalObservable.subscribe(
      (res) => {
        this.isModal = res;
      }
    );
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

  closeModal() {
    this.workspaceService.isModal = false;
  }

  openEmojiBar() {
    this.isEmojiBar = true;
  }

  closeEmojiBar() {
    this.isEmojiBar = false;
  }

  addEmoji(event: any) {
    this.workspaceService
      .UpdateWorkspaceIcon(event.emoji.id)
      .subscribe((response) => {
        this.isEmojiBar = false;
        this.workspaceService.isModal = false;
        this.workspace.icon = event.emoji.id;
      });
  }

  ngOnDestroy(): void {
    this.modalSubscribtion.unsubscribe();
  }
}
