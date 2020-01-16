import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostSummaryComponent } from './ui/post-summary/post-summary.component';
import { LoggerModule } from './util/logger';

@NgModule({
  declarations: [AppComponent, PostSummaryComponent],
  imports: [BrowserModule, AppRoutingModule, LoggerModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [PostSummaryComponent],
})
export class AppModule {}
