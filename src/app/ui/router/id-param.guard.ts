import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConsoleLoggerService } from '../../util/logger/console-logger.service';

@Injectable({
  providedIn: 'root',
})
export class IdParamGuard implements CanActivate {
  private reIntString = new RegExp('^\\d+$'); // ! make sure \\d is not just d - 'prettier' likes to break this

  constructor(private readonly logger: ConsoleLoggerService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const id = next.paramMap.get('id');

    return this.isValidId(id);
  }

  private isValidId(id: string | null): boolean {
    const isValid = id === null ? false : this.reIntString.test(id);
    this.logger.debug(`isValidId(): ${isValid} validation result`, 'IdParamGuard', { isValid, id });
    return isValid;
  }
}
