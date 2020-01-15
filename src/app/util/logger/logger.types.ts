export type TContext = 'StubContext';
export type TError = Error;

export interface IAnyObject {
  [key: string]: any;
}

export interface ILogger {
  info(message: string, context: TContext): void;
  warn(message: string, context: TContext): void;
  error(message: string, context: TContext, data?: IAnyObject, error?: TError): void;
  debug(message: string, context: TContext): void;
  trace(message: string, context: TContext, data?: IAnyObject): void;
}
