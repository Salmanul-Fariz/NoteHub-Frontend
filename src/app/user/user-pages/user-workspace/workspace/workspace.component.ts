import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { S3BucketService } from 'src/app/service/s3-bucket.service';
import { UserWorkspaceService } from 'src/app/service/userWorkspace.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  isOpenOptionTab: boolean;
  pageDataTransferSb: Subscription;
  pageEmpty: boolean = true;
  pagesDetails: any;
  setTimerUpdateName: ReturnType<typeof setTimeout>;
  backgroundPositionY: string;
  backgroundImage: string;
  array = [1];

  constructor(
    private workspaceService: UserWorkspaceService,
    private s3Service: S3BucketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Page Details
    this.pageDataTransferSb = this.workspaceService.pageDataTransfer.subscribe(
      (data) => {
        this.pagesDetails = data;

        if (this.pagesDetails.coverImg.url) {
          this.backgroundPositionY = `${this.pagesDetails.coverImg.positionY}`;
          this.backgroundImage = `url(${this.pagesDetails.coverImg.url})`;
        }

        if (data) {
          this.pageEmpty = false;
        }
      }
    );
  }

  // open Option Tab  while enter / at first
  openOptionTab(event: any) {
    const cords = event.target.getBoundingClientRect();
    const value = (<HTMLElement>event.target).innerHTML;

    const optionTab = document.querySelector(
      '.workspace-content-menu-block'
    ) as HTMLElement;

    if (value.length === 1) {
      if (value.charCodeAt(0) === 47) {
        optionTab.style.display = 'flex';
        optionTab.style.left = cords.x + 20 + 'px';
        optionTab.style.top = cords.y + 'px';
      }
    } else {
      // close Option Tab  while enter / at first
      optionTab.style.display = 'none';
      optionTab.style.left = '0px';
      optionTab.style.top = '0px';
    }
  }

  onKeydown(event: any, id: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Push new div
      this.array.push(1);

      // Put caret cursor (statc)
      setTimeout(() => {
        const newDiv = document.getElementById(`1-${this.array.length - 1}`);
        if (newDiv) {
          newDiv.focus();
        }
      }, 0);
    } else if (event.key === 'Backspace') {
      const sel = window.getSelection();
      if (sel) {
        const range = sel.getRangeAt(0);
        const currentIndex = range.startOffset;
        if (currentIndex === 0) {
          const myDiv = document.getElementById(`${id.element}-${id.i - 1}`);
          const range = document.createRange();
          const sel = window.getSelection();
          if (myDiv && sel) {
            if (myDiv.innerText.length !== 0) {
              range.setStart(myDiv.childNodes[0], myDiv.innerText.length);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
            }
            myDiv.focus();
          }
        }
      }
    }
  }

  // Edit Page icon
  editPageIcon(id: string) {
    this.workspaceService.titleIconEditDataTransfer.emit({ bol: true, id: id });
  }

  // Upadte Page name
  pageNameUpdate(event: any, id: string) {
    clearTimeout(this.setTimerUpdateName);
    if (event.target.value.length < 20) {
      this.setTimerUpdateName = setTimeout(() => {
        document.body.style.cursor = 'wait';
        this.workspaceService
          .UpdateWorkspacePageName(event.target.value, id)
          .subscribe({
            next: (response) => {
              this.workspaceService.updatePageArray(id, response.data);
              this.workspaceService.pageDataTransfer.emit(response.data);
              document.body.style.cursor = 'auto';
            },
            error: (error) => {
              if (error.status === 408 || 400) {
                localStorage.clear();
                this.router.navigate(['auth/signin']);
              }
            },
          });
      }, 1000);
    }
  }

  // Cover image upload
  uploadCover(event: any, pageId: string) {
    const file = event.target.files[0];
    if (file) {
      document.body.style.cursor = 'wait';

      // get a seccure url from a server
      this.s3Service.createUploadUrl().subscribe({
        next: (response) => {
          const url = response.data;

          // post the image directly to the s3 bucket
          this.s3Service.uploadpageCoverImg(url, file).then((data) => {
            const imageUrl = data.url.split('?')[0];

            // post req to server to save any data
            this.workspaceService
              .UpdateWorkspaceCoverImage(imageUrl, pageId)
              .subscribe({
                next: (response) => {
                  this.workspaceService.updatePageArray(pageId, response.data);
                  this.workspaceService.pageDataTransfer.emit(response.data);
                  document.body.style.cursor = 'auto';
                },
                error: (error) => {
                  document.body.style.cursor = 'auto';
                  if (error.status === 408 || 400) {
                    localStorage.clear();
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
            this.router.navigate(['auth/signin']);
          }
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.pageDataTransferSb.unsubscribe();
  }
}
