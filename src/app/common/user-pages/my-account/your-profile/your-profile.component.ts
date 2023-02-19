import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
        // if (error.status === 408 || 400) {
        //   localStorage.clear();
        //   this.router.navigate(['auth/signin']);
        // }
      },
    });

    this.UserDetailsSubscribtion =
      this._profileService.UserDetailsDataTransfer.subscribe((data) => {
        this.userDetails = data;
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
                  // localStorage.clear();
                  // document.body.style.cursor = 'auto';
                  // this.router.navigate(['auth/signin']);
                }
              },
            });
          });
        },
        error: (error) => {
          document.body.style.cursor = 'auto';
          if (error.status === 408 || 400) {
            // localStorage.clear();
            // document.body.style.cursor = 'auto';
            // this.router.navigate(['auth/signin']);
          }
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.UserDetailsSubscribtion.unsubscribe();
  }
}
