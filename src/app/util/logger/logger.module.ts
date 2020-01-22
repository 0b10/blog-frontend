import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConsoleLoggerService } from './console-logger.service';
import { NoopLoggerService } from './noop-logger.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [ConsoleLoggerService, NoopLoggerService],
})
export class LoggerModule {}
