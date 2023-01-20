import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

import { UserWorkspaceService } from 'src/app/service/userWorkspace.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-user-workspace',
  templateUrl: './user-workspace.component.html',
  styleUrls: ['./user-workspace.component.css'],
})
export class UserWorkspaceComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isOpenOptionTab: boolean;
  array = [1];

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private userWorspaceService: UserWorkspaceService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.userWorspaceService
      .viewWorspacePage(localStorage.getItem('jwt'))
      .subscribe(
        (response) => {},
        (error) => {
          if (error.status === 408) {
            localStorage.clear();
            this.router.navigate(['/auth/sigin']);
          }
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
    console.log(event);

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
      console.log(event);

      if (event.target.innerHTML === '') {
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
