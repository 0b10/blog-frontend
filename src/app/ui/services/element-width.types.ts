import { Subject } from 'rxjs';

export class IElementWidthService {
  width$: Subject<number>;
  width: number;
}
