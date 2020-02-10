import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ResizeObserver } from '@juggle/resize-observer';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';

@Directive({
  selector: '[elementWidth]',
})
export class ElementWidthDirective implements OnDestroy, OnInit {
  private _observer: ResizeObserver;
  private _id: string | null;
  @Output()
  public elementWidth = new EventEmitter();

  constructor(
    private readonly _elRef: ElementRef<HTMLElement>,
    private readonly _logger: ConsoleLoggerService
  ) {}

  ngOnInit(): void {
    this._logger.warn('ngOnInit(): using a "polyfilled" ResizeObserver', 'ElementWidthDirective');

    this._id = this._elRef.nativeElement.getAttribute('id');

    // POLYFILL: ResizeObserver
    // not really a polyfill, but not using the native API either.
    this._observer = new ResizeObserver((entries, observer) => {
      // this directive is only ever attached to a single element
      const width = entries[0].borderBoxSize[0].inlineSize;

      this._logger.debug(
        `ResizeObserver: element width changed to ${width}px for element id:${this._id}`,
        'ElementWidthDirective',
        {
          width,
          entries,
          observer,
          id: this._id,
        }
      );
      this.elementWidth.emit({ width, id: this._id });
    });

    this._observer.observe(this._elRef.nativeElement, { box: 'border-box' });
  }

  ngAfterViewInit() {
    if (this.isInline) {
      const idMsg = this._id ? `See element with id: ${this._id}` : '';
      this._logger.warn(
        `an elementWidth directive cannot properly emit a width on elements with display: inline. ${idMsg}`,
        'ElementWidthDirective'
      );
    }

    const initialWidth = this._elRef.nativeElement.offsetWidth;
    this._logger.debug(
      `ngAfterViewInit(): emitting an initial width of ${initialWidth}px  for element id:${this._id}`,
      'ElementWidthDirective',
      { initialWidth, id: this._id }
    );

    // ! an initial value MUST be emitted
    this.elementWidth.emit({ width: initialWidth, id: this._id });
  }

  ngOnDestroy(): void {
    if (this._observer) {
      this._logger.debug(
        `ngOnDestroy(): disconnecting from ResizeObserver for element id:${this._id}`,
        'ElementWidthDirective',
        {
          elementRef: this._elRef,
          id: this._id,
        }
      );
      this._observer.disconnect();
    }
  }

  public get isInline() {
    const { display } = this._elRef.nativeElement.style;
    return display === 'inline';
  }
}
