import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.dev';

@Injectable()
export class S3BucketService {
  constructor(private http: HttpClient) {}

  createUploadUrl(pageId: string) {
    return this.http.get<any>(
      `${environment.baseUrl}/s3/page-cover/generate-url?pageId=${pageId}`
    );
  }

  createUploadUrlToSecImage() {
    return this.http.get<any>(
      `${environment.baseUrl}/s3/page-section/generate-url`
    );
  }

  // post the image directly to the s3 bucket userWorkspace page cover
  async uploadpageCoverImg(url: string, file: string) {
    return await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: file,
    });
  }
}
