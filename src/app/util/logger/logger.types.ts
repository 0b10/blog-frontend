export type TContext =
  | 'IdParamGuard'
  | 'NavbarComponent'
  | 'PostDetailComponent'
  | 'PostDetailService'
  | 'PostsComponent'
  | 'PostsService';

// 'any' means gql error object can be passed in. Error.stack, Error.name will still be visible
//  for Error
export type TError = any; // do a type guard if you intent to process Error objects

export interface IAnyObject {
  [key: string]: any;
}

export interface ILogger {
  info(message: string, context: TContext): void;
  warn(message: string, context: TContext): void;
  error(message: string, context: TContext, data?: IAnyObject): void;
  trace(message: string, context: TContext, data?: IAnyObject, error?: TError): void;
  debug(message: string, context: TContext, data?: IAnyObject): void;
}
