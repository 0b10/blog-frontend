/* tslint:disable:no-console */
import { Injectable } from '@angular/core';
import { IAnyObject, ILogger, TContext, TError } from './logger.types';

@Injectable({
  providedIn: 'root',
})
export class NoopLoggerService implements ILogger {
  info(message: string, context?: TContext): void {}

  warn(message: string, context?: TContext): void {}

  error(message: string, context: TContext, data?: IAnyObject): void {}

  debug(message: string, context: TContext, data?: IAnyObject): void {}

  trace(message: string, context: TContext, data: IAnyObject, error?: TError): void {}
}
