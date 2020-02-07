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
  selector: 'stub-component',
  template: '<p class=".stub-p">stub component</p>',
  styles: [':host { display: block; }'], // host components are displau: inline by default, can't get width from inline
})
class StubComponent {}

@Component({
  template: `
    <div (click)="onClick()">
      <pre [ngStyle]="{ 'width.px': width }" (elementWidth)="onWidthChange($event)" id="idOne">
      fake content
      </pre
      >
      <span
        [ngStyle]="{ 'width.px': width }"
        (elementWidth)="onSecondWidthChange($event)"
        id="idTwo"
      >
        fake content two
      </span>
      <stub-component
        class=".stub"
        [ngStyle]="{ 'width.px': width }"
        (elementWidth)="onStubComponentResize($event)"
        id="stubComponentId"
      ></stub-component>
    </div>
  `,
})
class FakeComponent implements AfterViewInit {
  public width = INITIAL_WIDTH;
  public idOne: string | null;
  public idTwo: string | null;

  public stubComponentId: string | null;
  public stubComponentWidth: number;

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

  public onStubComponentResize({ width, id }: IEvent) {
    this._logger.debug(`onStubComponentResize(): id and width emitted`, 'FakeComponent', {
      width,
      id,
    });
    this.stubComponentId = id;
    this.stubComponentWidth = width;
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
 *  the width). Two separate elements are also provided - elementOne, elementTwo
 */
const getFakeFixture = () => {
  const fixture = TestBed.configureTestingModule({
    imports: [CommonModule],
    declarations: [ElementWidthDirective, FakeComponent, StubComponent],
    providers: [{ provide: ConsoleLoggerService, useClass: getLogger() }],
  }).createComponent(FakeComponent);

  const component = fixture.componentInstance;

  // container
  const containerDebugEl = fixture.debugElement.query(By.css('div'));
  const containerNativeEl: HTMLDivElement = containerDebugEl.nativeElement;
  // content one
  const elementOneDebugEl = fixture.debugElement.query(By.css('pre'));
  const elementOneNativeEl: HTMLPreElement = elementOneDebugEl.nativeElement;
  // content two
  const elementTwoDebugEl = fixture.debugElement.query(By.css('span'));
  const elementTwoNativeEl: HTMLSpanElement = elementTwoDebugEl.nativeElement;
  // stub-component
  const stubComponentDebugEl = fixture.debugElement.query(By.css('p'));

  const container = {
    debug: containerDebugEl,
    native: containerNativeEl,
    click: () => containerDebugEl.triggerEventHandler('click', null),
  };

  const elementOne = {
    debug: elementOneDebugEl,
    native: elementOneNativeEl,
  };

  const elementTwo = {
    debug: elementTwoDebugEl,
    native: elementTwoNativeEl,
  };

  const stubComponentHostEl = {
    debug: stubComponentDebugEl,
  };

  return {
    component,
    container,
    elementOne,
    elementTwo,
    fixture,
    stubComponentHostEl,
  };
};

describe('ElementWidthDirective - getFixture()', () => {
  it('should produce a fake fixture', () => {
    expect(getFakeFixture().fixture).toBeDefined('the fixture should be defined');
  });

  it('should produce a fake component', () => {
    expect(getFakeFixture().component).toBeDefined('the component should be defined');
  });

  it('should produce all the appropriate fixture objects', () => {
    const { elementOne, elementTwo, stubComponentHostEl, container } = getFakeFixture();

    // container
    expect(container).toBeDefined('the container should be defined');
    expect(container.click).toBeDefined('a click() event dispatcher should exist for container');

    // element one
    expect(elementOne).toBeDefined('elementOne should be defined');
    expect(elementOne.native).toBeDefined('a native element object should exists for elementOne');
    expect(elementOne.debug).toBeDefined('a debug element object should exist for elementOne');

    // element two
    expect(elementTwo).toBeDefined('elementTwo should be defined');
    expect(elementTwo.native).toBeDefined('a native element object should exist for elementTwo');
    expect(elementTwo.debug).toBeDefined('a debug element object should exist for elementTwo');

    // stub component
    expect(stubComponentHostEl).toBeDefined('stubComponentHostEl should be defined');
    expect(stubComponentHostEl.debug).toBeDefined(
      'a debug element object should exist for stubComponentHostEl'
    );
  });
});

describe('ElementWidthDirective', () => {
  describe('width', () => {
    it('should be emitted initially, before any width change events occur', async () => {
      const expected = INITIAL_WIDTH;
      const { component, elementOne, fixture } = getFakeFixture();

      fixture.detectChanges();

      expect(component.width).toBe(expected, 'component width should be 200'); // component width property
      expect(elementOne.native.offsetWidth).toBe(
        expected,
        'offsetWidth should match component width'
      ); // element width
    });

    it('should be changed when the element width has changed', async () => {
      const expected = INITIAL_WIDTH / 2; // a click should halve the width
      const { component, elementOne, fixture, container } = getFakeFixture();

      container.click();
      fixture.detectChanges();

      expect(component.width).toBe(expected, 'component width should be 200/2'); // component width property
      expect(elementOne.native.offsetWidth).toBe(
        expected,
        'offsetWidth should match component.width'
      ); // element width
    });
  });

  describe('id', () => {
    it('should be emitted initially, before any width change events occur', async () => {
      const { component, fixture } = getFakeFixture();

      fixture.detectChanges();

      expect(component.idOne).toBe('idOne', 'idOne should be initially emitted as string: "idOne"');
    });

    it('should be emitted after a width change event', async () => {
      const { component, elementOne, fixture, container } = getFakeFixture();

      container.click();
      fixture.detectChanges();

      expect(component.idOne).toBe('idOne', 'idOne should be a string: "idOne"');
    });

    it('should always be the same after multiple emits', async () => {
      const { component, elementOne, fixture, container } = getFakeFixture();

      container.click();
      fixture.detectChanges();
      const first = component.idOne;
      expect(first).toBe('idOne', 'idOne should be a string: "idOne"');

      container.click();
      fixture.detectChanges();
      const second = component.idOne;

      expect(first).toEqual(second, 'idOne should be the same between emits');
    });

    it('should be different for different elements', async () => {
      const { component, container, fixture } = getFakeFixture();

      container.click();
      fixture.detectChanges();

      // ! will be undefined if detectChanges() isn't run first
      const first = component.idOne;
      const second = component.idTwo;

      expect(first).toBe('idOne', 'idOne should be a string: "idOne"');
      expect(second).toBe('idTwo', 'idTwo should be a string: "idTwo"');
    });
  });

  describe('component hosts', () => {
    it("should initially emit an id, when it's set", () => {
      const { component, fixture } = getFakeFixture();
      fixture.detectChanges();
      expect(component.stubComponentId).toBe(
        'stubComponentId',
        'stubComponentId should be set to stubComponentId'
      );
    });

    it('should emit an id, when the width is changed', () => {
      const { component, fixture, container } = getFakeFixture();
      container.click();
      fixture.detectChanges();
      expect(component.stubComponentId).toBe(
        'stubComponentId',
        'stubComponentId should be set to stubComponentId'
      );
    });

    it('should initially emit a width', () => {
      const { component, fixture } = getFakeFixture();
      fixture.detectChanges();
      expect(component.stubComponentWidth).toBeDefined(
        'stubComponentWidth should be a number (width)'
      );
      expect(component.stubComponentWidth).toBeGreaterThan(
        0,
        'stubComponentWidth should be initialised to a width > 0'
      );
    });

    it("should emit an updated width when it's width changes", () => {
      const { component, fixture, container } = getFakeFixture();

      container.click();
      fixture.detectChanges();

      expect(component.stubComponentWidth).toEqual(
        INITIAL_WIDTH / 2,
        'stubComponentWidth should have changed after a click()'
      );
    });
  });
});
