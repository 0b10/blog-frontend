import { CommonModule } from '@angular/common';
import { isDevMode, NgModule } from '@angular/core';
import { ConsoleLoggerService } from './console-logger.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [isDevMode() ? ConsoleLoggerService : ConsoleLoggerService],
})
export class LoggerModule {}
