import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IElementWidthService } from './element-width.types';

@Injectable({
  providedIn: 'root',
})
export class ElementWidthService implements IElementWidthService {
  width$: Subject<number>;

  constructor() {
    this.width$ = new Subject();
  }

  public set width(width: number) {
    this.width$.next(width);
  }
}
