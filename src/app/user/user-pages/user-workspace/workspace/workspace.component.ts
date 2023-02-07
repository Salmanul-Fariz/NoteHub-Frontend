import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, Subject, Subscription } from 'rxjs';
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
  backgroundPositionY: string;
  backgroundImage: string;
  cursor: string = 'auto';
  isbackgroundPositionY: boolean;
  isChangeOptionClass: boolean;
  pageSectionId: string;
  isSavingContent: boolean;
  pageSectionImgSize: string;
  savePageNameSubject = new Subject<string>();
  array = [1];

  constructor(
    private workspaceService: UserWorkspaceService,
    private treeService: WorkspaceTreeService,
    private s3Service: S3BucketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.savePageNameSubject.pipe(debounceTime(500)).subscribe((value) => {
      this.pageNameUpdate(value, this.pagesDetails._id);
    });

    // Page Details
    this.pageDataTransferSb = this.workspaceService.pageDataTransfer.subscribe(
      (data: any) => {
        // tree implementation
        if (data.page) {
          data.levelPage = null;
          this.treeService.root = data.page;
          data.levelPage = this.treeService.ChangeDatatolevel();
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
              pageType = 'image';
              break;
            case 4:
              pageType = 'heading1';
              break;
            case 5:
              pageType = 'heading2';
              break;
            case 6:
              pageType = 'heading3';
              break;
            default:
              break;
          }

          if (pageType === 'image') {
            this.imageUpload();
          } else {
            this.updateSecType(this.pagesDetails._id, pageType);
          }
        }
      }
    });
  }

  // trackBy
  trackByFn(index: number, value: any) {
    return value._id;
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

  inputPage(event: any, pageSecId: string, index: number) {
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
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (height / 2 < cords.top) {
          optionTab.style.top = cords.y - 200 + 'px';
        } else {
          optionTab.style.top = cords.y + 'px';
        }

        if (width / 2 > cords.left) {
          optionTab.style.left = cords.x + 20 + 'px';
        } else {
          optionTab.style.left = cords.x - 180 + 'px';
        }

        optionTab.style.display = 'flex';
        // optionTab.style.top = cords.y + 'px';
      }
    } else {
      // close Option Tab  while enter / at first
      optionTab.style.display = 'none';
      optionTab.style.left = '0px';
      optionTab.style.top = '0px';
    }

    if (!this.isChangeOptionClass) {
      // Update user Workspace page content
      this.updateSecContent(value, this.pagesDetails._id, pageSecId);
    }
  }

  onKeydown(event: any, pageSecId: any, pageType: string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.isChangeOptionClass) {
        this.addNewNodeWithChild(pageSecId, pageType);
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
    }

    // Remove a node without child (ctrl + shift + e)
    else if (event.ctrlKey && event.shiftKey && event.keyCode === 69) {
      if (!this.isChangeOptionClass) {
        this.removeNodeWithOutChild(pageSecId, pageType);
      }
    }

    // Remove a node with child (ctrl + shift + a)
    else if (event.ctrlKey && event.shiftKey && event.keyCode === 65) {
      if (!this.isChangeOptionClass) {
        this.removeNodeWithChild(pageSecId, pageType);
      }
    }

    // Change the node to parent node (shift + tab)
    else if (event.shiftKey && event.key === 'Tab') {
      if (!this.isChangeOptionClass) {
        this.changeParentNode(pageSecId, pageType);
      }
    }

    // Change to new child with it's own child
    else if (event.key === 'Tab') {
      if (!this.isChangeOptionClass) {
        this.changeToChild(pageSecId, pageType);
      }
    }

    // Add new node Without child (ctrl + shift + Q)
    else if (event.ctrlKey && event.shiftKey && event.keyCode === 81) {
      if (!this.isChangeOptionClass) {
        this.addNewNode(pageSecId, pageType);
      }
    }
  }

  // Edit Page icon
  editPageIcon(id: string) {
    this.workspaceService.titleIconEditDataTransfer.emit({ bol: true, id: id });
  }

  // Upadte Page name
  pageNameUpdate(value: string, id: string) {
    if (value.length < 20) {
      document.body.style.cursor = 'wait';
      this.workspaceService.UpdateWorkspacePageName(value, id).subscribe({
        next: (response) => {
          this.workspaceService.updatePageArray(id, response.data);
          this.pagesDetails.title = value;
          document.body.style.cursor = 'auto';
        },
        error: (error) => {
          if (error.status === 408 || 400) {
            localStorage.clear();
            document.body.style.cursor = 'auto';
            this.router.navigate(['auth/signin']);
          }
        },
      });
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
          document.body.style.cursor = 'auto';
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
            document.body.style.cursor = 'auto';
            this.router.navigate(['auth/signin']);
          }
        },
      });
  }

  // update user Workspace page content
  updateSecContent(pageContent: string, pageId: string, pageSecId: string) {
    this.isSavingContent = true;

    this.workspaceService
      .UpdateWorkspaceSecContent(pageContent, pageSecId, pageId)
      .subscribe({
        next: (response) => {
          this.isSavingContent = false;
          this.workspaceService.updatePageArray(pageId, response.data);
        },
        error: (error) => {
          if (error.status === 408 || 400) {
            localStorage.clear();
            document.body.style.cursor = 'auto';
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
    document.body.style.cursor = 'wait';
    const optionToggle = this.pagesDetails.levelPage[index];
    optionToggle.isToggle = !optionToggle.isToggle;

    this.workspaceService
      .UpdateWorkspaceSecToggleOption(
        optionToggle.isToggle,
        optionToggle._id,
        this.pagesDetails._id
      )
      .subscribe({
        next: (response) => {
          this.workspaceService.updatePageArray(
            this.pagesDetails._id,
            response.data
          );
          this.workspaceService.pageDataTransfer.emit(response.data);

          document.body.style.cursor = 'auto';
        },
        error: (error) => {
          if (error.status === 408 || 400) {
            localStorage.clear();
            document.body.style.cursor = 'auto';
            this.router.navigate(['auth/signin']);
          }
        },
      });
  }

  // Add new node with child
  addNewNodeWithChild(pageSecId: string, pageType: string) {
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
            document.body.style.cursor = 'auto';
            this.router.navigate(['auth/signin']);
          }
        },
      });
  }

  // Add New Node
  addNewNode(pageSecId: string, pageType: string) {
    document.body.style.cursor = 'wait';

    this.workspaceService
      .AddNewSection(
        this.pagesDetails._id,
        pageSecId,
        pageType,
        '',
        'AddNewNodeWithTopNode'
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
            document.body.style.cursor = 'auto';
            this.router.navigate(['auth/signin']);
          }
        },
      });
  }

  // Change to new child with it's own child
  changeToChild(pageSecId: string, pageType: string) {
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
            document.body.style.cursor = 'auto';
            this.router.navigate(['auth/signin']);
          }
        },
      });
  }

  // Change the node to parent node
  changeParentNode(pageSecId: string, pageType: string) {
    document.body.style.cursor = 'wait';

    this.workspaceService
      .AddNewSection(
        this.pagesDetails._id,
        pageSecId,
        pageType,
        '',
        'NodeAndChangeToParentNode'
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
            document.body.style.cursor = 'auto';
            this.router.navigate(['auth/signin']);
          }
        },
      });
  }

  // Remove a node with child
  removeNodeWithChild(pageSecId: string, pageType: string) {
    document.body.style.cursor = 'wait';

    this.workspaceService
      .AddNewSection(
        this.pagesDetails._id,
        pageSecId,
        pageType,
        '',
        'RemoveNodeWithChild'
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
            document.body.style.cursor = 'auto';
            this.router.navigate(['auth/signin']);
          }
        },
      });
  }

  // Remove a node with out child
  removeNodeWithOutChild(pageSecId: string, pageType: string) {
    document.body.style.cursor = 'wait';

    this.workspaceService
      .AddNewSection(
        this.pagesDetails._id,
        pageSecId,
        pageType,
        '',
        'RemoveNodeWithOutChild'
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
            document.body.style.cursor = 'auto';
            this.router.navigate(['auth/signin']);
          }
        },
      });
  }

  // Add div section color globally
  globalClickColor() {
    const allDivs = document.querySelectorAll('.handleHover') as any;
    for (const div of allDivs) {
      div.classList.add('divClick');
    }
    setTimeout(() => {
      for (const div of allDivs) {
        div.classList.remove('divClick');
      }
    }, 1500);
  }

  // Add div section color locally
  showDivBar(id: string) {
    const div = document.querySelectorAll(`.showDivBar-${id}`) as any;
    div[0].classList.add('divClick');
    setTimeout(() => {
      div[0].classList.remove('divClick');
    }, 1500);
  }

  // global Click Clear
  globalClickClear() {
    // close Option Tab  while enter / at first
    const optionTab = document.querySelector(
      '.workspace-content-menu-block'
    ) as HTMLElement;

    optionTab.style.display = 'none';
    optionTab.style.left = '0px';
    optionTab.style.top = '0px';
  }

  // image upload EventEmitter
  imageUpload() {
    this.isChangeOptionClass = false;
    this.workspaceService.isImageUpploadDataTransfer.emit({
      bol: true,
      id: this.pageSectionId,
      pageId: this.pagesDetails._id,
    });
  }

  dragImageSize(event: any, pageSectionId: string, index: number) {
    this.pageSectionImgSize = `${event.target.value}%`;
    this.pagesDetails.levelPage[index].imgPosition = this.pageSectionImgSize;
    setTimeout(() => {
      this.updateImageSize(pageSectionId, this.pageSectionImgSize);
    }, 1000);
  }

  updateImageSize(pageSectionId: string, imageSize: string) {
    // post req to server to save any data
    this.workspaceService
      .UpdateWorkspaceSecImageSize(
        imageSize,
        this.pagesDetails._id,
        pageSectionId
      )
      .subscribe({
        next: (response) => {
          this.workspaceService.updatePageArray(
            this.pagesDetails._id,
            response.data
          );
          this.workspaceService.pageDataTransfer.emit(response.data);

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
  }

  ngOnDestroy(): void {
    this.pageDataTransferSb.unsubscribe();
  }
}
