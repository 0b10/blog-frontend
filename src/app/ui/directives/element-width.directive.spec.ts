import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConsoleLoggerService } from '../../util/logger/console-logger.service';
import { NoopLoggerService } from '../../util/logger/noop-logger.service';
import { ElementWidthDirective } from './element-width.directive';

const DEBUG = true;
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
  `,
})
class FakeComponent implements AfterViewInit {
  public width = INITIAL_WIDTH;

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

  public onWidthChange(newWidth: number) {
    this._logger.debug(`onWidthChange(): width changed to ${newWidth}px`, 'FakeComponent', {
      oldWidth: this.width,
      newWidth,
    });
    this.width = newWidth;
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
 *  the width).
 */
const getFixture = () => {
  const fixture = TestBed.configureTestingModule({
    imports: [CommonModule],
    declarations: [ElementWidthDirective, FakeComponent],
    providers: [{ provide: ConsoleLoggerService, useClass: getLogger() }],
  }).createComponent(FakeComponent);

  const component = fixture.componentInstance;
  const contentDebugEl = fixture.debugElement.query(By.css('div'));
  const contentNativeElement: HTMLDivElement = contentDebugEl.nativeElement;

  const content = {
    debug: contentDebugEl,
    native: contentNativeElement,
    click: () => contentDebugEl.triggerEventHandler('click', null),
  };

  return { fixture, component, content };
};

describe('ElementWidthDirective - getFixture()', () => {
  it('should produce a fake fixture', () => {
    expect(getFixture().fixture).toBeDefined();
  });

  it('should produce a fake component', () => {
    expect(getFixture().component).toBeDefined();
  });

  it('should produce a content object with elements, and a "click" event dispatcher', () => {
    const { content } = getFixture();
    expect(content).toBeDefined();
    expect(content.native).toBeDefined();
    expect(content.debug).toBeDefined();
    expect(content.click).toBeDefined();
  });
});

describe('ElementWidthDirective', () => {
  fit('should emit an updated width when the element size changes', async () => {
    const expected = INITIAL_WIDTH / 2; // a click should halve the width
    const { component, content, fixture } = getFixture();

    content.click();
    fixture.detectChanges();

    expect(component.width).toBe(expected); // component width property
    expect(content.native.offsetWidth).toBe(expected); // element width
  });
});
