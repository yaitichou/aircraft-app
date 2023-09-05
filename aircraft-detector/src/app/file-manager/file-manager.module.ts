import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
import { MatIconModule } from '@angular/material/icon';
import { DndDirective } from '../directives/dnd.directive';



@NgModule({
  declarations: [
    FileManagerComponent,
    DndDirective
  ],
  exports: [
    FileManagerComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class FileManagerModule { }
