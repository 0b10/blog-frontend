/* tslint:disable:no-console */
import { Injectable } from '@angular/core';
import { IAnyObject, ILogger, TContext, TError } from './logger.types';

@Injectable({
  providedIn: 'root',
})
export class ConsoleLoggerService implements ILogger {
  constructor() {}

  private getContext(context?: TContext) {
    return context ? `[${context}] ` : '';
  }

  info(message: string, context?: TContext): void {
    console.info(this.getContext(context), message);
  }

  warn(message: string, context?: TContext): void {
    console.warn(this.getContext(context), message);
  }

  error(message: string, context: TContext, data?: IAnyObject): void {
    console.error(this.getContext(context), message, { data });
  }

  debug(message: string, context: TContext, data?: IAnyObject): void {
    console.debug(this.getContext(context), message, { data });
  }

  trace(message: string, context: TContext, data: IAnyObject, error?: TError): void {
    console.error(this.getContext(context), message, { data, error });
  }
}
