import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { ProfileService } from 'src/app/service/profile.service';
import { S3BucketService } from 'src/app/service/s3-bucket.service';

@Component({
  selector: 'app-your-profile',
  templateUrl: './your-profile.component.html',
  styleUrls: ['./your-profile.component.css'],
})
export class YourProfileComponent implements OnInit, OnDestroy {
  userDetails: any;
  UserDetailsSubscribtion: Subscription;
  FullNameControl = new FormControl();
  UserNameControl = new FormControl();
  requiredData: boolean;
  existData: boolean;

  constructor(
    private _profileService: ProfileService,
    private router: Router,
    private s3Service: S3BucketService
  ) {}

  ngOnInit(): void {
    this._profileService.ProfileDataGetting().subscribe({
      next: (response) => {
        response.data.profilePhoto = `url(${response.data.profilePhoto})`;

        this._profileService.UserDetails = response.data;
        this.userDetails = this._profileService.UserDetails;
      },
      error: (error) => {
        if (error.status === 408 || 400) {
          localStorage.clear();
          this.router.navigate(['auth/signin']);
        }
      },
    });

    this.UserDetailsSubscribtion =
      this._profileService.UserDetailsDataTransfer.subscribe((data) => {
        this.userDetails = data;
      });

    // Full Name update
    this.FullNameControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((changedValue) => {
        this.requiredData = false;
        this.existData = false;

        if (changedValue.length > 4) {
          this._profileService.ProfileFullNameUpdate(changedValue).subscribe({
            next: (response) => {
              if (response.status === 'Null data') {
                this.requiredData = true;
              } else {
                response.data.profilePhoto = `url(${response.data.profilePhoto})`;

                this._profileService.UserDetails = response.data;
                this._profileService.UserDetailsDataTransfer.emit(
                  this._profileService.UserDetails
                );
              }
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
        } else {
          this.requiredData = true;
        }
      });

    // User Name update
    this.UserNameControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((changedValue) => {
        this.requiredData = false;
        this.existData = false;

        if (changedValue.length > 4) {
          this._profileService.ProfileUserNameUpdate(changedValue).subscribe({
            next: (response) => {
              console.log(response);

              if (response.status === 'Null data') {
                this.requiredData = true;
              } else if (response.status === 'Exist data') {
                this.existData = true;
              } else {
                response.data.profilePhoto = `url(${response.data.profilePhoto})`;

                this._profileService.UserDetails = response.data;
                this._profileService.UserDetailsDataTransfer.emit(
                  this._profileService.UserDetails
                );
              }
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
        } else {
          this.requiredData = true;
        }
      });
  }

  uploadCover(event: any) {
    const file = event.target.files[0];
    if (file) {
      document.body.style.cursor = 'wait';

      // get a seccure url from a server
      this.s3Service.updateProfileImg().subscribe({
        next: (response) => {
          const url = response.data;

          // post the image directly to the s3 bucket
          this.s3Service.uploadpageCoverImg(url, file).then((data) => {
            const imageUrl = data.url.split('?')[0];

            // post req to server to save any data
            this._profileService.ProfileImagePatch(imageUrl).subscribe({
              next: (response) => {
                response.data.profilePhoto = `url(${response.data.profilePhoto})`;

                this._profileService.UserDetails = response.data;
                this._profileService.UserDetailsDataTransfer.emit(
                  this._profileService.UserDetails
                );
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

  // Full Name update
  fullNameUpdate(event: any) {}

  ngOnDestroy(): void {
    this.UserDetailsSubscribtion.unsubscribe();
  }
}
