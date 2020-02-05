import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ResizeObserver } from '@juggle/resize-observer';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';

@Directive({
  selector: '[elementWidth]',
})
export class ElementWidthDirective implements OnDestroy, OnInit {
  private _observer: ResizeObserver;
  private _symbol = Symbol();
  @Output()
  public elementWidth = new EventEmitter();

  constructor(
    private readonly _elRef: ElementRef<HTMLElement>,
    private readonly _logger: ConsoleLoggerService
  ) {}

  ngOnInit(): void {
    this._logger.warn('ngOnInit(): using a "polyfilled" ResizeObserver', 'ElementWidthDirective');

    // POLYFILL: ResizeObserver
    // not really a polyfill, but not using the native API either.
    this._observer = new ResizeObserver((entries, observer) => {
      // this directive is only ever attached to a single element
      const width = entries[0].borderBoxSize[0].inlineSize;

      this._logger.debug(
        `ResizeObserver: element width changed to ${width}px`,
        'ElementWidthDirective',
        {
          width,
          entries,
          observer,
        }
      );
      this.elementWidth.emit({ width, symbol: this._symbol });
    });

    this._observer.observe(this._elRef.nativeElement, { box: 'border-box' });
  }

  ngAfterViewInit() {
    const initialWidth = this._elRef.nativeElement.offsetWidth;
    this._logger.debug(
      `ngAfterViewInit(): emitting an initial width of ${initialWidth}px`,
      'ElementWidthDirective',
      { initialWidth }
    );

    // ! an initial value MUST be emitted
    this.elementWidth.emit({ width: initialWidth, symbol: this._symbol });
  }

  ngOnDestroy(): void {
    this._logger.debug(
      'ngOnDestroy(): disconnecting from ResizeObserver',
      'ElementWidthDirective',
      {
        elementRef: this._elRef,
      }
    );
    this._observer.disconnect();
  }
}
