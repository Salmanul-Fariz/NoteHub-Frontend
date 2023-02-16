import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    PickerModule,
    EmojiModule,
    MatSelectModule,
    MatTableModule,
    DragDropModule,
  ],
  exports: [
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    PickerModule,
    EmojiModule,
    MatSelectModule,
    MatTableModule,
    DragDropModule,
  ],
})
export class SharedModule {}
