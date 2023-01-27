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
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  workSpaceNameUpdate: string;
  isWorkSpaceNameUpdate: boolean = false;
  workspaceNameForm: FormGroup;

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
        this.workSpaceNameUpdate = obj.name;
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

    // Form Setup
    this.workspaceNameForm = new FormGroup({
      data: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
    });
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
    this.isWorkSpaceNameUpdate = false;
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
        this.isWorkSpaceNameUpdate = false;
        this.workspaceService.isModal = false;
        this.workspace.icon = event.emoji.id;
      });
  }

  updateName(event: any) {
    this.isWorkSpaceNameUpdate = false;
    if (
      event.target.value !== this.workSpaceNameUpdate &&
      event.target.value !== ''
    ) {
      this.isWorkSpaceNameUpdate = true;
    }
  }

  nameUpdate(data: any) {
    this.workspaceService.UpdateWorkspaceName(data).subscribe((response) => {
      this.isEmojiBar = false;
      this.isWorkSpaceNameUpdate = false;
      this.workspaceService.isModal = false;
      this.workSpaceNameUpdate = data.data;
      this.workspace.name = data.data;
    });
  }

  ngOnDestroy(): void {
    this.modalSubscribtion.unsubscribe();
  }
}
