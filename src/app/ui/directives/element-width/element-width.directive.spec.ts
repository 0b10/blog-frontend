import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';
import { NoopLoggerService } from '../../../util/logger/noop-logger.service';
import { ElementWidthDirective } from './element-width.directive';
import { IEvent } from './element-width.types';

const DEBUG = false;
const INITIAL_WIDTH = 200;

const getLogger = () => (DEBUG ? ConsoleLoggerService : NoopLoggerService);

@Component({
  template: `
    <div
      [ngStyle]="{ 'width.px': width }"
      (elementWidth)="onWidthChange($event)"
      (click)="onClick()"
    >
      fake content
    </div>
    <span [ngStyle]="{ 'width.px': width }" (elementWidth)="onSecondWidthChange($event)">
      fake content two
    </span>
  `,
})
class FakeComponent implements AfterViewInit {
  public width = INITIAL_WIDTH;
  public symbolOne: Symbol;
  public symbolTwo: Symbol;

  constructor(private _elRef: ElementRef<HTMLElement>, private _logger: ConsoleLoggerService) {}

  public onClick() {
    const newWidth = this.width / 2;
    this._logger.debug(
      `onClick(): changing offsetWidth from ${this.width} to ${newWidth}`,
      'FakeComponent',
      { oldWidth: this.width, newWidth }
    );

    this.width = newWidth;
  }

  public onWidthChange({ width: newWidth, symbol }: IEvent) {
    this._logger.debug(`onWidthChange(): width changed to ${newWidth}px`, 'FakeComponent', {
      oldWidth: this.width,
      newWidth,
    });
    this.width = newWidth;
    this.symbolOne = symbol;
  }

  public onSecondWidthChange({ symbol }: IEvent) {
    this._logger.debug(
      `onSecondWidthChange(): width not changed, symbol emitted instead`,
      'FakeComponent',
      {
        symbol,
      }
    );
    this.symbolTwo = symbol;
  }

  ngAfterViewInit(): void {
    const { clientWidth, offsetWidth } = this._elRef.nativeElement;
    this._logger.debug(
      `ngAfterViewInit(): view offsetWidth initialised as ${offsetWidth}`,
      'FakeComponent',
      { clientWidth, offsetWidth, width: this.width }
    );
  }
}

/**
 * Produce a component, fixture, and objects related to the element with the directive - like
 *  the nativElement, and debugElement objects, and also a click event dispatcher (which changes
 *  the width). Two separate elements are also provided - contentOne, contentTwo
 */
const getFixture = () => {
  const fixture = TestBed.configureTestingModule({
    imports: [CommonModule],
    declarations: [ElementWidthDirective, FakeComponent],
    providers: [{ provide: ConsoleLoggerService, useClass: getLogger() }],
  }).createComponent(FakeComponent);

  const component = fixture.componentInstance;
  // content one
  const contentDebugEl = fixture.debugElement.query(By.css('div'));
  const contentNativeElement: HTMLDivElement = contentDebugEl.nativeElement;
  // content two
  const contentTwoDebugEl = fixture.debugElement.query(By.css('span'));
  const contentTwoNativeElement: HTMLDivElement = contentTwoDebugEl.nativeElement;

  const contentOne = {
    debug: contentDebugEl,
    native: contentNativeElement,
    click: () => contentDebugEl.triggerEventHandler('click', null),
  };

  const contentTwo = {
    debug: contentTwoDebugEl,
    native: contentTwoNativeElement,
  };

  return { fixture, component, contentOne, contentTwo };
};

describe('ElementWidthDirective - getFixture()', () => {
  it('should produce a fake fixture', () => {
    expect(getFixture().fixture).toBeDefined();
  });

  it('should produce a fake component', () => {
    expect(getFixture().component).toBeDefined();
  });

  it('should produce a content object with elements, and a "click" event dispatcher', () => {
    const { contentOne } = getFixture();
    expect(contentOne).toBeDefined();
    expect(contentOne.native).toBeDefined();
    expect(contentOne.debug).toBeDefined();
    expect(contentOne.click).toBeDefined();
  });
});

describe('ElementWidthDirective', () => {
  describe('width', () => {
    it('should be emitted initially, before any width change events occur', async () => {
      const expected = INITIAL_WIDTH;
      const { component, contentOne, fixture } = getFixture();

      fixture.detectChanges();

      expect(component.width).toBe(expected); // component width property
      expect(contentOne.native.offsetWidth).toBe(expected); // element width
    });

    it('should be changed when the element width has changed', async () => {
      const expected = INITIAL_WIDTH / 2; // a click should halve the width
      const { component, contentOne, fixture } = getFixture();

      contentOne.click();
      fixture.detectChanges();

      expect(component.width).toBe(expected); // component width property
      expect(contentOne.native.offsetWidth).toBe(expected); // element width
    });
  });

  describe('symbol', () => {
    it('should be emitted initially, before any width change events occur', async () => {
      const { component, fixture } = getFixture();

      fixture.detectChanges();

      expect(typeof component.symbolOne).toBe(typeof Symbol());
    });

    it('should beemitted after a width change event', async () => {
      const { component, contentOne, fixture } = getFixture();

      contentOne.click();
      fixture.detectChanges();

      expect(typeof component.symbolOne).toBe(typeof Symbol());
    });

    it('should always be the same reference for the same instance', async () => {
      const { component, contentOne, fixture } = getFixture();

      contentOne.click();
      fixture.detectChanges();
      const first = component.symbolOne;

      contentOne.click();
      fixture.detectChanges();
      const second = component.symbolOne;

      expect(first).toEqual(second);
    });

    it('shoulds be a unique reference for each unique instance of the directive', async () => {
      const { component, contentOne, fixture } = getFixture();

      contentOne.click();
      fixture.detectChanges();

      // ! will be undefined if detectChanges() isn't run first
      const first = component.symbolOne;
      const second = component.symbolTwo;

      expect(typeof first).toBe(typeof Symbol(), 'symbolOne should be a symbol');
      expect(typeof second).toBe(typeof Symbol(), 'symbolTwo should be a symbol');

      expect(first).not.toEqual(second, 'The symbols should not be the same reference');
    });
  });
});
