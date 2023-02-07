import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { debounceTime, delay, filter, map } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UserWorkspaceService } from 'src/app/service/userWorkspace.service';
import { S3BucketService } from 'src/app/service/s3-bucket.service';
import { WorkspaceTreeService } from 'src/app/service/workspace-tree.service';

@Component({
  selector: 'app-user-workspace',
  templateUrl: './user-workspace.component.html',
  styleUrls: ['./user-workspace.component.css'],
  providers: [S3BucketService, UserWorkspaceService, WorkspaceTreeService],
})
export class UserWorkspaceComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  modalSubscribtion: Subscription;
  editTitleEmojiSubscribtion: Subscription;
  imageUploadModalSubscription: Subscription;
  workspace: { name: string; icon: string } = { name: '', icon: '' };
  isModal: boolean | unknown;
  isEmojiBar: boolean;
  titleEmojiEdit: { bol: boolean; id: string } = { bol: false, id: '' };
  workSpaceNameUpdate: string;
  isWorkSpaceNameUpdate: boolean = false;
  isImageUpload: { bol: boolean; id: string; pageId: string } = {
    bol: false,
    id: '',
    pageId: '',
  };
  workspaceNameForm: FormGroup;

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private workspaceService: UserWorkspaceService,
    private s3Service: S3BucketService
  ) {}

  ngOnInit(): void {
    this.workspaceService.viewWorspacePage().subscribe({
      next: (response) => {
        const obj = {
          name: response.data.userDetails.workSpaces.userWorkspace.name,
          icon: response.data.userDetails.workSpaces.userWorkspace.icon,
        };
        this.workSpaceNameUpdate = obj.name;
        this.workspace = obj;

        // Page Details
        this.workspaceService.pages = response.data.pageDetails;

        // Data Transer event
        this.workspaceService.pagesDataTransfer.emit(response.data.pageDetails);
      },
      error: (error) => {
        if (error.status === 408 || 400) {
          localStorage.clear();
          this.router.navigate(['auth/signin']);
        }
      },
    });

    this.modalSubscribtion =
      this.workspaceService.isModalDataTransfer.subscribe((data) => {
        this.isModal = data;
      });

    // image upload modal
    this.imageUploadModalSubscription =
      this.workspaceService.isImageUpploadDataTransfer.subscribe((data) => {
        this.isImageUpload = data;
      });

    // Form Setup
    this.workspaceNameForm = new FormGroup({
      data: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
    });

    // Edit title icon
    this.editTitleEmojiSubscribtion =
      this.workspaceService.titleIconEditDataTransfer.subscribe((data) => {
        this.titleEmojiEdit = data;
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
    this.workspaceService.isModalDataTransfer.emit(false);
  }

  openEmojiBar() {
    this.isEmojiBar = true;
  }

  closeEmojiBar() {
    this.isEmojiBar = false;
    this.titleEmojiEdit.bol = false;
  }

  addEmoji(event: any) {
    this.workspaceService.UpdateWorkspaceIcon(event.emoji.id).subscribe({
      next: (response) => {
        this.workspace.icon = event.emoji.id;
        this.closeEmojiBar();
        this.closeModal();
        this.isWorkSpaceNameUpdate = false;
      },
      error: (error) => {
        if (error.status === 408 || 400) {
          localStorage.clear();
          this.router.navigate(['auth/signin']);
        }
      },
    });
  }

  // Edit Title icon
  addTitleEmoji(event: any, id: string) {
    document.body.style.cursor = 'wait';
    this.titleEmojiEdit.bol = false;
    this.workspaceService
      .UpdateWorkspacePageIcon(event.emoji.id, id)
      .subscribe({
        next: (response) => {
          this.workspaceService.updatePageArray(id, response.data);
          this.workspaceService.pageDataTransfer.emit(response.data);
          this.isEmojiBar = false;
          this.isWorkSpaceNameUpdate = false;
          document.body.style.cursor = 'auto';
        },
        error: (error) => {
          if (error.status === 408 || 400) {
            localStorage.clear();
            this.router.navigate(['auth/signin']);
          }
        },
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
    this.workspaceService
      .UpdateWorkspaceName(data)
      .pipe(debounceTime(1000))
      .subscribe({
        next: (response) => {
          this.isEmojiBar = false;
          this.isWorkSpaceNameUpdate = false;
          this.workspaceService.isModalDataTransfer.emit(false);

          this.workSpaceNameUpdate = data.data;
          this.workspace.name = data.data;
        },
        error: (error) => {
          if (error.status === 408 || 400) {
            localStorage.clear();
            this.router.navigate(['auth/signin']);
          }
        },
      });
  }

  // close Image Upload Modal
  closeImageUploadModal() {
    this.isImageUpload = { bol: false, id: '', pageId: '' };

    // close Option Tab  while enter / at first
    const optionTab = document.querySelector(
      '.workspace-content-menu-block'
    ) as HTMLElement;

    optionTab.style.display = 'none';
    optionTab.style.left = '0px';
    optionTab.style.top = '0px';

    document.body.style.cursor = 'auto';
  }

  // upload image
  uploadCover(event: any) {
    const file = event.target.files[0];
    if (file) {
      document.body.style.cursor = 'wait';

      // get a seccure url from a server
      this.s3Service.createUploadUrlToSecImage().subscribe({
        next: (response) => {
          const url = response.data;

          // post the image directly to the s3 bucket
          this.s3Service.uploadpageCoverImg(url, file).then((data) => {
            const imageUrl = data.url.split('?')[0];

            // post req to server to save any data
            this.workspaceService
              .UpdateWorkspaceSecImage(
                imageUrl,
                this.isImageUpload.pageId,
                this.isImageUpload.id
              )
              .subscribe({
                next: (response) => {
                  this.workspaceService.updatePageArray(
                    this.isImageUpload.pageId,
                    response.data
                  );
                  this.workspaceService.pageDataTransfer.emit(response.data);

                  this.closeImageUploadModal();

                  document.body.style.cursor = 'auto';
                },
                error: (error) => {
                  document.body.style.cursor = 'auto';
                  if (error.status === 408 || 400) {
                    localStorage.clear();
                    document.body.style.cursor = 'auto';
                    this.router.navigate(['auth/signin']);
                  }
                },
              });
          });
        },
        error: (error) => {
          document.body.style.cursor = 'auto';
          if (error.status === 408 || 400) {
            localStorage.clear();
            document.body.style.cursor = 'auto';
            this.router.navigate(['auth/signin']);
          }
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.modalSubscribtion.unsubscribe();
    this.editTitleEmojiSubscribtion.unsubscribe();
    this.imageUploadModalSubscription.unsubscribe();
  }
}
