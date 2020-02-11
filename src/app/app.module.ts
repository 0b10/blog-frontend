import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { NavbarModule } from './ui/nav/navbar/navbar.module';
import { AppRoutingModule } from './ui/router/app-routing.module';
import { UiModule } from './ui/ui.module';
import { LoggerModule } from './util/logger';
import { ConsoleLoggerService } from './util/logger/console-logger.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    GraphQLModule,
    HttpClientModule,
    LoggerModule,
    NavbarModule,
    NgbModule,
    UiModule,
  ],
  providers: [ConsoleLoggerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
