import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { S3BucketService } from 'src/app/service/s3-bucket.service';
import { UserWorkspaceService } from 'src/app/service/userWorkspace.service';
import { WorkspaceTreeService } from 'src/app/service/workspace-tree.service';

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
  setTimerUpdateContent: ReturnType<typeof setTimeout>;
  backgroundPositionY: string;
  backgroundImage: string;
  cursor: string = 'auto';
  isbackgroundPositionY: boolean;
  isChangeOptionClass: boolean;
  pageSectionId: string;
  isSavingContent: boolean;
  isToggleOption: boolean;
  array = [1];

  constructor(
    private workspaceService: UserWorkspaceService,
    private treeService: WorkspaceTreeService,
    private s3Service: S3BucketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Page Details
    this.pageDataTransferSb = this.workspaceService.pageDataTransfer.subscribe(
      (data: any) => {
        // tree implementation
        if (data.page) {
          data.levelPage = null;
          this.treeService.root = data.page;
          data.levelPage = this.treeService.ChangeDatatolevel();
          console.log(data.levelPage);
        }

        this.pagesDetails = data;

        if (this.pagesDetails.coverImg.url) {
          this.backgroundPositionY = `${this.pagesDetails.coverImg.positionY}%`;
          this.backgroundImage = `url(${this.pagesDetails.coverImg.url})`;
        }

        if (data) {
          this.pageEmpty = false;
        }
      }
    );

    // change options to next options
    window.addEventListener('keydown', (event: any) => {
      if (this.isChangeOptionClass) {
        const options = document.querySelectorAll(
          '.workspace-content-menu-block-list'
        ) as NodeListOf<HTMLElement>;
        if (event.keyCode === 40) {
          // Options arrow down
          this.changeOptionArrow(1, 0, options.length - 1, options);
        }

        if (event.keyCode === 38) {
          // Options arrow top
          this.changeOptionArrow(-1, options.length - 1, 0, options);
        }

        // update data with enter key and arrow
        if (event.keyCode === 13) {
          let currentIndex: number = 0;
          options.forEach((el, index) => {
            const isContain = el.classList.contains('optionsBar');

            if (isContain) {
              currentIndex = index;
            }
          });

          let pageType: string = '';

          switch (currentIndex) {
            case 0:
              pageType = 'text';
              break;
            case 1:
              pageType = 'bullet';
              break;
            case 2:
              pageType = 'toggle';
              break;
            case 3:
              pageType = 'heading1';
              break;
            case 4:
              pageType = 'heading2';
              break;
            case 5:
              pageType = 'heading3';
              break;
            default:
              break;
          }

          this.updateSecType(this.pagesDetails._id, pageType);
        }
      }
    });
  }

  // Change the options with arrow key
  changeOptionArrow(
    addIndex: number,
    lastAddIndex: number,
    endIndex: number,
    options: NodeListOf<HTMLElement>
  ) {
    let currentIndex: number = 0;
    options.forEach((el, index) => {
      const isContain = el.classList.contains('optionsBar');

      if (isContain) {
        currentIndex = index;
      }
    });

    // add and remove hover effect
    if (currentIndex === endIndex) {
      options[currentIndex].classList.remove('optionsBar');
      options[lastAddIndex].classList.add('optionsBar');
      options[lastAddIndex].focus();
    } else {
      options[currentIndex].classList.remove('optionsBar');
      options[currentIndex + addIndex].classList.add('optionsBar');
      options[lastAddIndex + addIndex].focus();
    }
  }

  // close the options active
  closeActiveOption() {
    const options = document.querySelectorAll(
      '.workspace-content-menu-block-list'
    ) as NodeListOf<HTMLElement>;

    options.forEach((el) => {
      el.classList.remove('optionsBar');
    });
  }

  inputPage(event: any, pageSecId: string) {
    this.isChangeOptionClass = false;
    this.closeActiveOption();

    const cords = event.target.getBoundingClientRect();
    const value = (<HTMLElement>event.target).innerText;

    const optionTab = document.querySelector(
      '.workspace-content-menu-block'
    ) as HTMLElement;

    const options = document.querySelectorAll(
      '.workspace-content-menu-block-list'
    ) as NodeListOf<HTMLElement>;

    options[0].classList.add('optionsBar');

    // open Option Tab  while enter / at first
    if (value.length === 1) {
      if (value.charCodeAt(0) === 47) {
        this.isChangeOptionClass = true;
        this.pageSectionId = pageSecId;

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

    if (!this.isChangeOptionClass) {
      // Update user Workspace page content
      clearTimeout(this.setTimerUpdateContent);
      this.isSavingContent = true;
      this.setTimerUpdateContent = setTimeout(() => {
        this.updateSecContent(value, this.pagesDetails._id, pageSecId);
      }, 1000);
    }
  }

  onKeydown(event: any, pageSecId: any, pageType: string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.isChangeOptionClass) {
        document.body.style.cursor = 'wait';

        this.workspaceService
          .AddNewSection(
            this.pagesDetails._id,
            pageSecId,
            pageType,
            '',
            'TopNodeInsert'
          )
          .subscribe({
            next: (response) => {
              this.workspaceService.updatePageArray(
                this.pagesDetails._id,
                response.data.data
              );
              this.workspaceService.pageDataTransfer.emit(response.data.data);
              document.body.style.cursor = 'auto';

              // Put caret cursor
              setTimeout(() => {
                const newDiv = document.getElementById(response.data.id);
                if (newDiv) {
                  newDiv.focus();
                }
              }, 0);
            },
            error: (error) => {
              if (error.status === 408 || 400) {
                localStorage.clear();
                this.router.navigate(['auth/signin']);
              }
            },
          });
      }
    } else if (event.key === 'Backspace') {
      const sel = window.getSelection();
      if (sel) {
        const range = sel.getRangeAt(0);
        const currentIndex = range.startOffset;
        if (currentIndex === 0) {
          // when toggle is no there remove other type
          this.pageSectionId = pageSecId;
          this.updateSecType(this.pagesDetails._id, 'text');

          // const myDiv = document.getElementById(`${id.element}-${id.i - 1}`);
          // const range = document.createRange();
          // const sel = window.getSelection();
          // if (myDiv && sel) {
          //   if (myDiv.innerText.length !== 0) {
          //     range.setStart(myDiv.childNodes[0], myDiv.innerText.length);
          //     range.collapse(true);
          //     sel.removeAllRanges();
          //     sel.addRange(range);
          //   }
          //   myDiv.focus();
          // }
        }
      }
    } else if (event.key === 'Tab') {
      if (!this.isChangeOptionClass) {
        document.body.style.cursor = 'wait';

        this.workspaceService
          .AddNewSection(
            this.pagesDetails._id,
            pageSecId,
            pageType,
            '',
            'ParentInsert'
          )
          .subscribe({
            next: (response) => {
              this.workspaceService.updatePageArray(
                this.pagesDetails._id,
                response.data.data
              );
              this.workspaceService.pageDataTransfer.emit(response.data.data);
              document.body.style.cursor = 'auto';
              // Put caret cursor
              setTimeout(() => {
                const newDiv = document.getElementById(pageSecId);
                if (newDiv) {
                  newDiv.focus();
                }
              }, 0);
            },
            error: (error) => {
              if (error.status === 408 || 400) {
                localStorage.clear();
                this.router.navigate(['auth/signin']);
              }
            },
          });
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

  // drag Open Cover Image
  dragOpenCoverImage() {
    this.isbackgroundPositionY = true;
    this.cursor = 'move';
  }

  // drag Close Cover Image
  dragCloseCoverImage() {
    this.cursor = 'auto';
    this.isbackgroundPositionY = false;
    this.backgroundPositionY = `${this.pagesDetails.coverImg.positionY}%`;
  }

  // Change the value
  dragYPosition(event: any) {
    this.backgroundPositionY = `${event.target.value}%`;
  }

  // drag Save Cover Image
  dragSaveCoverImage(pageId: string) {
    document.body.style.cursor = 'wait';
    const data = +this.backgroundPositionY.split('%')[0];
    this.workspaceService.UpdateWorkspaceCoverPosition(data, pageId).subscribe({
      next: (response) => {
        this.cursor = 'auto';
        this.isbackgroundPositionY = false;
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
  }

  // update workspace page section type
  updateSecType(pageId: string, pageType: string) {
    this.isChangeOptionClass = false;
    document.body.style.cursor = 'wait';
    this.workspaceService
      .UpdateWorkspaceSecType(pageType, this.pageSectionId, pageId)
      .subscribe({
        next: (response) => {
          // close Option Tab  while enter / at first
          const optionTab = document.querySelector(
            '.workspace-content-menu-block'
          ) as HTMLElement;

          optionTab.style.display = 'none';

          this.workspaceService.updatePageArray(pageId, response.data);
          this.workspaceService.pageDataTransfer.emit(response.data);

          // For focus the cursor
          setTimeout(() => {
            const currentDiv = document.getElementById(
              this.pageSectionId
            ) as HTMLElement;
            currentDiv.focus();
          }, 0);

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

  // update user Workspace page content
  updateSecContent(pageContent: string, pageId: string, pageSecId: string) {
    document.body.style.cursor = 'wait';
    this.workspaceService
      .UpdateWorkspaceSecContent(pageContent, pageSecId, pageId)
      .subscribe({
        next: (response) => {
          this.isSavingContent = false;

          this.workspaceService.updatePageArray(pageId, response.data);
          this.workspaceService.pageDataTransfer.emit(response.data);

          // For focus the cursor
          setTimeout(() => {
            const currentDiv = document.getElementById(
              pageSecId
            ) as HTMLElement;
            const range = document.createRange();
            const sel = window.getSelection();
            if (currentDiv && sel) {
              if (currentDiv.innerText.length !== 0) {
                range.setStart(
                  currentDiv.childNodes[0],
                  currentDiv.innerText.length
                );
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
              }
            }
          }, 0);

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

  // display the handle
  displayHandle(id: string) {
    const div = document.getElementById(`handle-${id}`) as HTMLElement;
    div.style.display = 'flex';
  }

  // none the handle
  noneHandle(id: string) {
    const div = document.getElementById(`handle-${id}`) as HTMLElement;
    div.style.display = 'none';
  }

  // Toggle options
  toggleOption(index: string, id: string) {
    const toggle = document.getElementById(`toggle-${id}`) as HTMLElement;
    let openToggle = false;

    if (!this.isToggleOption) {
      console.log('STart');

      toggle.style.transform = 'rotate(90deg)';
      openToggle = true;
    } else {
      toggle.style.transform = 'rotate(0)';
    }

    this.isToggleOption = !this.isToggleOption;

    const percentage: number = Number(
      this.pagesDetails.levelPage[index].level.split('%')[0]
    );

    let elIndex = Number(index);
    let stop = false;
    while (!stop) {
      elIndex++;
      const el = this.pagesDetails.levelPage[elIndex];

      const curPercent = el?.level.split('%')[0];

      if (
        percentage === Number(curPercent) ||
        percentage < Number(curPercent) ||
        this.pagesDetails.levelPage.length === elIndex
      ) {
        stop = true;
      } else {
        const div = document.getElementById(`main-${el._id}`) as HTMLElement;
        if (openToggle) {
          div.style.display = 'block';
        } else {
          div.style.display = 'none';
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.pageDataTransferSb.unsubscribe();
  }
}
