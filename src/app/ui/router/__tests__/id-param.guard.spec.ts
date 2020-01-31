import { inject, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import fc from 'fast-check';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';
import { NoopLoggerService } from '../../../util/logger/noop-logger.service';
import { IdParamGuard } from '../id-param.guard';

const ENABLE_LOGGER = false; // enable the injected logger service

const getLogger = () => (ENABLE_LOGGER ? ConsoleLoggerService : NoopLoggerService);

const notImplementedError = () => {
  const message =
    'This fake object has not implemented this method yet - implement it within the test module';
  console.error(message);
  throw Error(message);
};

const activatedRouteSnapFactory = (id: string) => {
  // ! So far, only get() is required.
  const arSnap = new ActivatedRouteSnapshot();
  arSnap.paramMap.get = (name) => ({ id }[name]); // just a single param: id, the rest === undefined
  arSnap.paramMap.has = notImplementedError;
  arSnap.paramMap.getAll = notImplementedError;
  return arSnap;
};

const getFakes = (id: string) => {
  const arSnap = activatedRouteSnapFactory(id);
  const rsSnap = (null as unknown) as RouterStateSnapshot; // unused, will throw null pointer if it is

  return { arSnap, rsSnap };
};

describe('IdParamGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdParamGuard, { provide: ConsoleLoggerService, useClass: getLogger() }],
    });
  });

  describe('canActivate()', () => {
    it('should pass for any digit string', inject([IdParamGuard], (guard: IdParamGuard) => {
      fc.assert(
        fc.property(fc.integer(0, Number.MAX_SAFE_INTEGER), (id) => {
          const { arSnap, rsSnap } = getFakes(id.toString());
          return guard.canActivate(arSnap, rsSnap) === true;
        }),
        { verbose: true }
      );
    }));

    it('should fail for any non-digit string', inject([IdParamGuard], (guard: IdParamGuard) => {
      fc.assert(
        fc.property(fc.anything(), (id) => {
          const idString = String(id);
          fc.pre(!/^\d+$/.test(idString)); // not a digit string
          const { arSnap, rsSnap } = getFakes(idString);
          return guard.canActivate(arSnap, rsSnap) === false;
        }),
        { verbose: true }
      );
    }));
  });
});
