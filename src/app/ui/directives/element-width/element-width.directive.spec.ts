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
      id="idOne"
    >
      fake content
    </div>
    <span [ngStyle]="{ 'width.px': width }" (elementWidth)="onSecondWidthChange($event)" id="idTwo">
      fake content two
    </span>
  `,
})
class FakeComponent implements AfterViewInit {
  public width = INITIAL_WIDTH;
  public idOne: string | null;
  public idTwo: string | null;

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

  public onWidthChange({ width: newWidth, id }: IEvent) {
    this._logger.debug(`onWidthChange(): width changed to ${newWidth}px`, 'FakeComponent', {
      oldWidth: this.width,
      newWidth,
      id,
    });
    this.width = newWidth;
    this.idOne = id;
  }

  public onSecondWidthChange({ id }: IEvent) {
    this._logger.debug(
      `onSecondWidthChange(): width not changed, id emitted instead`,
      'FakeComponent',
      {
        id,
      }
    );
    this.idTwo = id;
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

describe('ElesmentWidthDirective - getFixture()', () => {
  it('should produce a fake fixture', () => {
    expect(getFixture().fixture).toBeDefined('the fixture should be defined');
  });

  it('should produce a fake component', () => {
    expect(getFixture().component).toBeDefined('the component should be defined');
  });

  it('should produce content objects with elements, and a "click" event dispatcher', () => {
    const { contentOne, contentTwo } = getFixture();
    expect(contentOne).toBeDefined('contentOne should be defined');
    expect(contentOne.native).toBeDefined('a native element object should exists for contentOne');
    expect(contentOne.debug).toBeDefined('a debug element object should exist for contentOne');
    expect(contentOne.click).toBeDefined('a click() event dispatcher should exist for contentOne');

    expect(contentTwo).toBeDefined('contentTwo should be defined');
    expect(contentTwo.native).toBeDefined('a native element object should exist for contentTwo');
    expect(contentTwo.debug).toBeDefined('a debug element object should exist for contentTwo');
  });
});

describe('ElementWidthDirective', () => {
  describe('width', () => {
    it('should be emitted initially, before any width change events occur', async () => {
      const expected = INITIAL_WIDTH;
      const { component, contentOne, fixture } = getFixture();

      fixture.detectChanges();

      expect(component.width).toBe(expected, 'component width should be 200'); // component width property
      expect(contentOne.native.offsetWidth).toBe(
        expected,
        'offsetWidth should match component width'
      ); // element width
    });

    it('should be changed when the element width has changed', async () => {
      const expected = INITIAL_WIDTH / 2; // a click should halve the width
      const { component, contentOne, fixture } = getFixture();

      contentOne.click();
      fixture.detectChanges();

      expect(component.width).toBe(expected, 'component width should be 200/2'); // component width property
      expect(contentOne.native.offsetWidth).toBe(
        expected,
        'offsetWidth should match component.width'
      ); // element width
    });
  });

  describe('id', () => {
    it('should be emitted initially, before any width change events occur', async () => {
      const { component, fixture } = getFixture();

      fixture.detectChanges();

      expect(component.idOne).toBe('idOne', 'idOne should be initially emitted as string: "idOne"');
    });

    it('should be emitted after a width change event', async () => {
      const { component, contentOne, fixture } = getFixture();

      contentOne.click();
      fixture.detectChanges();

      expect(component.idOne).toBe('idOne', 'idOne should be a string: "idOne"');
    });

    it('should always be the same after multiple emits', async () => {
      const { component, contentOne, fixture } = getFixture();

      contentOne.click();
      fixture.detectChanges();
      const first = component.idOne;
      expect(first).toBe('idOne', 'idOne should be a string: "idOne"');

      contentOne.click();
      fixture.detectChanges();
      const second = component.idOne;

      expect(first).toEqual(second, 'idOne should be the same between emits');
    });

    it('should be different for different elements', async () => {
      const { component, contentOne, fixture } = getFixture();

      contentOne.click();
      fixture.detectChanges();

      // ! will be undefined if detectChanges() isn't run first
      const first = component.idOne;
      const second = component.idTwo;

      expect(first).toBe('idOne', 'idOne should be a string: "idOne"');
      expect(second).toBe('idTwo', 'idTwo should be a string: "idTwo"');
    });
  });
});
