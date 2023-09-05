import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {MatDividerModule} from '@angular/material/divider'; 

import { AppComponent } from './app.component';
import {MatIconModule} from '@angular/material/icon';
import { FileManagerModule } from './file-manager/file-manager.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatIconModule,
    FileManagerModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
