import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { render, wait } from '@testing-library/angular';
import { fixture } from 'sir-helpalot';
import { ConsoleLoggerService } from '../../../../util/logger/console-logger.service';
import { NoopLoggerService } from '../../../../util/logger/noop-logger.service';
import { NavbarComponent } from '../navbar.component';
import { INavData } from '../navbar.types';
import { NavitemComponent } from '../navitem/navitem.component';

const DEBUG = false; // enable tracing and logging

const getLogger = () => (DEBUG ? ConsoleLoggerService : NoopLoggerService);

const getFakeNavs = fixture<INavData[]>([
  {
    uri: 'fakeuri1',
    text: 'fake item 1',
  },
  {
    uri: 'fakeuri2',
    text: 'fake item 2',
  },
]);

@Component({
  selector: 'fake-routed-1',
  template: '<div data-testid="fake-div-1">fake content 1</div>',
})
class FakeRoutedComponentOne {}

@Component({
  selector: 'fake-routed-2',
  template: '<div data-testid="fake-div-2">fake content 2</div>',
})
class FakeRoutedComponentTwo {}

@Component({
  selector: 'fake-display',
  template: `
    <div data-testid="fake-display">
      <app-navbar [navs]="navBarItems"></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `,
})
class FakeDisplayComponent {
  public navBarItems: INavData[] = getFakeNavs();
}

const getFakeRoutes = fixture<Routes>([
  { path: 'fakeuri1', component: FakeRoutedComponentOne },
  { path: 'fakeuri2', component: FakeRoutedComponentTwo },
]);

const renderComponent = (navs = getFakeNavs()) => {
  return render(FakeDisplayComponent, {
    // render the display component, because it contains the <router-outlet /> (and nav component)
    imports: [
      CommonModule,
      RouterModule.forRoot(getFakeRoutes(), { enableTracing: DEBUG }),
      NgbAccordionModule,
      FontAwesomeModule,
    ],
    declarations: [
      FakeRoutedComponentOne,
      FakeRoutedComponentTwo,
      NavbarComponent,
      NavitemComponent,
    ],
    providers: [{ provide: ConsoleLoggerService, useClass: getLogger() }],
  });
};

const INITIAL_WIDTH = 700;
const NAVS: INavData[] = [
  { text: 'text 1', uri: '/uri1' },
  { text: 'text 2', uri: '/uri2' },
];

@Component({
  template: `
    <div [ngStyle]="{ 'width.px': width }" (click)="onClick()">
      <app-navbar [navs]="{{ navs }}"></app-navbar>
    </div>
  `,
})
class FakeWrapperComponent {
  public width = INITIAL_WIDTH;
  public navs = NAVS;

  public onClick() {
    // toggle width
    this.width = this.width === INITIAL_WIDTH ? 200 : INITIAL_WIDTH;
  }
}

/**
 * Produce a component, fixture, and objects related to the element with the directive - like
 *  the nativElement, and debugElement objects, and also a click event dispatcher (which changes
 *  the width). Two separate elements are also provided - contentOne, contentTwo
 */

// const getFixture = () => {
//   const fixture = TestBed.configureTestingModule({
//     imports: [
//       CommonModule,
//       ElementWidthModule,
//       FontAwesomeModule,
//       NgbAccordionModule,
//       RouterModule,
//     ],
//     declarations: [NavbarComponent],
//     providers: [{ provide: ConsoleLoggerService, useClass: getLogger() }],
//   }).createComponent(FakeWrapperComponent);

//   const component = fixture.componentInstance;
//   click = fixture.debugElement.query(By.css('.fake-wrapper'))

//   return { fixture, component };
// };

type TFactoryArgs = Partial<{
  logger: ConsoleLoggerService | NoopLoggerService;
  activePanelIds: string[];
  vertical: boolean;
  navs: INavData[];
}>;

const factoryDefaults: Required<TFactoryArgs> = {
  logger: new NoopLoggerService(),
  activePanelIds: ['1', '2', '3'],
  vertical: false,
  navs: [
    { text: 'text 1', uri: '/uri1' },
    { text: 'text 2', uri: '/uri2' },
  ],
};

const componentFactory = ({
  logger = factoryDefaults.logger,
  activePanelIds = factoryDefaults.activePanelIds,
  vertical = factoryDefaults.vertical,
  navs = factoryDefaults.navs,
}: TFactoryArgs = factoryDefaults) => {
  const component = new NavbarComponent(logger as ConsoleLoggerService);

  component.navs = navs;
  component.activePanelIds = activePanelIds;
  component.vertical = vertical;

  const ids = component.navsWithId.map(({ id }) => id);

  return { component, navs, ids };
};

// TODO: #e2e, test responsive elements
//  test that:
//    * the hamgburger menu isn't displayed when the navbar is horizontal
//    * the hamburger meny is displayed when the navbar is vertical
//    * navigation items appear when the hamburger menu is clicked
//        - routing has already been tested here
describe('NavbarComponent', () => {
  it('should initialise', async () => {
    const component = await renderComponent();
    expect(component).toBeTruthy();
  });

  it('should display navigation text', async () => {
    const { getByText } = await renderComponent();
    expect(getByText('fake item 1')).toBeTruthy();
    expect(getByText('fake item 2')).toBeTruthy();
  });

  it('should route when clicked', async () => {
    const { click, getByText, queryByText } = await renderComponent();
    // check the content isn't displayed initially - so that when it's found, it's because of routing
    expect(queryByText('fake content 1')).not.toBeTruthy();
    expect(queryByText('fake content 2')).not.toBeTruthy();

    // click item 1
    const item1 = getByText('fake item 1');
    click(item1);
    await wait(() => {
      const content1 = getByText('fake content 1');
      expect(content1).toBeTruthy();
    });

    // click item 2
    const item2 = getByText('fake item 2');
    click(item2);
    await wait(() => {
      const content2 = getByText('fake content 2');
      expect(content2).toBeTruthy();
    });
  });

  describe('navsWidthId', () => {
    it('should produce navs with ids', () => {
      const { component, navs } = componentFactory();
      component.navs = navs;
      const navsWithId = component.navsWithId;
      const ids = component.navsWithId.map(({ id }) => id);

      ids.forEach((id, index) => {
        expect(id).toBeTruthy('id should be a non-empty string');
        expect(id).toBe(navsWithId[index].id, 'id should match the generated one');
      });
    });

    it('should produce the same number of navs as the provided navs', () => {
      const { component, navs } = componentFactory();
      component.navs = navs;
      const navsWithId = component.navsWithId;

      expect(navs.length).toBe(
        navsWithId.length,
        'navs should not be different, except for a new id'
      );
    });

    it('should produce the exact same items', () => {
      const { component, navs } = componentFactory();
      component.navs = navs;
      const navsWithIdRemoved = component.navsWithId.map(({ text, uri }) => ({ text, uri }));

      expect(navs).toEqual(navsWithIdRemoved, 'navs should not be different, except for a new id');
    });
  });

  describe('vertical/horizontal', () => {
    interface IFixture {
      description: string; // it(description)
      delta: number; // navbar (delta) width, relative to total nav items width: +1/-1 +bigger/-smaller
      vertical: boolean;
    }

    const fixtures: IFixture[] = [
      // boundaries
      {
        description: 'should be horizontal when navbar is larger than navitems',
        delta: 1,
        vertical: false,
      },
      {
        description: 'should be vertical when navbar is smaller than navitems',
        delta: -1,
        vertical: true,
      },
      {
        description: 'should be vertical when navbar is the same width as navitems',
        delta: 0,
        vertical: true,
      },
      // typical
      {
        description: 'should be horizontal when navbar is much larger than navitems',
        delta: 500,
        vertical: false,
      },
      {
        description: 'should be horizontal when navbar is much smaller than navitems',
        delta: -200,
        vertical: true,
      },
    ];

    fixtures.forEach(({ description, delta, vertical: expected }) => {
      it(description, () => {
        const { component, navs, ids } = componentFactory();
        const navItemWidth = 200;
        const navbarWidth = navItemWidth * navs.length + delta; // larger than total nav items

        ids.forEach((id) => {
          // resize all to same size
          component.onNavitemResize({ width: navItemWidth, id });
        });
        component.onNavbarResize({ width: navbarWidth, id: null }); // id doesn't matter

        expect(component.vertical).toBe(expected, `vertical should be ${expected}`);
      });
    });
  });

  fdescribe('togglePanel', () => {
    it("should remove an existing panel id from activePanelIds when it's toggled", () => {
      const activePanelIds = ['1', '2', '3'];
      const { component } = componentFactory({ activePanelIds });

      component.togglePanel('1');
      expect(component.activePanelIds).toEqual(['2', '3']);

      component.togglePanel('2');
      expect(component.activePanelIds).toEqual(['3']);

      component.togglePanel('3');
      expect(component.activePanelIds).toEqual([]);
    });

    it("should add a non-existent panel id to activePanelIds when it's toggled", () => {
      const activePanelIds = [];
      const { component } = componentFactory({ activePanelIds });

      component.togglePanel('1');
      expect(component.activePanelIds).toEqual(['1']);

      component.togglePanel('2');
      expect(component.activePanelIds).toEqual(['1', '2']);
    });
  });
});
